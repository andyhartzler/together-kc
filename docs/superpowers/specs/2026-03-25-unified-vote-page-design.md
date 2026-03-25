# Unified Vote Page - Design Spec

## Overview

Merge `/vote-early` and `/find-polling` into a single mobile-first `/vote` page. The page answers one question: **"Where do I vote?"** The answer adapts based on the date (early voting vs election day) and the user's county.

Primary audience: Jackson County KC voters on mobile phones.

## Data Model

| County | Early Voting Sites | Election Day Sites | Election Day Rules |
|--------|-------------------|-------------------|-------------------|
| Jackson (KC) | 7 (KCEB HQ + 6 satellites) | 53 (vote at any) | Paper ballot at assigned; BMD at any |
| Clay | 1 (Liberty) | Assigned only | Clay County ArcGIS lookup |
| Platte | 1 (Platte City) | Assigned only | MO SOS voter lookup |
| Cass | 1 (Harrisonville, closes 4:30 PM) | Assigned only | MO SOS voter lookup |

Early voting: March 24 - April 6, 2026.
Election Day: April 7, 2026. Polls 6:00 AM - 7:00 PM.

## Timezone

All date/time logic MUST use `America/Chicago` (Central Time). This includes:
- Open/closed status calculations
- Date-based mode switching (early voting vs election day)
- Displayed hours on cards
- "Closes in X minutes" countdowns

Implementation: Use `new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })` or a helper that returns the current Central Time Date object.

## Page Structure

### URL: `/vote`

Redirects:
- `/vote-early` -> `/vote` (301)
- `/find-polling` -> `/vote` (301)
- `/vote` added to `NAV_LINKS` in `lib/constants.ts` as "Vote" between "Home" and "FAQs"

### Layout (mobile-first, single column)

```
┌─────────────────────────────┐
│ Smart Banner                │  <- date-aware, see below
├─────────────────────────────┤
│ [ Early Voting | Election ] │  <- segmented control
├─────────────────────────────┤
│ [📍 Use My Location      ] │  <- primary CTA, 44px+ height
│  Or enter your address      │  <- secondary input
├─────────────────────────────┤
│ ⚠ Outside KC banner        │  <- only if location outside 4 counties
├─────────────────────────────┤
│ County badge (if detected)  │
├─────────────────────────────┤
│ Location Card 1 (nearest)   │  <- full card, not collapsed
│ Location Card 2             │
│ Location Card 3             │
│ ...                         │
├─────────────────────────────┤
│ [View on Map]               │  <- optional, not default
├─────────────────────────────┤
│ Voter ID Requirements       │  <- collapsible
│ Election Board Contacts     │  <- 4 county cards
│ MO SOS Registration Check   │
└─────────────────────────────┘
```

Desktop (md+): Two-column layout. Left column: controls + card list. Right column: Apple Maps (persistent, not toggled). Cards still take priority (left/first in DOM).

### Smart Banner

Before early voting ends (now through April 6):
- Green pulse dot + "Early voting is open - X days left"
- "No excuse needed. Vote at any location in your county."

On April 7 (Election Day):
- Red/coral pulse dot + "Election Day - Polls open 6 AM - 7 PM"
- "Bring your photo ID"

After April 7:
- "The election has ended. Thank you for voting!"

### Segmented Control

Two options: `Early Voting` | `Election Day`

Auto-selected based on Central Time date:
- Before April 7: "Early Voting" selected
- April 7 onward: "Election Day" selected

User can manually switch at any time. Switching changes the card list below without page reload.

### Location Entry

**Primary: "Use My Location" button**
- Full-width, 48px tall minimum, thumb-friendly
- Crosshair/location icon + "Use My Location" text (always visible, no hidden labels)
- On tap: request geolocation, show spinner, resolve
- On success: detect county from reverse geocode, sort locations by distance
- On denial/error: show address input prominently with message "Location unavailable - enter your address"

**Secondary: Address input**
- Google Places autocomplete, bounded to KC metro
- On selection: geocode, detect county, sort by distance
- Supports zip code entry (appends ", MO" for geocoding)

**Out-of-KC handling:**
- If geolocation or address resolves to a location NOT in Jackson/Clay/Platte/Cass counties:
  - Show amber banner: "You don't appear to be in Kansas City, but here are all voting locations"
  - Show ALL locations (all counties) sorted by distance from user's position
  - Do NOT block them. They may be at work, traveling, or helping someone else find their polling place.

### Location Cards

Each card shows (no tap required to see essentials):

```
┌─────────────────────────────────────────┐
│ 🟢 Open Now          0.8 mi            │
│                                         │
│ Kansas City Election Board        [HQ]  │
│ 4405 E. 50th Terrace, KC 64130         │
│ Today: 8:00 AM - 6:00 PM               │
│ 📄 Paper ballots available              │
│                                         │
│ [ Get Directions ]                      │
└─────────────────────────────────────────┘
```

Fields:
- **Status dot + label**: Green "Open Now" / Red "Closed" / "Closes in 45 min" (amber when <1hr)
- **Distance**: "0.8 mi" (only if user location known)
- **Name**: Bold, prominent
- **Badge**: "HQ" for election board, "Paper Ballots" for KCEB
- **Address**: Single line
- **Today's hours**: Current day's schedule, not full weekly hours
- **Get Directions button**: Minimum 44px tall, full width on mobile
  - iOS: Apple Maps deep link
  - Android/other: Google Maps deep link

Expandable section (tap to show):
- **Inline mini-map**: Small (200px tall) Apple MapKit embed showing the single location pin. Lets mobile users see exactly where the location is without leaving the page or opening a full map view. Map initializes lazily only when the card expands (no map load cost for collapsed cards).
- Full weekly schedule
- Notes (e.g., "Closed Saturday April 4", "Ballot Marking Devices only")
- County info

**Cass County special handling**: If Cass County location, show amber warning "Closes at 4:30 PM (earlier than other locations)"

### Early Voting Mode

**Jackson County** (detected or selected):
- Show all 7 early voting locations as cards sorted by distance
- KCEB HQ card gets "Paper Ballots" badge
- Banner: "Vote at any location - no excuse needed"

**Clay/Platte/Cass** (detected or selected):
- Show the ONE location as a prominent card
- Below: "This is the only early voting location in [County] County"
- Show all Jackson County locations below with divider: "Jackson County locations (if you work or commute there)"

**No county detected** (out-of-KC or no location):
- Show all 10 locations grouped by county
- Jackson County locations first (7), then Clay (1), Platte (1), Cass (1)

### Election Day Mode

**Jackson County** (with address/location):
1. Loading skeleton while ArcGIS lookup resolves
2. Green "Your Assigned Location" card (from ArcGIS precinct lookup)
   - Name, address, precinct, ward
   - "Get Directions" button
   - "Sample Ballot" link (if available)
   - Note: "Paper ballot available at your assigned location"
3. Divider: "Or vote at any KC location (ballot marking device)"
4. Card list of all 53 locations sorted by distance
   - Ward badge on each card

**Jackson County** (no address - used geolocation or county button):
- Prompt: "Enter your address to find your assigned location"
- Still show all 53 locations sorted by distance
- Note: "You can vote at any of these locations"

**Clay/Platte/Cass**:
- Card with link to county's official lookup tool
- Election board contact info (phone, address, website)
- Cannot show assigned location (no local data for those counties)

### Map View (Optional)

Not shown by default on mobile. Toggled via "View on Map" button.

When shown:
- Apple MapKit JS, dark mode
- Pins for all visible locations (green = open, red = closed)
- User location marker (blue)
- Tapping a pin scrolls the corresponding card into view
- On desktop: always visible in right column

Map does NOT destroy/recreate on filter changes. Update annotations in place.

### Navigation Integration

Add to `NAV_LINKS` in `lib/constants.ts`:
```ts
{ href: '/vote', label: 'Vote' }
```
Position: after "Home", before "FAQs".

Update `hasDarkHero` in `Navigation.tsx` to include `/vote`.

## Shared Utilities

### `lib/geocoding.ts` (new)
- `loadGoogleMaps()`: Singleton script loader, returns promise
- `geocodeAddress(address: string)`: Returns `{ lat, lng, county, formattedAddress }` or null
- `detectCountyFromCoords(lat, lng)`: Reverse geocode to county name
- `GOOGLE_MAPS_KEY`: Single constant (move to `NEXT_PUBLIC_GOOGLE_MAPS_KEY` env var)

### `lib/voting-utils.ts` (new)
- `getCentralTime()`: Returns current Date in America/Chicago
- `getVotingMode()`: Returns `'early'` or `'election-day'` based on Central Time
- `getLocationStatus(location, now)`: Existing function, moved here, uses Central Time
- `getDirectionsUrl(address)`: Platform-aware directions link (Apple Maps on iOS, Google Maps elsewhere)
- `getDistanceMiles(lat1, lng1, lat2, lng2)`: Existing haversine function, moved here

### `hooks/useUserLocation.ts` (new)
- `useUserLocation()`: Returns `{ location, county, isLocating, error, requestLocation }`
- Handles geolocation + reverse geocode + county detection in one hook

### `hooks/useAppleMap.ts` (new)
- `useAppleMap(ref, options)`: Handles MapKit JS loading, init, and annotation management
- Returns `{ addAnnotations, removeAnnotations, centerOn, isLoaded }`
- No destroy/recreate - manages annotations incrementally

## Files to Create
- `app/(main)/vote/page.tsx` - metadata + page component
- `app/(main)/vote/VotePage.tsx` - main unified page component
- `app/(main)/vote/components/LocationCard.tsx` - location card component
- `app/(main)/vote/components/SmartBanner.tsx` - date-aware banner
- `app/(main)/vote/components/VotingModeToggle.tsx` - segmented control
- `app/(main)/vote/components/LocationEntry.tsx` - geolocation + address input
- `app/(main)/vote/components/MapView.tsx` - optional Apple Maps view
- `app/(main)/vote/components/VoterInfo.tsx` - ID requirements + contacts
- `lib/geocoding.ts` - shared geocoding utilities
- `lib/voting-utils.ts` - shared voting helpers
- `hooks/useUserLocation.ts` - geolocation hook
- `hooks/useAppleMap.ts` - MapKit JS hook

## Files to Delete
- `app/(main)/vote-early/VoteEarlyPage.tsx`
- `app/(main)/vote-early/page.tsx`
- `app/(main)/find-polling/FindPollingPage.tsx`
- `app/(main)/find-polling/page.tsx`

## Files to Modify
- `lib/constants.ts` - add "Vote" to NAV_LINKS
- `components/layout/Navigation.tsx` - add `/vote` to hasDarkHero
- `components/ui/VoteYesModal.tsx` - replace inline county lookup with link to `/vote`

## Redirects
Add to `next.config.ts`:
```ts
async redirects() {
  return [
    { source: '/vote-early', destination: '/vote', permanent: true },
    { source: '/find-polling', destination: '/vote', permanent: true },
  ];
}
```

## Bug Fixes (included in this work)
1. ~~"Show All 70"~~ -> "Show All 53"
2. County shortcut buttons: use county-appropriate center coordinates
3. Add loading skeleton for ArcGIS precinct lookup
4. All time logic uses America/Chicago timezone
5. Touch targets minimum 44px
6. Google API key to env var (single source)
7. Map annotation updates without destroy/recreate
8. Memoize distance calculations with useMemo

## Out of Scope
- Adding election day data for Clay/Platte/Cass (they use official lookup tools)
- Real-time polling wait times
- Voter registration flow
- Push notifications
