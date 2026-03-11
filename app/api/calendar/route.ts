import { NextResponse } from 'next/server';

export async function GET() {
  const eventTitle = 'Vote YES for Kansas City Earnings Tax Renewal';
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Together KC//Vote YES//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:vote-yes-kc-election@together-kc.com',
    `DTSTAMP:${now}`,
    'DTSTART:20260407T110000Z',
    'DTEND:20260408T000000Z',
    `SUMMARY:${eventTitle}`,
    'DESCRIPTION:Don\'t forget to vote!\\nCheck your registration: https://voteroutreach.sos.mo.gov/portal/\\nFind your polling location: https://together-kc.com/find-polling',
    'LOCATION:Kansas City\\, MO',
    'BEGIN:VALARM',
    'TRIGGER:-P5D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${eventTitle} - 5 days away!`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-P3D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${eventTitle} - 3 days away!`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${eventTitle} - Tomorrow!`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="vote-yes-kc-april-7-2026.ics"',
    },
  });
}
