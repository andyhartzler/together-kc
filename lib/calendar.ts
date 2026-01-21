// Generate ICS calendar file content
export function generateCalendarEvent(): string {
  const eventTitle = 'Vote YES for Kansas City Earnings Tax Renewal';
  const eventDescription = `Don't forget to vote!

Check your registration: https://voteroutreach.sos.mo.gov/portal/

Register to vote: https://s1.sos.mo.gov/elections/voterregistration/

Find your polling location: https://www.kceb.org/elections/poll-locations/`;

  // April 7, 2026 - CDT (UTC-5)
  // 6:00 AM CDT = 11:00 UTC
  // 7:00 PM CDT = 00:00 UTC (April 8)
  const startDate = '20260407T110000Z';
  const endDate = '20260408T000000Z';

  // Generate a unique ID
  const uid = `vote-yes-kc-${Date.now()}@together-kc.com`;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  // Escape special characters for ICS format
  const escapeICS = (text: string) => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  };

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Together KC//Vote YES//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${escapeICS(eventTitle)}
DESCRIPTION:${escapeICS(eventDescription)}
LOCATION:Kansas City, MO
BEGIN:VALARM
TRIGGER:-P5D
ACTION:DISPLAY
DESCRIPTION:${escapeICS(eventTitle)} - 5 days away!
END:VALARM
BEGIN:VALARM
TRIGGER:-P3D
ACTION:DISPLAY
DESCRIPTION:${escapeICS(eventTitle)} - 3 days away!
END:VALARM
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:${escapeICS(eventTitle)} - Tomorrow!
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}

export function downloadCalendarEvent() {
  const icsContent = generateCalendarEvent();
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'vote-yes-kc-april-7-2026.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
