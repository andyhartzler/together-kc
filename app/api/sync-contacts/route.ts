import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const NOTION_DATABASE_ID = '6e81e92b-3e6d-431f-a7e8-b2f6240c05df';
const PRESS_GROUP_RESOURCE_NAME = 'contactGroups/1cce75910e68ab93';
const IMPERSONATE_EMAIL = 'action@together-kc.com';

// Initialize Google People API with service account + domain-wide delegation
function getPeopleApi() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/contacts'],
    clientOptions: {
      subject: IMPERSONATE_EMAIL,
    },
  });

  return google.people({ version: 'v1', auth });
}

// Fetch contacts from Notion via their API
async function fetchNotionContacts(): Promise<NotionContact[]> {
  const notionToken = process.env.NOTION_API_KEY;
  if (!notionToken) {
    throw new Error('NOTION_API_KEY not configured');
  }

  const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${notionToken}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      page_size: 100,
    }),
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status}`);
  }

  const data = await response.json();

  return data.results.map((page: NotionPage) => {
    const props = page.properties;
    return {
      notionId: page.id,
      outlet: getTitle(props['Outlet/Contact']),
      contactName: getRichText(props['Contact Name']),
      email: getEmail(props['Email']),
      phone: getPhone(props['Phone']),
      type: getSelect(props['Type']),
      beatFocus: getRichText(props['Beat/Focus']),
      notes: getRichText(props['Notes']),
      status: getSelect(props['Status']),
    };
  });
}

// Notion property extractors
interface NotionPage {
  id: string;
  properties: Record<string, NotionProperty>;
}

interface NotionProperty {
  type: string;
  title?: { plain_text: string }[];
  rich_text?: { plain_text: string }[];
  email?: string;
  phone_number?: string;
  select?: { name: string };
}

interface NotionContact {
  notionId: string;
  outlet: string;
  contactName: string;
  email: string;
  phone: string;
  type: string;
  beatFocus: string;
  notes: string;
  status: string;
}

function getTitle(prop: NotionProperty | undefined): string {
  return prop?.title?.[0]?.plain_text || '';
}

function getRichText(prop: NotionProperty | undefined): string {
  return prop?.rich_text?.[0]?.plain_text || '';
}

function getEmail(prop: NotionProperty | undefined): string {
  return prop?.email || '';
}

function getPhone(prop: NotionProperty | undefined): string {
  return prop?.phone_number || '';
}

function getSelect(prop: NotionProperty | undefined): string {
  return prop?.select?.name || '';
}

// Fetch existing Google Contacts in the Press group
async function fetchGoogleContacts() {
  const people = getPeopleApi();

  const response = await people.people.connections.list({
    resourceName: 'people/me',
    pageSize: 1000,
    personFields: 'names,emailAddresses,phoneNumbers,organizations,biographies,memberships,metadata',
  });

  const contacts = response.data.connections || [];

  // Filter to only Press group members
  return contacts.filter(contact =>
    contact.memberships?.some(m =>
      m.contactGroupMembership?.contactGroupResourceName === PRESS_GROUP_RESOURCE_NAME
    )
  );
}

// Create a new Google Contact
async function createGoogleContact(notionContact: NotionContact) {
  const people = getPeopleApi();

  const displayName = notionContact.contactName || notionContact.outlet;
  const nameParts = displayName.split(' ');
  const givenName = nameParts[0] || '';
  const familyName = nameParts.slice(1).join(' ') || '';

  // Store Notion metadata in biographies for sync tracking
  const bioText = [
    notionContact.type && `Type: ${notionContact.type}`,
    notionContact.status && `Status: ${notionContact.status}`,
    notionContact.notes && `Notes: ${notionContact.notes}`,
    `Notion ID: ${notionContact.notionId}`,
  ].filter(Boolean).join('\n');

  return people.people.createContact({
    requestBody: {
      names: [{
        givenName,
        familyName,
        displayName,
      }],
      memberships: [{
        contactGroupMembership: {
          contactGroupResourceName: PRESS_GROUP_RESOURCE_NAME,
        },
      }],
      emailAddresses: notionContact.email ? [{ value: notionContact.email, type: 'work' }] : undefined,
      phoneNumbers: notionContact.phone ? [{ value: notionContact.phone, type: 'work' }] : undefined,
      organizations: notionContact.outlet ? [{ name: notionContact.outlet, title: notionContact.beatFocus || undefined }] : undefined,
      biographies: bioText ? [{ value: bioText, contentType: 'TEXT_PLAIN' }] : undefined,
    },
  });
}

// Update existing Google Contact
async function updateGoogleContact(resourceName: string, notionContact: NotionContact, etag: string) {
  const people = getPeopleApi();

  const displayName = notionContact.contactName || notionContact.outlet;
  const nameParts = displayName.split(' ');
  const givenName = nameParts[0] || '';
  const familyName = nameParts.slice(1).join(' ') || '';

  const bioText = [
    notionContact.type && `Type: ${notionContact.type}`,
    notionContact.status && `Status: ${notionContact.status}`,
    notionContact.notes && `Notes: ${notionContact.notes}`,
    `Notion ID: ${notionContact.notionId}`,
  ].filter(Boolean).join('\n');

  return people.people.updateContact({
    resourceName,
    updatePersonFields: 'names,emailAddresses,phoneNumbers,organizations,biographies',
    requestBody: {
      etag,
      names: [{
        givenName,
        familyName,
        displayName,
      }],
      emailAddresses: notionContact.email ? [{ value: notionContact.email, type: 'work' }] : [],
      phoneNumbers: notionContact.phone ? [{ value: notionContact.phone, type: 'work' }] : [],
      organizations: notionContact.outlet ? [{ name: notionContact.outlet, title: notionContact.beatFocus || undefined }] : [],
      biographies: bioText ? [{ value: bioText, contentType: 'TEXT_PLAIN' }] : [],
    },
  });
}

// Extract Notion ID from Google Contact biography
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNotionIdFromContact(contact: any): string | null {
  const bio = contact.biographies?.[0]?.value || '';
  const match = bio.match(/Notion ID: ([a-f0-9-]+)/);
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Starting Notion → Google Contacts sync...');

    // Fetch from both sources
    const [notionContacts, googleContacts] = await Promise.all([
      fetchNotionContacts(),
      fetchGoogleContacts(),
    ]);

    console.log(`Found ${notionContacts.length} Notion contacts, ${googleContacts.length} Google contacts`);

    // Build map of existing Google contacts by Notion ID
    const googleByNotionId = new Map<string, typeof googleContacts[0]>();
    for (const contact of googleContacts) {
      const notionId = getNotionIdFromContact(contact);
      if (notionId) {
        googleByNotionId.set(notionId, contact);
      }
    }

    const results = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // Sync each Notion contact to Google
    for (const notionContact of notionContacts) {
      try {
        const existingGoogle = googleByNotionId.get(notionContact.notionId);

        if (existingGoogle) {
          // Update existing contact
          await updateGoogleContact(
            existingGoogle.resourceName!,
            notionContact,
            existingGoogle.etag!
          );
          results.updated++;
        } else {
          // Create new contact
          await createGoogleContact(notionContact);
          results.created++;
        }

        // Rate limiting - Google API has quotas
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        const errorMsg = `Failed to sync ${notionContact.contactName || notionContact.outlet}: ${error}`;
        console.error(errorMsg);
        results.errors.push(errorMsg);
      }
    }

    console.log('Sync complete:', results);

    return NextResponse.json({
      success: true,
      ...results,
      notionTotal: notionContacts.length,
      googleTotal: googleContacts.length,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Notion ↔ Google Contacts Sync API',
    usage: 'POST to trigger sync',
  });
}
