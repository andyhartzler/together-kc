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

// Initialize Gmail API with domain-wide delegation to send as action@together-kc.com
function getGmail() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
    subject: ALERT_EMAIL, // impersonate action@together-kc.com
  });

  return google.gmail({ version: 'v1', auth });
}

// Build RFC 2822 email and base64url encode it for Gmail API
function buildRawEmail({ to, subject, html, text, attachments }: { to: string; subject: string; html?: string; text?: string; attachments?: Array<{ filename: string; content: string; contentType: string }> }): string {
  const lines = [
    `From: Together KC <${ALERT_EMAIL}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
  ];

  if (attachments && attachments.length > 0 && html) {
    // multipart/mixed wrapping alternative + attachments
    const mixedBoundary = `mixed_${Date.now()}`;
    const altBoundary = `alt_${Date.now()}_inner`;
    lines.push(`Content-Type: multipart/mixed; boundary="${mixedBoundary}"`, '');
    lines.push(`--${mixedBoundary}`);
    lines.push(`Content-Type: multipart/alternative; boundary="${altBoundary}"`, '');
    lines.push(`--${altBoundary}`, 'Content-Type: text/plain; charset=UTF-8', '', text || '');
    lines.push(`--${altBoundary}`, 'Content-Type: text/html; charset=UTF-8', '', html);
    lines.push(`--${altBoundary}--`, '');
    for (const att of attachments) {
      lines.push(`--${mixedBoundary}`);
      lines.push(`Content-Type: ${att.contentType}; name="${att.filename}"`);
      lines.push(`Content-Disposition: attachment; filename="${att.filename}"`);
      lines.push('Content-Transfer-Encoding: base64', '');
      lines.push(Buffer.from(att.content).toString('base64'));
    }
    lines.push(`--${mixedBoundary}--`);
  } else if (html) {
    const boundary = `boundary_${Date.now()}`;
    lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`, '', `--${boundary}`, 'Content-Type: text/plain; charset=UTF-8', '', text || '', `--${boundary}`, 'Content-Type: text/html; charset=UTF-8', '', html, `--${boundary}--`);
  } else {
    lines.push('Content-Type: text/plain; charset=UTF-8', '', text || '');
  }

  const raw = lines.join('\r\n');
  return Buffer.from(raw).toString('base64url');
}

// Send email via Gmail API (as action@together-kc.com)
async function sendGmail({ to, subject, html, text, attachments }: { to: string; subject: string; html?: string; text?: string; attachments?: Array<{ filename: string; content: string; contentType: string }> }) {
  try {
    const gmail = getGmail();
    const raw = buildRawEmail({ to, subject, html, text, attachments });
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw },
    });
  } catch (error) {
    console.error('Gmail send failed:', error);
  }
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
  await sendGmail({ to: ALERT_EMAIL, subject, text: body });
}

async function sendYardSignConfirmation(name: string, email: string, isPickup: boolean) {
  const BASE = 'https://together-kc.com';

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
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
  @media only screen and (max-width: 480px) {
    .btn-col { display:block !important; width:100% !important; padding:0 0 8px 0 !important; }
    .btn-col a { display:block !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

  <!-- Header + Hero - single navy block -->
  <tr><td style="background:#1e3a5f;padding:32px 32px 12px;text-align:center;">
    <img src="${BASE}/images/renew-kc-logo-white.png" alt="Renew KC" width="200" style="max-width:200px;height:auto;" />
  </td></tr>
  <tr><td style="background:#1e3a5f;padding:12px 32px 32px;text-align:center;">
    <p style="margin:0 0 8px;font-size:48px;line-height:1;">&#129703;</p>
    <h1 style="margin:0 0 8px;font-size:24px;color:#ffffff;font-weight:700;">${isPickup ? 'Your Yard Sign is ready for pickup!' : 'Your Yard Sign is on the way!'}</h1>
    <p style="margin:0;font-size:16px;color:rgba(255,255,255,0.85);">Thanks for standing with Kansas City.</p>
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

  <!-- Election reminder -->
  <tr><td style="padding:24px 32px 24px;">
    <div style="background:#fff8f0;border:1px solid #f5a623;border-radius:12px;padding:16px;text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">Election Day</p>
      <p style="margin:0;font-size:22px;color:#1e3a5f;font-weight:700;">April 7, 2026</p>
      <p style="margin:4px 0 0;font-size:13px;color:#666;">Early voting begins March 24</p>
    </div>
  </td></tr>

  <!-- Divider -->
  <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #e8e8e8;margin:0;" /></td></tr>

  <!-- Get Involved -->
  <tr><td style="padding:24px 32px 8px;text-align:center;">
    <h2 style="margin:0 0 16px;font-size:18px;color:#1e3a5f;font-weight:700;">More ways to get involved</h2>
  </td></tr>

  <!-- Action buttons row 1 -->
  <tr><td style="padding:0 32px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="btn-col" width="48%" style="padding-right:8px;">
          <a href="${BASE}/endorse" style="display:block;text-align:center;padding:14px 8px;background:#e53935;color:#ffffff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Add Your Endorsement</a>
        </td>
        <td class="btn-col" width="48%" style="padding-left:8px;">
          <a href="${BASE}/api/calendar" style="display:block;text-align:center;padding:14px 8px;background:#4a90d9;color:#ffffff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Remind Me to Vote</a>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Action buttons row 2 -->
  <tr><td style="padding:0 32px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="btn-col" width="48%" style="padding-right:8px;">
          <a href="${BASE}/donate" style="display:block;text-align:center;padding:14px 8px;background:#2e7d32;color:#ffffff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Donate</a>
        </td>
        <td class="btn-col" width="48%" style="padding-left:8px;">
          <a href="${BASE}/find-polling" style="display:block;text-align:center;padding:14px 8px;background:#f5a623;color:#ffffff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Find Your Polling Location</a>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Social + Footer - continuous navy block -->
  <tr><td style="background:#1e3a5f;padding:24px 32px 12px;text-align:center;">
    <p style="margin:0 0 12px;font-size:14px;color:#ffffff;font-weight:600;">Follow us on social media</p>
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
  <tr><td style="background:#1e3a5f;padding:8px 32px 28px;text-align:center;">
    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.6);line-height:1.5;">
      Paid for by Together KC, Dan Kopp, Treasurer.<br />
      Not authorized by any candidate or candidate committee.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  await sendGmail({
    to: email,
    subject: 'Your E-Tax Yard Sign is Confirmed!',
    html,
    text: `Thanks for requesting a Vote Yes yard sign!\n\n${isPickup ? 'Pick up your sign at Next Page KC, 1216 Brooklyn Ave, Kansas City, MO. Monday - Friday, 9:00 AM - 4:00 PM.' : "We'll deliver your sign as soon as possible."}\n\nElection Day is April 7, 2026. Early voting begins March 24.\n\nAdd Your Endorsement: https://together-kc.com/endorse\nRemind Me to Vote: https://together-kc.com/api/calendar\nDonate: https://together-kc.com/donate\nFind Your Polling Location: https://together-kc.com/find-polling\n\nPaid for by Together KC, Dan Kopp, Treasurer.\nNot authorized by any candidate or candidate committee.`,
  });
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Together KC Form Handler' });
}
