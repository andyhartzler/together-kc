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
    organization: "Heavy Constructors Association\nof Greater Kansas City",
    quote: "Kansas City's ability to remain competitive depends on renewing the earnings tax. It is an investment that is critical for our future. Kansas City's ability to repair and upgrade its aging infrastructure is at stake.",
    imageSrc: "/images/endorsers/bridget williams.png",
    imageScale: 1.25,
  },
  {
    name: "Bridgette Williams",
    title: "Executive Director",
    organization: "Heavy Constructors Association\nof Greater Kansas City",
    quote: "The renewal of the e-tax protects Kansas City from drastic cuts to street repair, snow removal, transportation, and other basic services. It's vital that we renew the E-Tax on April 7th.",
    imageSrc: "/images/endorsers/bridget williams.png",
    imageScale: 1.25,
  },
  {
    name: "Bridgette Williams",
    title: "Executive Director",
    organization: "Heavy Constructors Association\nof Greater Kansas City",
    quote: "The earnings tax is a significant portion of Kansas City, Missouri's budget. The income that comes from the earnings tax is critical to the basic services for the residents of Kansas City, Missouri.",
    imageSrc: "/images/endorsers/bridget williams.png",
    imageScale: 1.25,
  },
  {
    name: "Bridgette Williams",
    title: "Executive Director",
    organization: "Heavy Constructors Association\nof Greater Kansas City",
    quote: "If you care about getting back to work, your children getting to school, your trash getting picked up, your snow being removed, and your streets maintained, vote yes on April 7th.",
    imageSrc: "/images/endorsers/bridget williams.png",
    imageScale: 1.25,
  },
  {
    name: "Bridgette Williams",
    title: "Executive Director",
    organization: "Heavy Constructors Association\nof Greater Kansas City",
    quote: "This is not a new tax. The e-tax has been in place since 1963. This is simply a renewal of a tax that's already been in place.",
    imageSrc: "/images/endorsers/bridget williams.png",
    imageScale: 1.25,
  },
];

const CHARLIE_QUOTES: Omit<EndorserQuote, 'id'>[] = [
  {
    name: "Charlie Shields",
    title: "President & CEO",
    organization: "University Health",
    quote: "The earnings tax in Kansas City is really what makes this community work. Whether it's supporting our Kansas City Police Department, the ambulances that bring patients to the hospital, or the roads that get repaired. This city doesn't work without the earnings tax.",
    imageSrc: "/images/endorsers/charlie-shields.webp",
  },
  {
    name: "Charlie Shields",
    title: "President & CEO",
    organization: "University Health",
    quote: "The earnings tax is certainly not a new tax. This tax has been around for decades, but it has to be renewed every five years. For us to continue the great work we do as a hospital and for this city to continue its great work, we need the renewal.",
    imageSrc: "/images/endorsers/charlie-shields.webp",
  },
  {
    name: "Charlie Shields",
    title: "President & CEO",
    organization: "University Health",
    quote: "A lot of folks that commute in use all the services in Kansas City, and they help pay for them. That's why everybody has to pay their fair share including those that not only live here, but those that work in this great community.",
    imageSrc: "/images/endorsers/charlie-shields.webp",
  },
  {
    name: "Charlie Shields",
    title: "President & CEO",
    organization: "University Health",
    quote: "There are a lot of great things happening in Kansas City right now. It's like the city is on a roll. We need to keep that going and that doesn't happen without renewal of the earnings tax. It's that important.",
    imageSrc: "/images/endorsers/charlie-shields.webp",
  },
  {
    name: "Charlie Shields",
    title: "President & CEO",
    organization: "University Health",
    quote: "If you were in an accident in this city, you're gonna come to University Health by ambulance—that's supported by the earnings tax. You're gonna travel on those roads—that's supported by the earnings tax. It's that important.",
    imageSrc: "/images/endorsers/charlie-shields.webp",
  },
];

const LUCAS_QUOTES: Omit<EndorserQuote, 'id'>[] = [
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "This tax has funded our city since 1963. It covers nearly half our city services, from fire rescue to street repairs to trash pickup. Vote yes to keep Kansas City working.",
    imageSrc: "/images/council/mayor-q.png",
  },
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "If this fails, we're not talking hypotheticals. We're talking layoffs of firefighters, police officers, and EMTs. We're talking longer response times when you call 911. Kansas City can't afford that.",
    imageSrc: "/images/council/mayor-q.png",
  },
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "Kansas City is where the region comes to work, to play, to celebrate. The earnings tax lets us provide services to everyone who uses our roads and relies on our first responders, not just residents.",
    imageSrc: "/images/council/mayor-q.png",
  },
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "This isn't a new tax. It's been in place since 1963, and replacing it would force massive increases in property and sales taxes that still couldn't cover the gap.",
    imageSrc: "/images/council/mayor-q.png",
  },
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "Labor unions, faith leaders, the Chamber of Commerce, the Civic Council, members of City Council, we're all saying the same thing: renew the earnings tax. This isn't partisan. This is about keeping Kansas City running.",
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

// Build the final quotes array: interleaved by person (Mayor, Bridgette, Charlie, Duke, Joe...)
export function getOrderedQuotes(): EndorserQuote[] {
  // Shuffle each person's quotes
  const lucas = shuffleArray(LUCAS_QUOTES);
  const duke = shuffleArray(DUKE_QUOTES);
  const joe = shuffleArray(JOE_QUOTES);
  const bridgette = shuffleArray(BRIDGETTE_QUOTES);
  const charlie = shuffleArray(CHARLIE_QUOTES);

  // Interleave: Mayor, Bridgette, Charlie, Duke, Joe...
  // Each person stays in rotation, with quotes cycling if they have fewer than maxLen
  const interleaved: Omit<EndorserQuote, 'id'>[] = [];
  const maxLen = Math.max(lucas.length, duke.length, joe.length, bridgette.length, charlie.length);

  for (let i = 0; i < maxLen; i++) {
    interleaved.push(lucas[i % lucas.length]);
    interleaved.push(bridgette[i % bridgette.length]);
    interleaved.push(charlie[i % charlie.length]);
    interleaved.push(duke[i % duke.length]);
    interleaved.push(joe[i % joe.length]);
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
