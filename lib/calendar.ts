// Generate ICS calendar file content

interface CalendarEventOptions {
  location?: string;
  title?: string;
  description?: string;
}

export function generateCalendarEvent(options?: CalendarEventOptions): string {
  const eventTitle = options?.title || 'Vote YES on all five (Kansas City, August 4)';
  const location = options?.location || 'Kansas City, MO';
  const eventDescription = options?.description || `Don't forget to vote! Vote YES on all five Kansas City measures.

Check your registration: https://voteroutreach.sos.mo.gov/portal/

Register to vote: https://s1.sos.mo.gov/elections/voterregistration/

Find your polling location by county:
- Jackson County: https://www.kceb.org/elections/poll-locations/
- Clay County: https://www.voteclaycountymo.gov
- Platte County: https://www.plattecountymovotes.gov
- Cass County: https://casscounty.com/2355/Absentee-Information`;

  // August 4, 2026 - CDT (UTC-5)
  // 6:00 AM CDT = 11:00 UTC
  // 7:00 PM CDT = 00:00 UTC (August 5)
  const startDate = '20260804T110000Z';
  const endDate = '20260805T000000Z';

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
LOCATION:${escapeICS(location)}
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

export function downloadCalendarEvent(options?: CalendarEventOptions) {
  const icsContent = generateCalendarEvent(options);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'vote-yes-kc-august-4-2026.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateEarlyVoteEvent(
  date: string, // YYYY-MM-DD
  time: string, // HH:MM (24h)
  locationName: string,
  locationAddress: string
): string {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);

  // CDT is UTC-6
  const startUtcH = hour + 6;
  const startDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}T${String(startUtcH).padStart(2, '0')}${String(minute).padStart(2, '0')}00Z`;
  // 15 min event
  const endMin = minute + 15;
  const endH = startUtcH + Math.floor(endMin / 60);
  const endM = endMin % 60;
  const endDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}T${String(endH).padStart(2, '0')}${String(endM).padStart(2, '0')}00Z`;

  // Check if 12 hours before has already passed
  const eventTime = new Date(`${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
  const twelveHoursBefore = new Date(eventTime.getTime() - 12 * 60 * 60 * 1000);
  const include12hReminder = twelveHoursBefore > new Date();

  const uid = `vote-early-plan-${Date.now()}@together-kc.com`;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const escapeICS = (text: string) => text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

  const alarms: string[] = [];
  if (include12hReminder) {
    alarms.push(`BEGIN:VALARM
TRIGGER:-PT12H
ACTION:DISPLAY
DESCRIPTION:Voting in 12 hours at ${escapeICS(locationName)}!
END:VALARM`);
  }
  alarms.push(`BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Voting in 1 hour at ${escapeICS(locationName)}!
END:VALARM`);

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Together KC//Vote Early Plan//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${escapeICS(`Vote Early at ${locationName}`)}
DESCRIPTION:${escapeICS(`Time to vote early!\n\nLocation: ${locationName}\n${locationAddress}\n\nRemember to bring a valid photo ID.\n\nVote YES on all five Kansas City measures!`)}
LOCATION:${escapeICS(`${locationName}, ${locationAddress}`)}
${alarms.join('\n')}
END:VEVENT
END:VCALENDAR`;
}

export function downloadEarlyVoteEvent(date: string, time: string, locationName: string, locationAddress: string) {
  const ics = generateEarlyVoteEvent(date, time, locationName, locationAddress);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `vote-early-${date}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateElectionDayEvent(
  pollingPlace: string,
  pollingAddress: string
): string {
  // August 4, 2026, 6:00 AM - 7:00 PM CDT (UTC-5)
  const startDate = '20260804T110000Z'; // 6 AM CDT
  const endDate = '20260805T000000Z';   // 7 PM CDT

  const uid = `election-day-${Date.now()}@together-kc.com`;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const escapeICS = (text: string) => text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Together KC//Election Day//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${escapeICS(`Vote at ${pollingPlace} - Election Day`)}
DESCRIPTION:${escapeICS(`Election Day! Polls open 6:00 AM - 7:00 PM.\n\nYour polling place: ${pollingPlace}\n${pollingAddress}\n\nRemember to bring a valid photo ID.\n\nVote YES on all five Kansas City measures!`)}
LOCATION:${escapeICS(`${pollingPlace}, ${pollingAddress}`)}
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:${escapeICS(`Election Day tomorrow! Vote at ${pollingPlace}`)}
END:VALARM
BEGIN:VALARM
TRIGGER:PT0M
ACTION:DISPLAY
DESCRIPTION:${escapeICS(`Polls are open! Vote at ${pollingPlace}`)}
END:VALARM
END:VEVENT
END:VCALENDAR`;
}

export function downloadElectionDayEvent(pollingPlace: string, pollingAddress: string) {
  const ics = generateElectionDayEvent(pollingPlace, pollingAddress);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'election-day-2026.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
