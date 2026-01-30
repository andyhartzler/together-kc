// Initial sync of all Notion Media Contacts to Google Contacts
// Run with: NOTION_API_KEY=xxx GOOGLE_SERVICE_ACCOUNT_KEY=xxx node scripts/initial-sync.js

require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = '6e81e92b-3e6d-431f-a7e8-b2f6240c05df';
const PRESS_GROUP_RESOURCE_NAME = 'contactGroups/1cce75910e68ab93';
const IMPERSONATE_EMAIL = 'action@together-kc.com';

// Load service account from environment variable
const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

function getPeopleApi() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/contacts'],
    clientOptions: {
      subject: IMPERSONATE_EMAIL,
    },
  });
  return google.people({ version: 'v1', auth });
}

async function fetchAllNotionContacts() {
  const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page_size: 100 }),
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status}`);
  }

  const data = await response.json();
  return data.results;
}

function getTitle(prop) {
  return prop?.title?.[0]?.plain_text || '';
}

function getRichText(prop) {
  return prop?.rich_text?.[0]?.plain_text || '';
}

function getEmail(prop) {
  return prop?.email || '';
}

function getPhone(prop) {
  return prop?.phone_number || '';
}

function getSelect(prop) {
  return prop?.select?.name || '';
}

async function findGoogleContactByNotionId(people, notionId) {
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

async function syncContact(people, page) {
  const props = page.properties;

  const notionContact = {
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

  const displayName = notionContact.contactName || notionContact.outlet;
  if (!displayName) {
    console.log('  Skipping - no name');
    return { action: 'skipped', reason: 'no name' };
  }

  const nameParts = displayName.split(' ');
  const givenName = nameParts[0] || '';
  const familyName = nameParts.slice(1).join(' ') || '';

  const bioText = [
    notionContact.type && `Type: ${notionContact.type}`,
    notionContact.status && `Status: ${notionContact.status}`,
    notionContact.notes && `Notes: ${notionContact.notes}`,
    `Notion ID: ${notionContact.notionId}`,
  ].filter(Boolean).join('\n');

  const existingContact = await findGoogleContactByNotionId(people, page.id);

  if (existingContact) {
    await people.people.updateContact({
      resourceName: existingContact.resourceName,
      updatePersonFields: 'names,emailAddresses,phoneNumbers,organizations,biographies',
      requestBody: {
        etag: existingContact.etag,
        names: [{ givenName, familyName, displayName }],
        emailAddresses: notionContact.email ? [{ value: notionContact.email, type: 'work' }] : [],
        phoneNumbers: notionContact.phone ? [{ value: notionContact.phone, type: 'work' }] : [],
        organizations: notionContact.outlet ? [{ name: notionContact.outlet, title: notionContact.beatFocus || undefined }] : [],
        biographies: [{ value: bioText, contentType: 'TEXT_PLAIN' }],
      },
    });
    return { action: 'updated', name: displayName };
  } else {
    await people.people.createContact({
      requestBody: {
        names: [{ givenName, familyName, displayName }],
        emailAddresses: notionContact.email ? [{ value: notionContact.email, type: 'work' }] : [],
        phoneNumbers: notionContact.phone ? [{ value: notionContact.phone, type: 'work' }] : [],
        organizations: notionContact.outlet ? [{ name: notionContact.outlet, title: notionContact.beatFocus || undefined }] : [],
        biographies: [{ value: bioText, contentType: 'TEXT_PLAIN' }],
        memberships: [{
          contactGroupMembership: {
            contactGroupResourceName: PRESS_GROUP_RESOURCE_NAME,
          },
        }],
      },
    });
    return { action: 'created', name: displayName };
  }
}

async function main() {
  console.log('Fetching contacts from Notion...');
  const notionPages = await fetchAllNotionContacts();
  console.log(`Found ${notionPages.length} contacts in Notion\n`);

  const people = getPeopleApi();
  const results = { created: 0, updated: 0, skipped: 0, errors: 0 };

  for (let i = 0; i < notionPages.length; i++) {
    const page = notionPages[i];
    const outlet = getTitle(page.properties['Outlet/Contact']);
    console.log(`[${i + 1}/${notionPages.length}] ${outlet}`);

    try {
      const result = await syncContact(people, page);
      console.log(`  -> ${result.action}: ${result.name || result.reason || ''}`);

      if (result.action === 'created') results.created++;
      else if (result.action === 'updated') results.updated++;
      else if (result.action === 'skipped') results.skipped++;

      // Rate limit
      await new Promise(r => setTimeout(r, 200));
    } catch (error) {
      console.log(`  -> ERROR: ${error.message}`);
      results.errors++;
    }
  }

  console.log('\n=== SYNC COMPLETE ===');
  console.log(`Created: ${results.created}`);
  console.log(`Updated: ${results.updated}`);
  console.log(`Skipped: ${results.skipped}`);
  console.log(`Errors: ${results.errors}`);
}

main().catch(console.error);
