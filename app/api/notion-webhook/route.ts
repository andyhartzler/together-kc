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

// Fetch a single page from Notion
async function fetchNotionPage(pageId: string) {
  const notionToken = process.env.NOTION_API_KEY;
  if (!notionToken) {
    throw new Error('NOTION_API_KEY not configured');
  }

  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: {
      'Authorization': `Bearer ${notionToken}`,
      'Notion-Version': '2022-06-28',
    },
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status}`);
  }

  return response.json();
}

// Property extractors
function getTitle(prop: { title?: { plain_text: string }[] }): string {
  return prop?.title?.[0]?.plain_text || '';
}

function getRichText(prop: { rich_text?: { plain_text: string }[] }): string {
  return prop?.rich_text?.[0]?.plain_text || '';
}

function getEmail(prop: { email?: string }): string {
  return prop?.email || '';
}

function getPhone(prop: { phone_number?: string }): string {
  return prop?.phone_number || '';
}

function getSelect(prop: { select?: { name: string } }): string {
  return prop?.select?.name || '';
}

// Find Google Contact by Notion ID
async function findGoogleContactByNotionId(notionId: string) {
  const people = getPeopleApi();

  const response = await people.people.connections.list({
    resourceName: 'people/me',
    pageSize: 1000,
    personFields: 'names,emailAddresses,phoneNumbers,organizations,biographies,memberships,metadata',
  });

  const contacts = response.data.connections || [];

  for (const contact of contacts) {
    const bio = contact.biographies?.[0]?.value || '';
    if (bio.includes(`Notion ID: ${notionId}`)) {
      return contact;
    }
  }

  return null;
}

// Create or update Google Contact from Notion page
async function syncNotionPageToGoogle(page: {
  id: string;
  properties: Record<string, unknown>;
}) {
  const people = getPeopleApi();
  const props = page.properties;

  const notionContact = {
    notionId: page.id,
    outlet: getTitle(props['Outlet/Contact'] as { title?: { plain_text: string }[] }),
    contactName: getRichText(props['Contact Name'] as { rich_text?: { plain_text: string }[] }),
    email: getEmail(props['Email'] as { email?: string }),
    phone: getPhone(props['Phone'] as { phone_number?: string }),
    type: getSelect(props['Type'] as { select?: { name: string } }),
    beatFocus: getRichText(props['Beat/Focus'] as { rich_text?: { plain_text: string }[] }),
    notes: getRichText(props['Notes'] as { rich_text?: { plain_text: string }[] }),
    status: getSelect(props['Status'] as { select?: { name: string } }),
  };

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

  // Check if contact already exists
  const existingContact = await findGoogleContactByNotionId(page.id);

  if (existingContact) {
    // Update existing
    const contactData = {
      etag: existingContact.etag,
      names: [{
        givenName,
        familyName,
        displayName,
      }],
      emailAddresses: notionContact.email ? [{ value: notionContact.email, type: 'work' }] : [],
      phoneNumbers: notionContact.phone ? [{ value: notionContact.phone, type: 'work' }] : [],
      organizations: notionContact.outlet ? [{ name: notionContact.outlet, title: notionContact.beatFocus || undefined }] : [],
      biographies: [{ value: bioText, contentType: 'TEXT_PLAIN' as const }],
    };

    await people.people.updateContact({
      resourceName: existingContact.resourceName!,
      updatePersonFields: 'names,emailAddresses,phoneNumbers,organizations,biographies',
      requestBody: contactData,
    });

    return { action: 'updated', name: displayName };
  } else {
    // Create new
    const contactData = {
      names: [{
        givenName,
        familyName,
        displayName,
      }],
      emailAddresses: notionContact.email ? [{ value: notionContact.email, type: 'work' }] : [],
      phoneNumbers: notionContact.phone ? [{ value: notionContact.phone, type: 'work' }] : [],
      organizations: notionContact.outlet ? [{ name: notionContact.outlet, title: notionContact.beatFocus || undefined }] : [],
      biographies: [{ value: bioText, contentType: 'TEXT_PLAIN' as const }],
      memberships: [{
        contactGroupMembership: {
          contactGroupResourceName: PRESS_GROUP_RESOURCE_NAME,
        },
      }],
    };

    await people.people.createContact({
      requestBody: contactData,
    });

    return { action: 'created', name: displayName };
  }
}

// Delete Google Contact by Notion ID
async function deleteGoogleContactByNotionId(notionId: string) {
  const people = getPeopleApi();
  const contact = await findGoogleContactByNotionId(notionId);

  if (contact) {
    await people.people.deleteContact({
      resourceName: contact.resourceName!,
    });
    return { action: 'deleted', resourceName: contact.resourceName };
  }

  return { action: 'not_found' };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Notion webhook received:', JSON.stringify(body, null, 2));

    // Handle webhook verification
    if (body.verification_token) {
      return NextResponse.json({ challenge: body.challenge });
    }

    let result;

    // Format 1: Notion Database Automation - sends page data directly
    // The automation sends: { data: { ... page properties ... } }
    if (body.data && body.data.properties) {
      // Direct page data from automation
      const pageId = body.data.id;
      const page = body.data;

      // Verify it's from our database
      const parentDbId = page.parent?.database_id;
      if (parentDbId && parentDbId.replace(/-/g, '') !== NOTION_DATABASE_ID.replace(/-/g, '')) {
        console.log('Ignoring page from different database');
        return NextResponse.json({ success: true, ignored: true });
      }

      result = await syncNotionPageToGoogle(page);
    }
    // Format 2: API Webhook events (page.created, page.properties_updated, etc.)
    else if (body.type) {
      const eventType = body.type;
      const pageId = body.data?.id || body.entity?.id;

      // Only process events for our Media Contacts database
      const parentDbId = body.data?.parent?.database_id || body.entity?.parent?.database_id;
      if (parentDbId && parentDbId.replace(/-/g, '') !== NOTION_DATABASE_ID.replace(/-/g, '')) {
        console.log('Ignoring event from different database');
        return NextResponse.json({ success: true, ignored: true });
      }

      if (eventType === 'page.created' || eventType === 'page.content_updated' || eventType === 'page.properties_updated') {
        const page = await fetchNotionPage(pageId);
        result = await syncNotionPageToGoogle(page);
      } else if (eventType === 'page.deleted' || eventType === 'page.moved_to_trash') {
        result = await deleteGoogleContactByNotionId(pageId);
      } else {
        console.log('Unhandled event type:', eventType);
        result = { action: 'ignored', eventType };
      }
    }
    // Format 3: Simple page ID passed (manual trigger or custom automation)
    else if (body.page_id || body.id) {
      const pageId = body.page_id || body.id;
      const page = await fetchNotionPage(pageId);
      result = await syncNotionPageToGoogle(page);
    }
    else {
      console.log('Unknown webhook format:', Object.keys(body));
      result = { action: 'unknown_format', keys: Object.keys(body) };
    }

    console.log('Webhook processed:', result);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Notion Webhook Endpoint for Media Contacts sync',
  });
}
