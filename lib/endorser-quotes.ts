import { EndorserQuote } from "@/components/ui/EndorserCardStack";

// Quotes organized by person - will be grouped alphabetically
const DUKE_QUOTES: Omit<EndorserQuote, 'id'>[] = [
  {
    name: "Duke Dujakovich",
    title: "President",
    organization: "Greater Kansas City AFL-CIO",
    quote: "The earnings tax in Kansas City is vital. It makes up about 47% of the general fund, and the city could not operate as it currently does without the earnings tax renewal.",
    imageSrc: "/images/endorsers/duke-dujakovich.jpg",
  },
  {
    name: "Duke Dujakovich",
    title: "President",
    organization: "Greater Kansas City AFL-CIO",
    quote: "This is not a new tax. This is a renewal. This tax has been around longer than I have. It started in 1963. We've been paying this tax all of my life.",
    imageSrc: "/images/endorsers/duke-dujakovich.jpg",
  },
  {
    name: "Duke Dujakovich",
    title: "President",
    organization: "Greater Kansas City AFL-CIO",
    quote: "If this doesn't get renewed, city workers would be facing layoffs and forced to take wage concessions to try to keep vital city services intact and operating.",
    imageSrc: "/images/endorsers/duke-dujakovich.jpg",
  },
  {
    name: "Duke Dujakovich",
    title: "President",
    organization: "Greater Kansas City AFL-CIO",
    quote: "A lot of infrastructure here in the city is old and needs to be replaced. We're going about fixing that right now. Without the earnings tax, that work would not happen.",
    imageSrc: "/images/endorsers/duke-dujakovich.jpg",
  },
  {
    name: "Duke Dujakovich",
    title: "President",
    organization: "Greater Kansas City AFL-CIO",
    quote: "Somebody's gotta pay for the services you use when you're here in Kansas City. To fix the streets, to fix the bridges, to be there when you call 911.",
    imageSrc: "/images/endorsers/duke-dujakovich.jpg",
  },
];

const JOE_QUOTES: Omit<EndorserQuote, 'id'>[] = [
  {
    name: "Joe Reardon",
    title: "President & CEO",
    organization: "Greater KC Chamber of Commerce",
    quote: "Renewing the earnings tax means that it's the 1% tax on income we already pay today, and it provides essential services that keep Kansas City strong every single day.",
    imageSrc: "/images/endorsers/joe-reardon.jpg",
  },
  {
    name: "Joe Reardon",
    title: "President & CEO",
    organization: "Greater KC Chamber of Commerce",
    quote: "The good news is that everyone pays. If you live in Kansas City, you pay. But if you live outside the city and work here, you too pay for the essential services we get every single day.",
    imageSrc: "/images/endorsers/joe-reardon.jpg",
  },
  {
    name: "Joe Reardon",
    title: "President & CEO",
    organization: "Greater KC Chamber of Commerce",
    quote: "Almost 50% of the earnings tax is paid for by those individuals that don't live in Kansas City but work here every day. It's a fair way to make sure essential services are there for all of us.",
    imageSrc: "/images/endorsers/joe-reardon.jpg",
  },
  {
    name: "Joe Reardon",
    title: "President & CEO",
    organization: "Greater KC Chamber of Commerce",
    quote: "Businesses benefit every day from the earnings tax. It helps provide police and fire protection, makes sure our roads are well paved and that snow is being removed.",
    imageSrc: "/images/endorsers/joe-reardon.jpg",
  },
  {
    name: "Joe Reardon",
    title: "President & CEO",
    organization: "Greater KC Chamber of Commerce",
    quote: "The Chamber represents 2,000 businesses in the Kansas City region. We desire to have a city that's strong, viable, and growing. The earnings tax helps make sure that happens.",
    imageSrc: "/images/endorsers/joe-reardon.jpg",
  },
];

const BRIDGETTE_QUOTES: Omit<EndorserQuote, 'id'>[] = [
  {
    name: "Bridgette Williams",
    title: "Executive Director",
    organization: "Heavy Constructors Association of Greater Kansas City",
    quote: "Kansas City's ability to remain competitive depends on renewing the earnings tax. It is an investment that is critical for our future. Kansas City's ability to repair and upgrade its aging infrastructure is at stake.",
    imageSrc: "/images/endorsers/bridget williams.png",
    imageScale: 1.4,
  },
  {
    name: "Bridgette Williams",
    title: "Executive Director",
    organization: "Heavy Constructors Association of Greater Kansas City",
    quote: "The renewal of the e-tax protects Kansas City from drastic cuts to street repair, snow removal, transportation, and other basic services. It's vital that we renew the E-Tax on April 7th.",
    imageSrc: "/images/endorsers/bridget williams.png",
    imageScale: 1.4,
  },
];

const LUCAS_QUOTES: Omit<EndorserQuote, 'id'>[] = [
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "The earnings tax funds nearly half the cost of city services: first responders, street repair, trash pickup, and more. It is critical that we vote yes to renew.",
    imageSrc: "/images/council/mayor-q.png",
  },
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "Without the earnings tax, we face devastating cuts, including first responder layoffs and longer emergency response times. Kansas City cannot afford that.",
    imageSrc: "/images/council/mayor-q.png",
  },
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "The e-tax is about supporting our entire city's future. It funds fire rescue, EMTs, trash collection, snow removal, and pothole repair. These are the services Kansas Citians rely on every day.",
    imageSrc: "/images/council/mayor-q.png",
  },
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "Kansas City is a regional hub that entertains, excites, and employs people from across the metro. The earnings tax allows us to provide services to everyone who works in and visits our city.",
    imageSrc: "/images/council/mayor-q.png",
  },
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "Voters adopted the earnings tax in 1963 and have renewed it ever since. It's our city's largest revenue source, and replacing it would mean massive increases in sales and property taxes.",
    imageSrc: "/images/council/mayor-q.png",
  },
];

// Shuffle function using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Build the final quotes array: interleaved by person (Mayor, Bridgette, Duke, Joe, Mayor, Bridgette, Duke, Joe...)
export function getOrderedQuotes(): EndorserQuote[] {
  // Shuffle each person's quotes
  const lucas = shuffleArray(LUCAS_QUOTES);
  const duke = shuffleArray(DUKE_QUOTES);
  const joe = shuffleArray(JOE_QUOTES);
  const bridgette = shuffleArray(BRIDGETTE_QUOTES);

  // Interleave: Mayor, Bridgette, Duke, Joe, Mayor, Bridgette, Duke, Joe...
  const interleaved: Omit<EndorserQuote, 'id'>[] = [];
  const maxLen = Math.max(lucas.length, duke.length, joe.length, bridgette.length);

  for (let i = 0; i < maxLen; i++) {
    if (i < lucas.length) interleaved.push(lucas[i]);
    if (i < bridgette.length) interleaved.push(bridgette[i]);
    if (i < duke.length) interleaved.push(duke[i]);
    if (i < joe.length) interleaved.push(joe[i]);
  }

  // Add IDs
  return interleaved.map((quote, index) => ({
    ...quote,
    id: `quote-${index}`,
  }));
}

// Legacy export for backwards compatibility
export const ENDORSER_QUOTES: EndorserQuote[] = getOrderedQuotes();
export const shuffleQuotes = (quotes: EndorserQuote[]) => quotes; // No-op now since ordering is handled
