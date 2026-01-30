import { EndorserQuote } from "@/components/ui/EndorserShowcase";

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

const LUCAS_QUOTES: Omit<EndorserQuote, 'id'>[] = [
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "The earnings tax is essential to maintaining the city services Kansas Citians depend on every day. I urge everyone to vote YES for renewal.",
    imageSrc: "/images/council/mayor-q.png",
  },
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "This isn't about new taxes—it's about protecting the services our families and neighborhoods rely on. First responders, road repairs, trash pickup. This is how we take care of Kansas City.",
    imageSrc: "/images/council/mayor-q.png",
  },
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "When you call 911, you expect someone to answer. When there's a pothole on your street, you expect it to get fixed. The earnings tax makes that possible.",
    imageSrc: "/images/council/mayor-q.png",
  },
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "Kansas City has made real progress—more police officers, faster response times, better roads. Voting YES keeps that momentum going.",
    imageSrc: "/images/council/mayor-q.png",
  },
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "Nearly half of the earnings tax is paid by people who work here but live elsewhere. That's fair—they use our roads, our services, our city. And they should help pay for them.",
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

// Build the final quotes array: alphabetical by person, random within each person's quotes
export function getOrderedQuotes(): EndorserQuote[] {
  // Alphabetical order: Duke, Joe, Quinton
  const orderedGroups = [
    shuffleArray(DUKE_QUOTES),
    shuffleArray(JOE_QUOTES),
    shuffleArray(LUCAS_QUOTES),
  ];

  // Flatten and add IDs
  return orderedGroups.flat().map((quote, index) => ({
    ...quote,
    id: `quote-${index}`,
  }));
}

// Legacy export for backwards compatibility
export const ENDORSER_QUOTES: EndorserQuote[] = getOrderedQuotes();
export const shuffleQuotes = (quotes: EndorserQuote[]) => quotes; // No-op now since ordering is handled
