import { EndorserQuote } from "@/components/ui/EndorserCardStack";

// Ordered list: Press conference speakers first (in speech order), then remaining endorsers.
// Each person has exactly 2 quotes shown consecutively.
const ORDERED_QUOTES: Omit<EndorserQuote, 'id'>[] = [
  // 1. Quinton Lucas (Mayor) — opened the press conference
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "A yes on the earnings tax is a yes for public safety, a yes for public works improvements, a yes for our employees' housing development, and a yes for Kansas City.",
    imageSrc: "/images/council/mayor-q.png",
  },
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "This is not a new cost, a new expense on Kansas City taxpayers. It continues to allow us to deliver the core basic services we need, with half of those funds coming from non-Kansas Citians.",
    imageSrc: "/images/council/mayor-q.png",
  },

  // 2. Lisa Krigsten (F) — Civic Council Chair
  {
    name: "Lisa Krigsten",
    title: "Chair",
    organization: "Civic Council of Greater Kansas City",
    quote: "Without Kansas City, Missouri, there is no Kansas City region. We are standing in the heart of what makes this region great.",
    imageSrc: "/images/endorsers/lisa-krigsten.png",
    imageScale: 1.25,
    imageOffsetY: -2,
  },
  {
    name: "Lisa Krigsten",
    title: "Chair",
    organization: "Civic Council of Greater Kansas City",
    quote: "Kansas City works when we invest in it, and the earnings tax is the investment that is needed for us to go forth and continue to grow.",
    imageSrc: "/images/endorsers/lisa-krigsten.png",
    imageScale: 1.25,
    imageOffsetY: -2,
  },

  // 3. Bridgette Williams (F) — Heavy Constructors
  {
    name: "Bridgette Williams",
    title: "Executive Director & CEO",
    organization: "Heavy Constructors Association\nof Greater Kansas City",
    quote: "Behind the earnings tax is real people. If you want your trash picked up, your potholes filled, your roads repaired, vote for the earnings tax. Without the earnings tax, those jobs disappear.",
    imageSrc: "/images/endorsers/bridgette-williams.png",
    imageScale: 1.25,
    imageOffsetY: 4,
  },
  {
    name: "Bridgette Williams",
    title: "Executive Director & CEO",
    organization: "Heavy Constructors Association\nof Greater Kansas City",
    quote: "The earnings tax is the one tax that people pay that don't live in Kansas City. You have people from all over the region and from other states paying because they work here.",
    imageSrc: "/images/endorsers/bridgette-williams.png",
    imageScale: 1.25,
    imageOffsetY: 4,
  },

  // 4. Brad Lemon (M) — FOP President
  {
    name: "Brad Lemon",
    title: "President",
    organization: "Fraternal Order of Police\nLodge 99",
    quote: "If you support the police department, if you support law enforcement, I need you to vote. I'm not talking about Republican and I'm not talking about Democrat. I'm talking about Kansas City.",
    imageSrc: "/images/endorsers/brad-lemon.png",
    imageScale: 1.0,
    imageOffsetY: 0,
  },
  {
    name: "Brad Lemon",
    title: "President",
    organization: "Fraternal Order of Police\nLodge 99",
    quote: "We have a fully funded police department. We've increased the number of people we're hiring. Please allow us to continue to do the work we're doing to protect this city.",
    imageSrc: "/images/endorsers/brad-lemon.png",
    imageScale: 1.0,
    imageOffsetY: 0,
  },

  // 5. Dan Heizman (M) — IAFF Local 42 President
  {
    name: "Dan Heizman",
    title: "President",
    organization: "International Association of Fire Fighters\nLocal 42",
    quote: "We love working in this community. We love working for this city. Please get out there on April 7th. Vote yes. Support your firefighters. Support your city.",
    imageSrc: "/images/endorsers/dan-heizman.png",
    imageScale: 1.1,
    imageOffsetY: -4,
  },
  {
    name: "Dan Heizman",
    title: "President",
    organization: "International Association of Fire Fighters\nLocal 42",
    quote: "If we lose this tax, we're going to see massive job cuts, and the level of service we're able to give to the citizens of this city is going to go down dramatically.",
    imageSrc: "/images/endorsers/dan-heizman.png",
    imageScale: 1.1,
    imageOffsetY: -4,
  },

  // 6. Melesa Johnson (F) — Jackson County Prosecutor
  {
    name: "Melesa Johnson",
    title: "Prosecutor",
    organization: "Jackson County, Missouri",
    quote: "Without the earnings tax, everything we have built together begins to unravel.",
    imageSrc: "/images/endorsers/melesa-johnson.png",
    imageScale: 1.0,
    imageOffsetY: 0,
  },
  {
    name: "Melesa Johnson",
    title: "Prosecutor",
    organization: "Jackson County, Missouri",
    quote: "Fewer officers means fewer investigations. Fewer investigations means fewer cases referred for charging, and that means offenders who should be held accountable will walk free longer.",
    imageSrc: "/images/endorsers/melesa-johnson.png",
    imageScale: 1.0,
    imageOffsetY: 0,
  },

  // 7. Charlie Shields (M)
  {
    name: "Charlie Shields",
    title: "President & CEO",
    organization: "University Health",
    quote: "The earnings tax in Kansas City is really what makes this community work. Whether it's supporting our Kansas City Police Department, the ambulances that bring patients to the hospital, or the roads that get repaired. This city doesn't work without the earnings tax.",
    imageSrc: "/images/endorsers/charlie-shields.png",
    imageScale: 1.27,
    imageOffsetY: 4,
  },
  {
    name: "Charlie Shields",
    title: "President & CEO",
    organization: "University Health",
    quote: "If you were in an accident in this city, you're gonna come to University Health by ambulance, that's supported by the earnings tax. You're gonna travel on those roads, that's supported by the earnings tax. It's that important.",
    imageSrc: "/images/endorsers/charlie-shields.png",
    imageScale: 1.27,
    imageOffsetY: 4,
  },

  // 4. Ashley Aune (F)
  {
    name: "Ashley Aune",
    title: "State Representative",
    organization: "Missouri House of Representatives",
    quote: "Northlanders here in Kansas City rely on these services, just like the rest of Kansas City. First responders, trash pickup, snow removal. It's all on the line.",
    imageSrc: "/images/council/ashley-aune.png",
  },
  {
    name: "Ashley Aune",
    title: "State Representative",
    organization: "Missouri House of Representatives",
    quote: "The e-tax ensures that everyone who uses Kansas City services helps pay for them.",
    imageSrc: "/images/council/ashley-aune.png",
  },

  // 5. Joe Reardon (M)
  {
    name: "Joe Reardon",
    title: "President & CEO",
    organization: "Greater KC Chamber of Commerce",
    quote: "Almost 50% of the earnings tax is paid for by those individuals that don't live in Kansas City but work here every day. It's a fair way to make sure essential services are there for all of us.",
    imageSrc: "/images/endorsers/joe-reardon.png",
  },
  {
    name: "Joe Reardon",
    title: "President & CEO",
    organization: "Greater KC Chamber of Commerce",
    quote: "The Chamber represents 2,000 businesses in the Kansas City region. We desire to have a city that's strong, viable, and growing. The earnings tax helps make sure that happens.",
    imageSrc: "/images/endorsers/joe-reardon.png",
  },

  // 6. Ryana Parks-Shaw (F)
  {
    name: "Ryana Parks-Shaw",
    title: "Mayor Pro Tem",
    organization: "Kansas City City Council",
    quote: "In addition to basic services, every swing set, every soccer field, every basketball court is paid for in part by the earnings tax.",
    imageSrc: "/images/council/Ryana-Parks-Shaw.png",
  },
  {
    name: "Ryana Parks-Shaw",
    title: "Mayor Pro Tem",
    organization: "Kansas City City Council",
    quote: "Swope Park is nearly double the size of Central Park in New York, and the earnings tax keeps every acre of it running for our city.",
    imageSrc: "/images/council/Ryana-Parks-Shaw.png",
  },

  // 7. Duke Dujakovich (M)
  {
    name: "Duke Dujakovich",
    title: "President",
    organization: "Greater Kansas City AFL-CIO",
    quote: "This is not a new tax. This is a renewal. This tax has been around longer than I have. It started in 1963. We've been paying this tax all of my life.",
    imageSrc: "/images/endorsers/duke-dujakovich.png",
  },
  {
    name: "Duke Dujakovich",
    title: "President",
    organization: "Greater Kansas City AFL-CIO",
    quote: "Somebody's gotta pay for the services you use when you're here in Kansas City. To fix the streets, to fix the bridges, to be there when you call 911.",
    imageSrc: "/images/endorsers/duke-dujakovich.png",
  },

  // 8. Wes Rogers (M)
  {
    name: "Wes Rogers",
    title: "Councilmember, 2nd District",
    organization: "Kansas City City Council",
    quote: "Half of the tax comes from people who don't live in the city. We kill it, and guess who picks up the tab?",
    imageSrc: "/images/council/Wes-Rogers.png",
  },
  {
    name: "Wes Rogers",
    title: "Councilmember, 2nd District",
    organization: "Kansas City City Council",
    quote: "The e-tax is Kansas City's largest source of revenue, and without it we would be forced to cut basic services. If you're over 65, if you're retired, you don't have to pay it. It's for people that are working.",
    imageSrc: "/images/council/Wes-Rogers.png",
  },

  // 9. Bill Gautreaux (M)
  {
    name: "Bill Gautreaux",
    title: "Managing Partner",
    organization: "MLP Holdings",
    quote: "When I represent the business and civic community, I'm not taking a pro-tax position. In the case of the earnings tax, I'm taking a pro-Kansas City position.",
    imageSrc: "/images/endorsers/bill-gautreaux.png",
    imageScale: 1.25,
    imageOffsetY: -3,
  },
  {
    name: "Bill Gautreaux",
    title: "Managing Partner",
    organization: "MLP Holdings",
    quote: "This is part of what allows us as a city to host a World Series parade, a Super Bowl parade, an NFL draft, an upcoming World Cup. You cannot operate a city without these essential services.",
    imageSrc: "/images/endorsers/bill-gautreaux.png",
    imageScale: 1.25,
    imageOffsetY: -3,
  },

  // 10. Johnathan Duncan (M)
  {
    name: "Johnathan Duncan",
    title: "Councilmember, 6th District",
    organization: "Kansas City City Council",
    quote: "Every neighborhood in Kansas City depends on the e-tax. It's the investment that keeps our city running for all of us.",
    imageSrc: "/images/council/Johnathan-Duncan.png",
  },
  {
    name: "Johnathan Duncan",
    title: "Councilmember, 6th District",
    organization: "Kansas City City Council",
    quote: "Street signs, street lights, our potholes getting fixed. None of that's done for free. That's all e-tax.",
    imageSrc: "/images/council/Johnathan-Duncan.png",
  },

  // 11. Eric Bunch (M)
  {
    name: "Eric Bunch",
    title: "Councilmember, 4th District",
    organization: "Kansas City City Council",
    quote: "Our basic services in Kansas City depend on the earnings tax. It represents about half of our general fund, the fund that helps make sure our basic services are what Kansas Citians expect.",
    imageSrc: "/images/council/Eric-Bunch.png",
  },
  {
    name: "Eric Bunch",
    title: "Councilmember, 4th District",
    organization: "Kansas City City Council",
    quote: "The earnings tax has been in place since 1963, so you'll be voting on a renewal, not a new tax.",
    imageSrc: "/images/council/Eric-Bunch.png",
  },

  // 12. Crispin Rea (M)
  {
    name: "Crispin Rea",
    title: "Councilmember, 4th District At-Large",
    organization: "Kansas City City Council",
    quote: "I grew up on Kansas City's east side, where I saw our neighborhoods devastated by illegal dumping. Because of the e-tax and the efforts it supports, it gets cleaned and it remains clean.",
    imageSrc: "/images/council/Crispin-Rea.png",
  },
  {
    name: "Crispin Rea",
    title: "Councilmember, 4th District At-Large",
    organization: "Kansas City City Council",
    quote: "The e-tax supports the delivery of basic city services that improve the quality of life for all Kansas Citians.",
    imageSrc: "/images/council/Crispin-Rea.png",
  },
];

// Build the final quotes array with IDs
// First rotation: everyone's quote 1, second rotation: everyone's quote 2
export function getOrderedQuotes(): EndorserQuote[] {
  const firstQuotes = ORDERED_QUOTES.filter((_, i) => i % 2 === 0);
  const secondQuotes = ORDERED_QUOTES.filter((_, i) => i % 2 === 1);
  return [...firstQuotes, ...secondQuotes].map((quote, index) => ({
    ...quote,
    id: `quote-${index}`,
  }));
}

// Legacy export for backwards compatibility
export const ENDORSER_QUOTES: EndorserQuote[] = getOrderedQuotes();
export const shuffleQuotes = (quotes: EndorserQuote[]) => quotes;
