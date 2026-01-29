import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SPREADSHEET_ID = '1o60JBFkwIPJ9GqqN1ziR5G8gZxelqzfHKYAgYbdbank';
const ALERT_EMAIL = 'action@together-kc.com';

// Initialize Google Sheets API with service account
function getGoogleSheets() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Initialize Gmail API for sending notifications
function getGmail() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
  });

  return google.gmail({ version: 'v1', auth });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const formType = data.formType || 'endorsement';

    const sheets = getGoogleSheets();
    const timestamp = new Date().toISOString();

    if (formType === 'endorsement') {
      const row = [
        timestamp,
        data.type || 'individual',
        data.name || '',
        data.organization || '',
        data.email || '',
        data.why || '',
        data.consent ? 'Yes' : 'No',
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Endorsements!A:G',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [row],
        },
      });

      // Send email notification (fire and forget - don't wait)
      sendEmailNotification(
        `New Endorsement: ${data.name}`,
        `New endorsement received!\n\n` +
          `Type: ${data.type}\n` +
          `Name: ${data.name}\n` +
          (data.organization ? `Organization: ${data.organization}\n` : '') +
          `Email: ${data.email}\n` +
          (data.why ? `Why they support: ${data.why}\n` : '') +
          `\nView all endorsements: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`
      ).catch(console.error);

      return NextResponse.json({ success: true });
    } else if (formType === 'contact') {
      const row = [
        timestamp,
        data.name || '',
        data.email || '',
        data.subject || '',
        data.message || '',
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Contact!A:E',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [row],
        },
      });

      // Send email notification (fire and forget)
      sendEmailNotification(
        `New Contact Form: ${data.subject || 'No Subject'}`,
        `New contact form submission!\n\n` +
          `Name: ${data.name}\n` +
          `Email: ${data.email}\n` +
          `Subject: ${data.subject || 'N/A'}\n` +
          `Message:\n${data.message}\n` +
          `\nView all contacts: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`
      ).catch(console.error);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown form type' }, { status: 400 });
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}

async function sendEmailNotification(subject: string, body: string) {
  // Using fetch to call our own MCP server or a simple SMTP relay
  // For now, we'll use a simple approach with the Resend API if configured
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log('Email notification skipped (no RESEND_API_KEY):', subject);
    return;
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Together KC <notifications@together-kc.com>',
        to: ALERT_EMAIL,
        subject,
        text: body,
      }),
    });
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Together KC Form Handler' });
}
