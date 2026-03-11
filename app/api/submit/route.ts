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
    } else if (formType === 'yardSign') {
      const isPickup = data.fulfillment === 'pickup' || data.address === 'PICKUP';
      const fulfillment = isPickup ? 'Pickup' : 'Delivery';
      const address = isPickup ? 'PICKUP - Next Page KC' : (data.address || '');

      const row = [
        timestamp,
        data.name || '',
        data.phone || '',
        address,
        data.email || '',
        fulfillment,
        'Pending',
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Yard Signs!A:G',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [row],
        },
      });

      // Send internal notification (fire and forget)
      sendEmailNotification(
        `New Yard Sign Request: ${data.name} (${fulfillment})`,
        `New yard sign request!\n\n` +
          `Name: ${data.name}\n` +
          `Fulfillment: ${fulfillment}\n` +
          (isPickup ? '' : `Address: ${address}\n`) +
          `Email: ${data.email}\n` +
          (data.phone ? `Phone: ${data.phone}\n` : '') +
          `\nView all requests: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`
      ).catch(console.error);

      // Send confirmation email to the requester
      if (data.email) {
        sendYardSignConfirmation(data.name || '', data.email, isPickup).catch(console.error);
      }

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

async function sendYardSignConfirmation(name: string, email: string, isPickup: boolean) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.log('Yard sign confirmation skipped (no RESEND_API_KEY)');
    return;
  }

  const BASE = 'https://together-kc.com';
  const firstName = name.split(' ')[0];

  const pickupBlock = isPickup
    ? `<tr><td style="padding:0 32px 24px;">
        <div style="background:#f0f7ff;border-radius:12px;padding:20px;text-align:center;">
          <p style="margin:0 0 4px;font-size:14px;color:#1e3a5f;font-weight:600;">Your pickup location</p>
          <p style="margin:0;font-size:15px;color:#333;">Next Page KC</p>
          <p style="margin:0;font-size:15px;color:#333;">1216 Brooklyn Ave, Kansas City, MO</p>
          <p style="margin:4px 0 0;font-size:13px;color:#666;">Monday &ndash; Friday, 9:00 AM &ndash; 4:00 PM</p>
        </div>
      </td></tr>`
    : `<tr><td style="padding:0 32px 24px;text-align:center;">
        <p style="margin:0;font-size:15px;color:#333;">We&rsquo;ll deliver your sign as soon as possible. We&rsquo;ll reach out if we need to confirm anything.</p>
      </td></tr>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

  <!-- Header -->
  <tr><td style="background:#1e3a5f;padding:32px 32px 24px;text-align:center;">
    <img src="${BASE}/images/together-kc-footer.png" alt="Together KC" width="200" style="max-width:200px;height:auto;" />
  </td></tr>

  <!-- Hero -->
  <tr><td style="background:linear-gradient(135deg,#1e3a5f 0%,#2a4f7f 100%);padding:24px 32px 32px;text-align:center;">
    <p style="margin:0 0 8px;font-size:48px;line-height:1;">&#127994;</p>
    <h1 style="margin:0 0 8px;font-size:24px;color:#ffffff;font-weight:700;">Your Yard Sign is on the way!</h1>
    <p style="margin:0;font-size:16px;color:rgba(255,255,255,0.85);">Thanks for standing with Kansas City, ${firstName}.</p>
  </td></tr>

  <!-- Fulfillment info -->
  <tr><td style="padding:28px 32px 8px;text-align:center;">
    <p style="margin:0;font-size:15px;color:#333;line-height:1.6;">
      We appreciate you showing your support for renewing the earnings tax. Every sign in a yard helps spread the word!
    </p>
  </td></tr>
  ${pickupBlock}

  <!-- Divider -->
  <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #e8e8e8;margin:0;" /></td></tr>

  <!-- Get Involved -->
  <tr><td style="padding:24px 32px 8px;text-align:center;">
    <h2 style="margin:0 0 16px;font-size:18px;color:#1e3a5f;font-weight:700;">More ways to get involved</h2>
  </td></tr>

  <!-- Action buttons -->
  <tr><td style="padding:0 32px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="48%" style="padding-right:8px;">
          <a href="${BASE}/endorsements" style="display:block;text-align:center;padding:14px 8px;background:#e53935;color:#ffffff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Add Your Endorsement</a>
        </td>
        <td width="48%" style="padding-left:8px;">
          <a href="${BASE}/faqs" style="display:block;text-align:center;padding:14px 8px;background:#4a90d9;color:#ffffff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Learn the Facts</a>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding:0 32px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="48%" style="padding-right:8px;">
          <a href="${BASE}/donate" style="display:block;text-align:center;padding:14px 8px;background:#1e3a5f;color:#ffffff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Donate</a>
        </td>
        <td width="48%" style="padding-left:8px;">
          <a href="${BASE}" style="display:block;text-align:center;padding:14px 8px;background:#f5a623;color:#ffffff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Visit Our Website</a>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Election reminder -->
  <tr><td style="padding:0 32px 24px;">
    <div style="background:#fff8f0;border:1px solid #f5a623;border-radius:12px;padding:16px;text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">Election Day</p>
      <p style="margin:0;font-size:22px;color:#1e3a5f;font-weight:700;">April 7, 2026</p>
      <p style="margin:4px 0 0;font-size:13px;color:#666;">Early voting begins March 24</p>
    </div>
  </td></tr>

  <!-- Divider -->
  <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #e8e8e8;margin:0;" /></td></tr>

  <!-- Social -->
  <tr><td style="padding:24px 32px 8px;text-align:center;">
    <p style="margin:0 0 12px;font-size:14px;color:#1e3a5f;font-weight:600;">Follow us on social media</p>
    <table role="presentation" cellpadding="0" cellspacing="0" align="center">
      <tr>
        <td style="padding:0 6px;"><a href="https://www.facebook.com/TogetherKC/"><img src="${BASE}/images/social/facebook.png" alt="Facebook" width="28" height="28" style="display:block;border:0;" /></a></td>
        <td style="padding:0 6px;"><a href="https://x.com/TogetherKCMO"><img src="${BASE}/images/social/x.png" alt="X" width="28" height="28" style="display:block;border:0;" /></a></td>
        <td style="padding:0 6px;"><a href="https://www.instagram.com/togetherkcmo/"><img src="${BASE}/images/social/instagram.png" alt="Instagram" width="28" height="28" style="display:block;border:0;" /></a></td>
        <td style="padding:0 6px;"><a href="https://www.threads.com/@togetherkcmo"><img src="${BASE}/images/social/threads.png" alt="Threads" width="28" height="28" style="display:block;border:0;" /></a></td>
        <td style="padding:0 6px;"><a href="https://www.tiktok.com/@togetherkcmo"><img src="${BASE}/images/social/tiktok.png" alt="TikTok" width="28" height="28" style="display:block;border:0;" /></a></td>
      </tr>
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:20px 32px 28px;text-align:center;">
    <p style="margin:0;font-size:11px;color:#999;line-height:1.5;">
      Paid for by Together KC, Dan Kopp, Treasurer.<br />
      Not authorized by any candidate or candidate committee.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Together KC <notifications@together-kc.com>',
        to: email,
        subject: `Your Vote Yes yard sign request is confirmed!`,
        html,
      }),
    });
  } catch (error) {
    console.error('Failed to send yard sign confirmation:', error);
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Together KC Form Handler' });
}
