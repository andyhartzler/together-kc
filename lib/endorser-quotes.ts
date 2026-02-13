import { EndorserQuote } from "@/components/ui/EndorserCardStack";

// Ordered list: Mayor first, Bridgette second, then alternating M/F as much as possible.
// Each person has exactly 2 quotes shown consecutively.
const ORDERED_QUOTES: Omit<EndorserQuote, 'id'>[] = [
  // 1. Quinton Lucas (Mayor)
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "This tax has funded our city since 1963. It covers nearly half our city services, from fire rescue to street repairs to trash pickup. Vote yes to keep Kansas City working.",
    imageSrc: "/images/council/mayor-q.png",
  },
  {
    name: "Quinton Lucas",
    title: "Mayor of Kansas City",
    quote: "Kansas City is where the region comes to work, to play, to celebrate. The earnings tax lets us provide services to everyone who uses our roads and relies on our first responders, not just residents.",
    imageSrc: "/images/council/mayor-q.png",
  },

  // 2. Bridgette Williams (F)
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
    quote: "Kansas City's ability to remain competitive depends on renewing the earnings tax. It is an investment that is critical for our future. Kansas City's ability to repair and upgrade its aging infrastructure is at stake.",
    imageSrc: "/images/endorsers/bridget williams.png",
    imageScale: 1.25,
  },

  // 3. Charlie Shields (M)
  {
    name: "Charlie Shields",
    title: "President & CEO",
    organization: "University Health",
    quote: "The earnings tax in Kansas City is really what makes this community work. Whether it's supporting our Kansas City Police Department, the ambulances that bring patients to the hospital, or the roads that get repaired. This city doesn't work without the earnings tax.",
    imageSrc: "/images/endorsers/charlie-shields.png",
    imageScale: 1.25,
  },
  {
    name: "Charlie Shields",
    title: "President & CEO",
    organization: "University Health",
    quote: "If you were in an accident in this city, you're gonna come to University Health by ambulance\u2014that's supported by the earnings tax. You're gonna travel on those roads\u2014that's supported by the earnings tax. It's that important.",
    imageSrc: "/images/endorsers/charlie-shields.png",
    imageScale: 1.25,
  },

  // 4. Ashley Aune (F)
  {
    name: "Ashley Aune",
    title: "State Representative",
    organization: "Missouri House of Representatives",
    quote: "Northlanders here in Kansas City rely on these services, just like the rest of Kansas City. First responders, trash pickup, snow removal. It's all on the line.",
    imageSrc: "/images/council/Ashley Aune .jpg",
  },
  {
    name: "Ashley Aune",
    title: "State Representative",
    organization: "Missouri House of Representatives",
    quote: "The e-tax ensures that everyone who uses Kansas City services helps pay for them.",
    imageSrc: "/images/council/Ashley Aune .jpg",
  },

  // 5. Joe Reardon (M)
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
    quote: "The Chamber represents 2,000 businesses in the Kansas City region. We desire to have a city that's strong, viable, and growing. The earnings tax helps make sure that happens.",
    imageSrc: "/images/endorsers/joe-reardon.jpg",
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
    imageSrc: "/images/endorsers/duke-dujakovich.jpg",
  },
  {
    name: "Duke Dujakovich",
    title: "President",
    organization: "Greater Kansas City AFL-CIO",
    quote: "Somebody's gotta pay for the services you use when you're here in Kansas City. To fix the streets, to fix the bridges, to be there when you call 911.",
    imageSrc: "/images/endorsers/duke-dujakovich.jpg",
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
    imageSrc: "/images/endorsers/bill-gautreaux.jpg",
    imageScale: 1.25,
  },
  {
    name: "Bill Gautreaux",
    title: "Managing Partner",
    organization: "MLP Holdings",
    quote: "This is part of what allows us as a city to host a World Series parade, a Super Bowl parade, an NFL draft, an upcoming World Cup. You cannot operate a city without these essential services.",
    imageSrc: "/images/endorsers/bill-gautreaux.jpg",
    imageScale: 1.25,
  },

  // 10. Johnathan Duncan (M)
  {
    name: "Johnathan Duncan",
    title: "Councilmember, 6th District",
    organization: "Kansas City City Council",
    quote: "Every neighborhood in Kansas City depends on the e-tax. It's not just a line on your paycheck, it's the investment that keeps our city running for all of us.",
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
