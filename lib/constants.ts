// Form handler URL (Vercel API route)
export const FORM_HANDLER_URL = '/api/submit';

// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = 'G-W2GQ3Z92QM';

export const COLORS = {
  navy: '#1e3a5f',
  coral: '#e53935',
  golden: '#f5a623',
  sky: '#4a90d9',
  white: '#ffffff',
  lightGray: '#f8f9fa',
} as const;

export const VOTE_DATE = 'April 7, 2026';

export const ELECTION_RESULTS = {
  date: 'April 7, 2026',
  totalYes: 30574,
  totalNo: 9949,
  totalVotes: 40523,
  overallYesPercent: 75.45,
  counties: [
    { name: 'Jackson County', yesVotes: 21194, totalVotes: 26008, yesPercent: 81.49 },
    { name: 'Clay County', yesVotes: 6012, totalVotes: 9286, yesPercent: 64.74 },
    { name: 'Platte County', yesVotes: 3368, totalVotes: 5229, yesPercent: 64.41 },
  ],
} as const;

export const SITE_CONFIG = {
  title: 'Renew the KC Earnings Tax | Vote YES on April 7, 2026',
  description: 'The earnings tax funds nearly half the cost of city services: first responders, street repair, trash pickup, and more. Vote YES to renew the e-tax on or before April 7, 2026.',
  url: 'https://together-kc.com',
  organization: 'Together KC',
} as const;

export const NAV_LINKS = [
  { href: '/etax', label: 'Home' },
  { href: '/vote', label: 'Find Your Polling Place' },
  { href: '/etax/faqs', label: 'FAQs' },
  { href: '/etax/endorsements', label: 'Endorsements' },
  { href: '/etax/donate', label: 'Donate' },
] as const;

export const SERVICES = [
  {
    icon: '🚒',
    title: 'Fire Department',
    description: 'Keeping our neighborhoods safe with rapid emergency response.',
  },
  {
    icon: '🚔',
    title: 'Police',
    description: 'Protecting our communities and maintaining public safety.',
  },
  {
    icon: '🚑',
    title: 'Emergency Medical Services',
    description: 'Providing critical medical care when every second counts.',
  },
  {
    icon: '🛣️',
    title: 'Road Maintenance',
    description: 'Fixing potholes and maintaining our streets and infrastructure.',
  },
  {
    icon: '🗑️',
    title: 'Trash Collection',
    description: 'Weekly pickup and anti-illegal dumping programs.',
  },
  {
    icon: '❄️',
    title: 'Snow Removal',
    description: 'Keeping roads clear and safe during winter weather.',
  },
] as const;

export const KEY_FACTS = [
  { value: '1%', label: 'tax on income earned in Kansas City' },
  { value: '63', label: 'years in place since 1963' },
  { value: '5', label: 'year renewal cycle required by law' },
  { value: '~50%', label: 'of revenue from non-residents working in KC' },
] as const;

export const ENDORSERS = {
  featured: [
    {
      name: 'Mayor Quinton Lucas',
      role: 'Mayor of Kansas City',
      quote: 'The earnings tax is essential to maintaining the city services Kansas Citians depend on every day. I urge everyone to vote YES for renewal.',
    },
  ],
  organizations: [
    // Top confirmed endorsers
    { name: 'Heavy Constructors Association', fullName: 'Heavy Constructors Association of the Greater Kansas City Area', logo: '/images/endorsers/Heavy Constructors.png', website: 'https://kcheavyconstruction.com/' },
    { name: 'Greater KC Chamber of Commerce', fullName: 'Greater Kansas City Chamber of Commerce', logo: '/images/endorsers/KC Chamber.PNG', website: 'https://www.kcchamber.com/' },
    { name: 'Civic Council of Greater Kansas City', fullName: 'Civic Council of Greater Kansas City', logo: '/images/endorsers/Civic Council of Greater Kansas City.png', website: 'https://www.kcciviccouncil.org/' },
    { name: 'Greater KC AFL-CIO', fullName: 'Greater Kansas City AFL-CIO', logo: '/images/endorsers/Greater Kansas City AFL-CIO.png', website: 'https://www.kcaflcio.org/', logoScale: 1.25 },
    // IAFF Local 42 and FOP - second row
    { name: 'IAFF Local 42', fullName: 'International Association of Fire Fighters Local 42', logo: '/images/endorsers/IAFF Local 42.png', website: 'https://www.iaff42.org/', logoScale: 1.25 },
    { name: 'FOP Lodge 99', fullName: 'Fraternal Order of Police Lodge 99', logo: '/images/endorsers/FOP Lodge 99.png', website: 'https://www.kcfop.org/index.cfm', logoScale: 1.25 },
    { name: 'Urban League', fullName: 'Urban League of Greater Kansas City', logo: '/images/endorsers/Urban League.png', website: 'https://www.ulkc.org/', logoScale: 1.3, logoOffsetY: 8 },
    { name: 'Freedom, Inc.', fullName: 'Freedom, Incorporated', logo: '/images/endorsers/Freedom Inc.PNG', website: 'https://freedomincorporated.org/' },
    // Confirmed endorsers
    { name: 'Heartland Black Chamber of Commerce', fullName: 'Heartland Black Chamber of Commerce', logo: '/images/endorsers/Heartland Black Chamber.PNG', website: 'https://heartlandblackchamber.com/' },
    { name: 'Downtown Council', fullName: 'Downtown Council of Kansas City', logo: '/images/endorsers/Downtown Council.png', website: 'https://www.downtownkc.org/' },
    { name: '12th Street Heritage', fullName: 'Twelfth Street Heritage Development Corporation', logo: '/images/endorsers/12th Street Heritage.png', website: 'https://www.twelfthstreetheritage.org/' },
    { name: 'LiUNA Local 264', fullName: "Laborers' International Union of North America Local 264", logo: '/images/endorsers/Laborers 264.PNG', website: 'https://www.local264.com/' },
    { name: 'LaRaza', fullName: 'LaRaza Political Club', logo: '/images/endorsers/LaRaza.png', website: null, logoScale: 0.85 },
    { name: 'Bridlespur Neighborhood Assoc', fullName: 'Bridlespur Homeowners Association', logo: '/images/endorsers/Bridlespur Neighborhood Assoc.png', website: 'https://bridlespurhomeowners.org/' },
    { name: 'Historic West Bottom', fullName: 'Historic West Bottoms Association', logo: '/images/endorsers/Historic West Bottom.png', website: 'https://www.hwb-kc.com/', logoOffsetY: 8 },
    { name: 'Holmes Garden Neighborhood Association', fullName: 'Holmes Garden Neighborhood Association', logo: '/images/endorsers/Holmes Garden Neighborhood Association.png', website: null, logoScale: 0.9 },
    { name: 'Northeast Chamber of Commerce', fullName: 'Northeast Kansas City Chamber of Commerce', logo: '/images/endorsers/Northeast Chamber of Commerce.png', website: 'https://nekcchamber.com/', logoScale: 1.05 },
    { name: 'South KC Chamber of Commerce', fullName: 'South Kansas City Chamber of Commerce', logo: '/images/endorsers/South Kansas City Chamber.PNG', website: 'https://www.southkcchamber.com/' },
    { name: 'Health Forward Foundation', fullName: 'Health Forward Foundation', logo: '/images/endorsers/Health Forward Foundation.png', website: 'https://healthforward.org/', logoScale: 1.5, logoOffsetY: 10 },
    // Union endorsers
    { name: 'Plumbers Local 8', fullName: 'Plumbers & Gasfitters Local 8, United Association', logo: '/images/endorsers/Plumbers Local 8.png', website: 'https://plumberslocal8.com/', logoScale: 1.25 },
    { name: 'IBEW Local 124', fullName: 'International Brotherhood of Electrical Workers Local 124', logo: '/images/endorsers/IBEW Local 124.png', website: 'https://ibew124.org/', logoScale: 1.25 },
    { name: 'OPCMIA Local 518', fullName: "Operative Plasterers' and Cement Masons' International Association Local 518", logo: '/images/endorsers/OPCMIA Local 518.png', website: 'https://opcmia518.org/', logoScale: 1.25 },
    { name: 'IUPAT DC #3', fullName: 'International Union of Painters and Allied Trades District Council 3', logo: '/images/endorsers/IUPAT-DC-3.png', website: 'https://iupatdc3.com/', logoScale: 1.25 },
    { name: 'IUOE Local 101', fullName: 'International Union of Operating Engineers Local 101', logo: '/images/endorsers/IUOE Local 101 logo.png', website: 'https://iuoelocal101.org/', logoScale: 1.25 },
    { name: 'CWA Local 6360', fullName: 'Communications Workers of America Local 6360', logo: '/images/endorsers/CWA Local 6360.png', website: 'https://www.cwa6360.org/', logoScale: 1.25 },
    { name: 'IAMAW Local Lodge 778', fullName: 'International Association of Machinists and Aerospace Workers Local Lodge 778', logo: '/images/endorsers/IAMAW Local Lodge 778.png', website: 'https://www.goiam.org/', logoScale: 1.25 },
    { name: 'AFT Local 691', fullName: 'Kansas City Federation of Teachers & School-Related Personnel, AFT Local 691', logo: '/images/endorsers/AFT Local 691.png', website: 'https://691.mo.aft.org/', logoScale: 1.25 },
    { name: 'Roofers Local 20', fullName: 'Roofers & Waterproofers Local 20', logo: '/images/endorsers/Roofers Local 20.png', website: 'https://www.rooferslocal20.com/', logoScale: 1.25 },
    { name: 'SEATU', fullName: 'Seafarers Entertainment and Allied Trades Union', logo: '/images/endorsers/SEATU.png', website: 'https://www.seatu.org/', logoScale: 1.2 },
    { name: 'APWU Local 67', fullName: 'American Postal Workers Union, Greater Kansas City Metro Area Local 67', logo: '/images/endorsers/APWU Local 67.png', website: 'https://www.gkcmal.org/', logoScale: 1.25 },
    { name: 'Greater KC Building Construction Trades Council', fullName: 'Greater Kansas City Building & Construction Trades Council', logo: '/images/endorsers/Greater KC Building Construction Trades Council .png', website: 'https://www.buildkc.org/' },
    { name: 'Missouri AFL-CIO', fullName: 'Missouri AFL-CIO', logo: '/images/endorsers/ALF-CIO.png', website: 'https://moaflcio.org/' },
    { name: 'AFGE 1336', fullName: 'American Federation of Government Employees Local 1336', logo: '/images/endorsers/AFGE 1336.png', website: 'https://afge1336.com/', logoScale: 1.25 },
    { name: 'IBEW Local 53', fullName: 'International Brotherhood of Electrical Workers Local 53', logo: '/images/endorsers/IBEW Local 53.png', website: 'https://www.ibewlocal53.org/', logoScale: 1.25 },
    { name: 'IAFF Local 3808', fullName: 'International Association of Fire Fighters Local 3808', logo: '/images/endorsers/IAFF Local 3808.png', website: null, logoScale: 1.25 },
    { name: 'Pipefitters Local 533', fullName: 'Pipefitters Local Union 533, United Association', logo: '/images/endorsers/Pipefitters Local 533.png', website: 'https://www.local533.com/', logoScale: 1.25 },
    { name: 'South KC Alliance', fullName: 'South Kansas City Alliance', logo: '/images/endorsers/South KC Alliance.PNG', website: 'https://southkcalliance.org' },
    { name: 'United We', fullName: 'United We', logo: '/images/endorsers/United We.png', website: 'https://www.united-we.org' },
    { name: 'Hispanic Chamber of Commerce', fullName: 'Hispanic Chamber of Commerce of Greater Kansas City', logo: '/images/endorsers/Hispanic Chamber.png', website: 'https://www.hccgkc.com' },
    { name: 'KC Regional Association of REALTORS', fullName: 'Kansas City Regional Association of REALTORS\u00AE', logo: '/images/endorsers/KC Realtors Association.PNG', website: 'https://kcrar.com' },
  ],
  cityOfficials: [
    { name: 'Quinton Lucas', title: 'Mayor', district: '', photo: '/images/council/mayor-q.png' },
    { name: 'Ryana Parks-Shaw', title: 'Mayor Pro Tem', district: '5th District', photo: '/images/council/Ryana-Parks-Shaw.png' },
    { name: 'Kevin O\'Neill', title: 'Councilmember', district: '1st District at Large', photo: '/images/council/Kevin-ONeill.png' },
    { name: 'Lindsay French', title: 'Councilmember', district: '2nd District at Large', photo: '/images/council/Lindsay-French.png' },
    { name: 'Wes Rogers', title: 'Councilmember', district: '2nd District', photo: '/images/council/Wes-Rogers.png' },
    { name: 'Melissa Patterson Hazley', title: 'Councilmember', district: '3rd District at Large', photo: '/images/council/Melissa-Patterson.png' },
    { name: 'Crispin Rea', title: 'Councilmember', district: '4th District at Large', photo: '/images/council/Crispin-Rea.png' },
    { name: 'Eric Bunch', title: 'Councilmember', district: '4th District', photo: '/images/council/Eric-Bunch.png' },
    { name: 'Darrell Curls', title: 'Councilmember', district: '5th District at Large', photo: '/images/council/Darrell-Curls.png' },
    { name: 'Andrea Bough', title: 'Councilmember', district: '6th District at Large', photo: '/images/council/Andrea-Bough.png' },
    { name: 'Johnathan Duncan', title: 'Councilmember', district: '6th District', photo: '/images/council/Johnathan-Duncan.png' },
  ],
  electedOfficials: [
    { name: 'Ashley Aune', title: 'State Representative', district: 'House District 14', photo: '/images/council/Ashley Aune .jpg' },
    { name: 'Barbara Washington', title: 'State Senator', district: 'Senate District 9', photo: '/images/council/Senator Barbara Washington.jpg' },
    { name: 'Michael Johnson', title: 'State Representative', district: 'House District 23', photo: '/images/council/Michael Johnson.png' },
    { name: 'Patty Lewis', title: 'State Senator', district: 'Senate District 7', photo: '/images/council/Patty_Lewis.jpg' },
    { name: 'Maggie Nurrenbern', title: 'State Senator', district: 'Senate District 17', photo: '/images/council/Maggie Nurrenbern.jpg' },
    { name: 'Bill Allen', title: 'State Representative', district: 'House District 17', photo: '/images/council/Bill_Allen.png' },
  ],
} as const;

export const FAQS = [
  {
    question: 'What is the earnings tax?',
    answer: 'The earnings tax ("e-tax") is a 1% tax on income earned by residents of Kansas City and nonresidents who work within the city limits. That revenue is used to fund city services enjoyed by every resident of Kansas City, including first responders (firefighters, paramedics/EMTs, and police officers), trash pickup, road maintenance and pothole repair, and snow removal. Historically, about half the revenue generated by the e-tax is paid by people who live outside Kansas City. Because it is a tax on income, retired residents or those who are not working do not pay the e-tax. Social Security, disability, and unemployment income are not subject to the e-tax.',
  },
  {
    question: 'Will voting "yes" raise my taxes?',
    answer: 'No. The earnings tax has been in place in Kansas City since 1963. A "yes" vote will renew the tax at its current rate, without raising taxes for anyone.',
  },
  {
    question: 'What benefits does the e-tax have for me?',
    answer: 'The e-tax funds critical city services, including first responders (firefighters, paramedics/EMTs, and police officers), trash pickup, anti-illegal dumping efforts, road maintenance and pothole repair, snow removal, and more, without higher sales or property taxes. Kansas City has made significant investments in improving city services, especially in public safety and road repair, that have been made possible because of the earnings tax. Every resident of Kansas City benefits from these services, and from the lower property and sales tax rates that the e-tax makes possible.',
  },
  {
    question: 'Can we fund these services with other funding sources?',
    answer: 'No. Failed renewal of the e-tax would result in cuts to city services, including first responder layoffs, increased emergency response times, and cuts to trash pickup, road maintenance, and snow removal. Replacing the revenue generated by the e-tax would require significant increases in sales and/or property taxes, affecting every person in Kansas City, and even those increases would not replace the funding we would lose without the e-tax.',
  },
  {
    question: 'Who supports the renewal of the e-tax?',
    answer: 'E-tax renewal is supported by a coalition of community support, business leaders, labor organizations, and elected officials, including the Greater Kansas City Chamber of Commerce, the Heavy Constructors Association, Fire Fighters Local 42, Mayor Quinton Lucas, the KC Civic Council and more. Our list of endorsements is constantly growing; for an up-to-date list, visit together-kc.com/endorsements.',
  },
  {
    question: 'Why is the e-tax being put up for a vote?',
    answer: 'Missouri law requires that the e-tax be put up for a renewal vote every five years. The e-tax has been in place since it was first approved by Kansas City voters in 1963.',
  },
  {
    question: 'Is the e-tax legal?',
    answer: 'Yes. The city attorney\'s office has determined that the e-tax is legal, and it has been in place since 1963.',
  },
  {
    question: 'How can I help?',
    answer: 'Community support across Kansas City is vitally important in this local election, where every vote counts. You can become an endorser at together-kc.com, and volunteer to take many actions to support the renewal of the earnings tax, including writing or signing letters to the editor, contacting your friends, and amplifying our message on social media by contacting action@together-kc.com.',
  },
  {
    question: 'When is the Kansas City election?',
    answer: 'The election is April 7, 2026. Early voting is open March 24 through April 6.',
  },
  {
    question: 'Where can I vote early in Kansas City?',
    answer: 'Early voting (no-excuse absentee) is available March 24 through April 6, 2026. Jackson County voters can vote at the Kansas City Election Board (4405 E. 50th Terrace) or at satellite locations across the city. Clay County voters can visit the Clay County Election Board (100 W. Mississippi Ave, Liberty). Platte County voters can go to the Platte County Election Board (415 Third St, Platte City). Cass County voters can visit the Cass County Clerk office (102 E. Wall St, Harrisonville). Visit together-kc.com/vote for a full list of locations, hours, and directions.',
  },
  {
    question: 'Where is my polling place on Election Day?',
    answer: 'On Election Day (April 7, 2026), voters must go to their assigned polling place based on their home address. Jackson County voters in Kansas City can vote at any Kansas City polling location. You can look up your assigned polling place and get directions at together-kc.com/vote or contact your county election board.',
  },
  {
    question: 'What time do polls open and close?',
    answer: 'Polls are open from 6:00 AM to 7:00 PM on Election Day, April 7, 2026.',
  },
] as const;

// SEO Keywords organized by category
export const SEO_KEYWORDS = {
  primary: [
    'Kansas City earnings tax',
    'KC e-tax',
    'KC etax',
    'e-tax renewal',
    'earnings tax renewal 2026',
    'Kansas City e-tax renewal',
  ],
  secondary: [
    'Vote YES Kansas City',
    'April 7 2026 election',
    'KC first responders funding',
    'Kansas City city services',
    'KC municipal tax',
    'Together KC',
  ],
  longtail: [
    'when is KC earnings tax vote',
    'what does KC earnings tax fund',
    'should I vote yes on earnings tax',
    'Kansas City earnings tax election 2026',
    'how much is Kansas City earnings tax',
    'who pays KC earnings tax',
    'KC earnings tax renewal vote',
  ],
  local: [
    'Kansas City Missouri tax',
    'KCMO earnings tax',
    'Jackson County election',
    'Kansas City MO e-tax',
    'Missouri earnings tax',
  ],
  intent: [
    'renew KC earnings tax',
    'support Kansas City services',
    'vote for KC first responders',
    'fund Kansas City police fire EMS',
  ],
} as const;

// Extended site configuration for SEO
export const SITE_SEO_CONFIG = {
  // Tax information
  tax: {
    rate: '1%',
    yearEstablished: 1963,
    annualRevenue: '$373 million',
    budgetPercentage: '47%',
    renewalCycle: 5,
  },
  // Election information
  election: {
    date: '2026-04-07',
    dateFormatted: 'April 7, 2026',
    absenteeStart: '2026-03-24',
    absenteeStartFormatted: 'March 24, 2026',
  },
  // Geographic information
  geo: {
    city: 'Kansas City',
    state: 'Missouri',
    stateAbbr: 'MO',
    country: 'US',
    latitude: 39.0997,
    longitude: -94.5786,
  },
  // Services funded by the tax
  servicesFunded: [
    'Fire Department',
    'Police Department',
    'Emergency Medical Services',
    'Road Maintenance',
    'Trash Collection',
    'Snow Removal',
    'Parks Maintenance',
  ],
} as const;

// ===========================================================================
// AUGUST 4, 2026 BALLOT CAMPAIGN
// Five Kansas City measures (four bonds + one sales-tax renewal).
// Copy is fact-checked and source-cited. "No new tax" framing is phrased
// defensibly per measure: revenue bonds (water/sewer) are repaid from utility
// fees, GO bonds (housing/civic) keep the property-tax RATE flat by replacing
// retiring debt, and CCED renews an existing sales tax. Do not flatten the GO
// bonds into "tax-free." Official KCEB question numbers (Q1 housing, Q2 civic,
// Q3 central city, Q4 water, Q5 sewers) are confirmed from the KCEB Issues-Only
// sample ballot and are shown on each measure.
// ===========================================================================
export const AUGUST_BALLOT = {
  electionDate: 'August 4, 2026',
  earlyVotingDate: 'July 21, 2026',
  pollsOpen: '6:00 AM to 7:00 PM',
  hero: {
    eyebrow: 'Kansas City Ballot, August 4, 2026',
    headline: 'Vote YES on all five.',
    subhead:
      'Five questions are on the August 4 ballot. Clean water. Protected rivers. Affordable homes. Working civic buildings. Reinvestment on the East Side. Not one of them raises your tax rate, and every one of them moves Kansas City forward.',
    primaryCta: 'See all five questions',
    secondaryCta: 'How to vote',
    flipWords: ['Clean water.', 'Safe rivers.', 'Affordable homes.', 'Working civic buildings.', 'A stronger East Side.'],
    hook: [
      { target: 1.7, decimals: 1, prefix: '$', suffix: 'B', display: '', label: 'for Kansas City' },
      { target: 0, decimals: 0, prefix: '', suffix: '', display: '$0', label: 'new taxes' },
    ],
    stats: [
      { value: 'Five', label: 'questions on the ballot' },
      { value: '~$1.7B', label: 'invested back into Kansas City' },
      { value: 'No', label: 'tax-rate increase' },
    ],
  },
  intro: {
    eyebrow: 'The August Ballot',
    heading: 'Five yeses for the city we love',
    body:
      'Kansas City just renewed the earnings tax with a decisive YES, and the same spirit shows up again this August. The City Council placed five measures on the August 4 ballot: two that keep our drinking water and sewers reliable, one that builds affordable homes, one that repairs the convention center and City Hall, and one that renews investment on the East Side. Here is the honest part. Not one of these creates a new tax or raises a tax rate. Two are funded through utility fees you already pay, two replace older debt that is being paid off, and one simply continues a tax already in place. Read each question below, then vote YES on all five.',
  },
  questionsSection: {
    eyebrow: 'On Your Ballot',
    heading: 'The five questions',
    sub: 'Each one is a YES. Here is what they do, what they cost you, and why they matter.',
  },
  questions: [
    {
      anchorId: 'clean-water',
      bigStat: { target: 750, decimals: 0, prefix: '$', suffix: 'M', display: '' },
      punch: 'Fix the pipes that bring you clean water.',
      costChip: 'No new tax',
      eyebrow: 'Clean Water',
      icon: '💧',
      accent: 'sky',
      title: "$750 million to keep Kansas City's drinking water reliable",
      oneLiner:
        'Repair and modernize the water system with revenue bonds, funded through water rates, not property taxes.',
      body:
        "Kansas City's drinking-water system is aging, and much of this work is required to keep service reliable and meet federal and state drinking-water rules. This question authorizes up to $750 million in waterworks revenue bonds to replace water mains and upgrade treatment, pumping, and distribution. Because the bonds are repaid from KC Water's existing water-rate revenue rather than any tax, voting YES adds no new tax. City staff say revenue bonds are the cheapest financing available, and that rejecting them would force pricier borrowing and steeper future rate increases. This is the drinking-water companion to the sewer revenue bonds Kansas City voters approved before.",
      costLine:
        'No new tax and no tax increase. These are revenue bonds repaid through water rates, not property taxes. This is not a promise that water bills never rise; rates are set separately by the City.',
      yesCta: 'Vote YES on Clean Water',
      sourceNote:
        'Sources: City of Kansas City ballot ordinance; KCUR and The Beacon August 2026 ballot guides. Confirm final wording on the KCEB sample ballot.',
    },
    {
      anchorId: 'sewers',
      bigStat: { target: 750, decimals: 0, prefix: '$', suffix: 'M', display: '' },
      punch: 'Keep raw sewage out of our rivers.',
      costChip: 'No new tax',
      eyebrow: 'Sewers',
      icon: '🌊',
      accent: 'navy',
      title: '$750 million to clean up our rivers and fix the sewers',
      oneLiner:
        'Fund the federal Clean Water Act cleanup with revenue bonds, repaid through sewer fees, not property taxes.',
      body:
        'Kansas City is under a 2010 federal Clean Water Act consent decree that requires the city to sharply cut raw sewage overflows into local creeks, streams, and rivers. The court-ordered Smart Sewer program must capture 85 percent of wet-weather flows by 2040. This question authorizes up to $750 million in sanitary-sewer revenue bonds to keep that mandated work moving using the lowest-cost debt available, repaid through sewer fees residents already pay rather than any new tax. Rejecting it would not cancel the federal obligation. It would only push the City toward pricier borrowing, which staff warn would raise sewer rates faster.',
      costLine:
        'No new tax and no tax increase. Repaid through sewer fees, not property taxes. Sewer rates are still set annually and have been rising to fund the federal cleanup; this does not freeze them.',
      yesCta: 'Vote YES on Sewers',
      sourceNote:
        'Sources: City ballot ordinance; EPA consent-decree record; KC Smart Sewer Third Amended Consent Decree (2040 deadline, 85% capture, about $2.3 billion).',
    },
    {
      anchorId: 'housing',
      bigStat: { target: 100, decimals: 0, prefix: '$', suffix: 'M', display: '' },
      punch: 'Build affordable homes across Kansas City.',
      costChip: 'No rate increase',
      eyebrow: 'Housing',
      icon: '🏠',
      accent: 'coral',
      title: '$100 million for affordable homes, with no rate increase',
      oneLiner:
        'Double the City’s annual affordable-housing investment by replacing retiring debt, keeping the property tax rate flat.',
      body:
        'Kansas City faces an estimated 64,000-unit shortage of affordable housing, concentrated among the lowest-income households. This question authorizes up to $100 million in bonds for rehab, new construction, and blight removal serving very-low- to moderate-income families, roughly doubling the City’s affordable-housing investment to about $20 million a year through the Housing Trust Fund. It is a general obligation bond backed by the City’s debt-service property tax levy, but it is structured to replace existing debt being paid off, so the debt-service tax rate stays flat. The Housing Trust Fund has already awarded more than $60 million and supported nearly 3,000 affordable units.',
      costLine:
        'No increase to your property tax rate. The new bonds replace debt being paid off, keeping the existing debt-service levy level. This is a property-tax-backed bond, not a tax-free measure.',
      yesCta: 'Vote YES on Housing',
      sourceNote:
        'Sources: City ballot ordinance; City of Kansas City Housing Trust Fund figures; KCUR and KCTV5 August 2026 ballot guides. Requires a four-sevenths supermajority.',
    },
    {
      anchorId: 'civic-buildings',
      bigStat: { target: 100, decimals: 0, prefix: '$', suffix: 'M', display: '' },
      punch: 'Repair Bartle Hall, City Hall, and more.',
      costChip: 'No rate increase',
      eyebrow: 'Civic Buildings',
      icon: '🏛️',
      accent: 'golden',
      title: '$100 million to repair the convention center and City Hall',
      oneLiner:
        'Fix aging civic buildings by replacing retiring debt, with no projected property tax rate increase.',
      body:
        'Bartle Hall, Municipal Auditorium, and City Hall are core civic assets, and their heating, electrical, and building systems are wearing out. The convention center competes for events that bring visitors and spending into Kansas City, and City Hall, opened in 1937, houses core city government. This question authorizes up to $100 million in bonds, with city staff planning roughly $75 million for the convention center and $25 million for City Hall. It is a general obligation bond, but it is timed to replace retiring debt, so no property tax rate increase is expected. City staff describe these as core infrastructure repairs, not cosmetic upgrades.',
      costLine:
        'No property tax rate increase is expected, because these bonds are timed to replace existing debt being paid off. The ballot authorizes the City to maintain the levy to repay the bonds; it does not prohibit a tax increase.',
      yesCta: 'Vote YES on Civic Buildings',
      sourceNote:
        "Sources: City ballot ordinance; KCUR and KCTV5 August 2026 ballot guides. Dollar splits reflect city staff's planned allocation. Requires a four-sevenths supermajority.",
    },
    {
      anchorId: 'central-city',
      bigStat: { target: 0, decimals: 0, prefix: '', suffix: '', display: '1/8¢' },
      punch: 'Keep investing in the East Side.',
      costChip: 'Same rate, renewed',
      eyebrow: 'Central City',
      icon: '🌇',
      accent: 'sky',
      title: 'Renew the East Side reinvestment tax, no rate change',
      oneLiner:
        'Continue the one-eighth-cent sales tax that funds economic development on the East Side, at the same rate.',
      body:
        "The Central City Economic Development sales tax is the primary dedicated funding stream for economic development on Kansas City's historically disinvested East Side. Since 2017 it has put more than $88 million into 58 projects in the district, financing development that private capital alone has not delivered. This question renews the same one-eighth-cent rate for another 10 years, so a YES vote keeps the sales tax exactly where it is. Its current authorization expires September 30, 2027. Letting it lapse would remove roughly $10 million a year aimed at jobs, small and locally owned businesses, and neighborhood revitalization.",
      costLine:
        'No new tax and no tax increase. This renews an existing one-eighth-cent sales tax at the same rate. It is not no tax: if rejected, the levy expires after September 30, 2027.',
      yesCta: 'Vote YES on Central City',
      sourceNote:
        'Sources: City ballot ordinance; EDCKC and KCUR. District bounded by 9th Street, Gregory Boulevard, The Paseo, and Indiana Avenue.',
    },
  ],
  costs: {
    eyebrow: 'The Honest Part',
    heading: 'What it costs you',
    body:
      'Honest answer: none of these five questions creates a new tax, and none of them raises a tax rate. Here is the precise breakdown, because the details matter and you deserve them straight.',
    points: [
      'Clean Water and Sewers are revenue bonds. They are repaid only from the water and sewer fees KC Water already collects, not from property taxes. There is no new tax and no tax increase tied to either question. These are not a promise that utility bills never rise (rates are set separately by the City), but city staff say revenue bonds are the cheapest way to fund work that has to happen anyway, and that rejecting them would force pricier borrowing and faster rate increases.',
      'Housing and Civic Buildings are general obligation bonds, backed by the City’s existing debt-service property tax levy. They do not raise your property tax rate, because the new bonds are timed to replace older debt that is being paid off. City staff project the overall debt-service rate stays flat. You keep paying the same rate you already pay, not a higher one.',
      'Central City is a renewal of an existing tax, not a new one. The one-eighth-cent sales tax has been collected in the district since 2017. A YES vote keeps that rate exactly where it is. Shoppers see no increase. If it fails, the tax simply expires after September 30, 2027.',
    ],
    bottomLine:
      'Bottom line: vote YES on all five and your tax rates do not go up. Two are funded entirely through utility fees, two replace retiring debt, and one continues a tax that is already in place.',
  },
  costsShort: {
    big: '$0',
    sub: 'new taxes',
    headline: 'Five yeses. Zero new taxes.',
    chips: ['Funded by utility fees', 'New bonds replace old debt', 'Renews an existing tax'],
  },
  voteSteps: [
    { kicker: 'Step one', date: 'By July 8', title: 'Register to vote' },
    { kicker: 'Step two', date: 'July 21', title: 'Early voting opens' },
    { kicker: 'Step three', date: 'August 4', title: 'Election Day', sub: 'Polls open 6am to 7pm' },
  ],
  howToVote: {
    eyebrow: 'Make Your Plan',
    heading: 'How to vote YES on all five',
    earlyVoting: {
      title: 'Vote early',
      line: 'No-excuse early in-person voting begins Tuesday, July 21, 2026. Vote early at the Kansas City Election Board or your county election board.',
    },
    electionDay: {
      title: 'Election Day',
      line: 'Election Day is Tuesday, August 4, 2026. Polls are open 6:00 AM to 7:00 PM. Vote at your assigned polling place based on your home address.',
    },
    registration: {
      title: 'Register first',
      line: 'Register to vote by the Missouri deadline, which falls on the fourth Wednesday before the election (about July 8, 2026). Confirm the exact date with your county election board before it passes.',
    },
    pollingNote:
      'Not sure where you vote? Look up your assigned polling place and hours through the Kansas City Election Board or your county election board, and confirm the official question order on your authenticated sample ballot.',
  },
  faqsSection: {
    eyebrow: 'Questions and Answers',
    heading: 'What you need to know',
  },
  faqs: [
    {
      question: 'Will voting YES raise my taxes?',
      answer:
        'No. None of the five questions creates a new tax or raises a tax rate. The water and sewer questions are revenue bonds repaid only from utility fees, not property taxes. The housing and civic-buildings questions are property-tax-backed bonds, but they are timed to replace older debt being paid off, so the debt-service tax rate is projected to stay flat. The Central City question simply renews a sales tax that is already in place at the same rate. A YES on all five does not increase your tax rates.',
    },
    {
      question: 'What is on the August 4, 2026 ballot?',
      answer:
        'Five Kansas City measures placed on the ballot by the City Council, anchored by about $1.7 billion in bonds: a $750 million drinking-water revenue bond, a $750 million sanitary-sewer revenue bond, a $100 million affordable-housing bond, a $100 million civic-facilities bond for the convention center and City Hall, and a 10-year renewal of the one-eighth-cent Central City Economic Development sales tax.',
    },
    {
      question: 'Are the water and sewer questions really not a tax?',
      answer:
        'Correct. Both are revenue bonds, repaid solely from the water and sewer fees KC Water already collects, not from any property tax. They are not a guarantee that utility bills stay flat, because rates are set separately by the City and sewer rates have been rising for years to fund a federal cleanup. But the bonds themselves add no new tax, and city staff say they are the lowest-cost way to fund work the City is legally required to do.',
    },
    {
      question: 'If the housing and civic bonds are backed by property tax, how is that no increase?',
      answer:
        'These are general obligation bonds secured by the City’s debt-service property tax levy. The reason there is no rate increase is timing: the new bonds are issued to replace existing debt that is being paid off. City staff project that about $200 million in new bonds (the housing and civic questions combined) replaces roughly $200 million of retiring debt, so the overall debt-service rate stays level. You keep paying the rate you already pay.',
    },
    {
      question: 'What does the Central City question do?',
      answer:
        'It renews, for another 10 years, the one-eighth-cent sales tax that has funded economic development on Kansas City’s East Side since 2017. It is a renewal, not a new tax, so the sales tax rate stays exactly the same. The tax has put more than $88 million into 58 projects in the district. Its current authorization expires September 30, 2027, so a YES vote keeps that reinvestment going.',
    },
    {
      question: 'Why does the housing bond need more votes than a normal majority?',
      answer:
        'Because it is a general obligation bond on an August primary ballot, it requires a four-sevenths supermajority (about 57.1 percent) to pass. The civic-facilities bond needs the same supermajority. That higher bar is exactly why turnout matters. Every YES vote counts toward that threshold.',
    },
    {
      question: 'When and where do I vote?',
      answer:
        'Election Day is Tuesday, August 4, 2026, with polls open 6:00 AM to 7:00 PM. No-excuse early in-person voting begins Tuesday, July 21, 2026. To vote in this election you must be registered by the Missouri deadline, which falls on the fourth Wednesday before the election (about July 8, 2026); confirm the exact date with your county election board. On Election Day, vote at your assigned polling place based on your home address. Look up your polling place with the Kansas City Election Board or your county board.',
    },
    {
      question: 'Who is behind this effort?',
      answer:
        'Together KC, the same coalition that helped renew the Kansas City earnings tax with a strong YES vote on April 7, 2026. We support a Kansas City that invests in clean water, safe rivers, affordable homes, working civic buildings, and reinvestment in every neighborhood. Always confirm the official wording and question order on your authenticated sample ballot from the Kansas City Election Board.',
    },
  ],
  closing: {
    heading: 'Five questions. Five yeses. One stronger Kansas City.',
    body:
      'Together KC backed the e-tax renewal and Kansas City said YES. Now we are asking you to show up again. These five measures keep our water clean, our rivers protected, our neighborhoods housed, our civic buildings working, and our East Side investing in itself. Vote YES on all five on or before Tuesday, August 4, 2026.',
    cta: 'Vote YES on all five',
  },
  exploreLinks: [
    { label: 'E-Tax Victory', href: '/etax/victory' },
    { label: 'E-Tax Home', href: '/etax' },
    { label: 'Endorsements', href: '/etax/endorsements' },
    { label: 'FAQs', href: '/etax/faqs' },
  ],
  // =========================================================================
  // PER-MEASURE DETAIL DATA (single source of truth for /questions/[slug]).
  // Order defines the prev/next cycle. Each measure carries everything both the
  // hub card and the bespoke detail page need. Official question numbers are
  // included because they are confirmed verbatim from the KCEB Issues-Only
  // sample ballot PDF; officialQuestion.text is the verbatim ballot language.
  // Cost framing stays mechanism-accurate per measure (revenue bond vs GO bond
  // vs sales-tax renewal) and is never flattened to "tax-free".
  // =========================================================================
  measures: [
    {
      slug: 'clean-water',
      name: 'Clean Water',
      eyebrow: 'Clean Water',
      motif: 'clean-water',
      title: "Clean Water: $750 million to keep Kansas City's drinking water reliable",
      cardPunch: 'Fix the pipes that bring you clean water.',
      cardSub:
        'Repair and modernize the water system with revenue bonds, funded through water rates, not property taxes.',
      amount: '$750,000,000',
      bigStat: { target: 750, decimals: 0, prefix: '$', suffix: 'M', display: '', label: 'in water bonds' },
      accent: {
        name: 'Sky',
        swatch: '#4a90d9',
        gradient: 'from-sky to-navy',
        gradientHero: 'from-sky to-navy',
        glow: 'rgba(74,144,217,0.45)',
      },
      costChip: 'No new tax',
      costFraming:
        'Revenue bond repaid from utility water rates, not taxes. No property tax impact. Cheapest available financing for mandatory infrastructure; rejecting it raises costs and rates.',
      mechanism:
        'Waterworks revenue bonds. Principal and interest are payable solely from the revenues KC Water derives from operating the waterworks system (water bills and fees). By law the City cannot use property, sales, or earnings tax money to repay them, so there is no property tax impact. Revenue bonds carry lower interest rates than the alternative financing KC Water would otherwise use, and city staff say the bond costs are already built into the utility long-range rate plan.',
      honestCost:
        'No new tax and no tax increase. These are revenue bonds repaid only from the water rates KC Water already collects, not from property, sales, or earnings taxes, so they have no property tax impact. This is not a promise that your water bill never rises. Water rates are set separately by the City and the cost of this work is already factored into the utility rate plan. The honest framing: a YES funds work that has to happen anyway with the cheapest available borrowing, while a NO forces KC Water into pricier debt and faster rate increases.',
      voteThreshold: 'Simple majority',
      officialQuestion: {
        number: 'Question 4',
        text: "Shall the City of Kansas City, Missouri issue waterworks revenue bonds in the principal amount of $750,000,000.00 for the purpose of rehabilitating, expanding and improving the City's waterworks system, including acquiring necessary land and rights of way, in order to provide for its continuing operation and to maintain compliance with federal, state and judicial requirements, with the principal of and interest on said revenue bonds to be payable solely from the revenues derived by the City from the operation of its waterworks system, including all future rehabilitations, improvements and expansions thereto?",
      },
      heroStats: [
        { value: '$750M', label: 'in waterworks revenue bonds (Question 4)' },
        { value: '2,800 mi', label: 'of water mains KC Water keeps flowing' },
        { value: '172,000', label: 'customers served by the drinking-water system' },
        { value: '$0', label: 'impact on your property taxes' },
      ],
      narrative: {
        problem:
          "Kansas City's drinking-water system is large and aging. KC Water maintains roughly 2,800 miles of water mains, a 240-million-gallon-per-day treatment plant, four major pump stations, and fourteen re-pump stations to deliver safe water to about 172,000 customers plus 34 wholesale customers. Pipes, pumps, and treatment equipment wear out, and federal and state drinking-water rules keep getting stricter. Much of this work is not optional. It is required to keep clean water coming out of the tap and to stay in compliance with federal, state, and judicial requirements.",
        whatItDoes:
          'Question 4 authorizes the City to issue up to $750 million in waterworks revenue bonds to rehabilitate, expand, and improve the drinking-water system, including acquiring land and rights of way. In plain terms, that means replacing old water mains and upgrading treatment, pumping, and distribution so service stays reliable. The bonds are repaid solely from KC Water’s own water-rate revenue. The City is legally barred from using property, sales, or earnings taxes to pay them back.',
        whyItMatters:
          'Revenue bonds are the lowest-cost money available for infrastructure that has to be rebuilt regardless of how anyone votes. City staff say the cost of these bonds is already baked into KC Water’s long-range rate plan. If voters reject them, the work still has to happen, but the utility would be forced into more expensive financing with higher interest rates, which means bigger rate increases for the same projects. This is the drinking-water companion to the sanitary-sewer revenue bonds in Question 5 and to the $750 million sewer bonds Kansas City voters already approved in 2022.',
        whatYourYesDoes:
          'A YES on Question 4 lets KC Water borrow at the cheapest available rate to keep clean, reliable water flowing and to stay compliant with federal and state drinking-water rules, without adding a single dollar to your property tax bill. A NO does not stop the projects. It just makes them cost more and pushes water rates up faster.',
      },
      keyFacts: [
        'Official ballot designation: Question 4 on the City of Kansas City, Missouri portion of the August 4, 2026 special election ballot.',
        'Authorizes up to $750,000,000 in waterworks revenue bonds.',
        'Bonds are payable solely from waterworks system revenues (water bills and fees); the City cannot use property, sales, or earnings tax to repay them, so there is no property tax impact.',
        'Funds rehabilitating, expanding, and improving the drinking-water system, including acquiring land and rights of way, and maintaining compliance with federal, state, and judicial requirements.',
        "KC Water's drinking-water system spans roughly 2,800 miles of water mains, a 240-million-gallon-per-day treatment plant, 4 major pump stations, and 14 re-pump stations.",
        'The system serves about 172,000 customers plus 34 active wholesale customers; about 80% of raw water comes from the Missouri River and 20% from the Missouri River aquifer.',
        'City staff say the bond costs are already built into KC Water’s plan for future rates; rejecting the bonds would force costlier borrowing and faster rate increases.',
        'Requires only a simple majority to pass, unlike the general-obligation bond questions (Questions 1 and 2), which need a four-sevenths supermajority.',
        'Voters approved the prior $500 million water revenue bond authorization in April 2014 with 79% support; it is now nearly exhausted.',
      ],
      // Real, sourced dates. Per the design spec the detail page may choose to
      // omit this rail for clean-water; the data stays here as source of truth.
      timeline: [
        { date: '2022-04-05', label: 'Kansas City voters approve $750 million in sanitary-sewer revenue bonds, the prior KC Water bond authorization' },
        { date: '2026-05', label: 'City Council places five measures, including the $750 million waterworks bond, on the August 4 ballot' },
        { date: '2026-07-08', label: 'Last day to register to vote in the August 4 election' },
        { date: '2026-07-21', label: 'No-excuse early in-person voting opens' },
        { date: '2026-08-04', label: 'Election Day: polls open 6:00 AM to 7:00 PM' },
      ],
      realExamples: [
        'Prior KC Water bond proceeds (2014 and 2022 authorizations) paid for projects such as backup generators, odor control, wastewater treatment plant upgrades, and water- and sewer-main repairs citywide, per KCUR.',
        "KC Water's 240-million-gallon-per-day treatment plant and roughly 2,800 miles of mains are the kind of assets this authorization is meant to keep rehabilitating and upgrading.",
      ],
      ordinance: 'Ordinance Nos. 260481 and 260482',
      cipBreakdown: {
        heading: 'Projected Water CIP, FY2027 to FY2031',
        fiscalRange: 'FY2027 to FY2031',
        rows: [
          { label: 'Distribution', value: 737047978 },
          { label: 'Facilities', value: 314326937 },
          { label: 'Transmission', value: 91800000 },
          { label: 'Operations', value: 27662135 },
          { label: 'Pump Station', value: 22000000 },
          { label: 'Storage', value: 7413801 },
        ],
        total: 1200250851,
        asking: 750000000,
        note: 'Over $1.2 billion in projected water capital needs over five years. This question authorizes $750 million of it. Excludes the South Water Supply Resiliency project.',
      },
      bondHistory: {
        heading: 'Kansas City has done this before',
        approval: '79% YES, April 2014',
        note: 'Voters authorized $500 million in water revenue bonds in April 2014 with 79% support. Through the 2025A issuance the City has used $484.4 million of that authorization, leaving only about $15.6 million. A new authorization keeps the capital program funded.',
        points: [
          { label: '2015A', value: 59790000 },
          { label: '2017A', value: 78130000 },
          { label: '2020A', value: 64720000 },
          { label: '2023A', value: 53165000 },
          { label: '2024A', value: 83585000 },
          { label: '2025A', value: 144985000 },
        ],
      },
      srfApplications: [],
      srfNote: 'Authorizing these bonds also lets KC Water tap the State Revolving Fund (SRF) Drinking Water program, the lowest-cost loans available, which are limited and competitive.',
      financingLadder: {
        rungs: [
          { tier: 'Appropriation debt', level: 'Highest cost', note: 'No voter approval needed, but the highest interest rate.' },
          { tier: 'Revenue bonds', level: 'Lower cost', note: 'Lower interest. This is what the question authorizes.' },
          { tier: 'SRF loans', level: 'Lowest cost', note: 'State Revolving Fund loans, the cheapest money available, but limited and competitive.' },
        ],
      },
      completedProjects: null,
      civicProjects: null,
      ccedRevenue: null,
      ccedProjects: null,
      ccedDistrict: null,
      faqs: [
        { q: 'Does Question 4 raise my taxes?', a: 'No. These are waterworks revenue bonds, repaid solely from KC Water’s own water-rate revenue. The City is legally prohibited from using property, sales, or earnings tax money to pay them back, so there is no property tax impact.' },
        { q: 'Will my water bill go up because of this?', a: 'This question does not set rates. City staff say the cost of these bonds is already built into KC Water’s long-range rate plan. Voting NO would not lower your bill; because the projects still have to be done, it would force more expensive borrowing and push rates up faster.' },
        { q: 'What exactly does the $750 million pay for?', a: 'Rehabilitating, expanding, and improving the drinking-water system: replacing aging water mains, upgrading the treatment plant, and improving pumping and distribution, plus acquiring any land and rights of way needed to keep the system running and compliant with federal and state rules.' },
        { q: 'Is this the same as the sewer question?', a: 'No. Question 4 is the drinking-water (waterworks) bond. Question 5 is a separate $750 million sanitary-sewer revenue bond tied to the federal Clean Water Act sewer cleanup. They are two different systems and two different votes.' },
        { q: 'What happens if Question 4 fails?', a: 'The aging infrastructure still has to be replaced to keep water safe and reliable and to meet federal and state rules. Without the low-cost revenue bonds, KC Water would have to use more expensive financing with higher interest rates, meaning bigger water-rate increases for the same projects.' },
        { q: 'How many votes does it need to pass?', a: 'A simple majority. Unlike the general-obligation bond questions for housing and civic buildings, this revenue-bond question does not require a four-sevenths supermajority.' },
      ],
      relatedLinks: [
        { label: 'KCEB August 4, 2026 sample ballots', url: 'https://kceb.org/elections/ballot/' },
        { label: 'KC Water drinking-water system overview', url: 'https://www.kcwater.us/about-us/water/' },
        { label: 'The Beacon August 2026 ballot guide', url: 'https://thebeaconnews.org/stories/2026/05/21/kansas-city-ballot-questions-august-2026/' },
        { label: 'KCUR August 2026 ballot guide', url: 'https://www.kcur.org/politics-elections-and-government/2026-05-26/kansas-city-is-asking-voters-to-pass-5-bond-and-tax-measures-in-augusts-election-heres-a-guide' },
      ],
      sources: [
        { title: 'Kansas City Election Board, August 4, 2026 sample ballot (Issues Only PDF, Question 4 verbatim)', url: 'https://kceb.org/elections/ballot/' },
        { title: 'The Beacon: Your guide to the August 2026 Kansas City ballot questions', url: 'https://thebeaconnews.org/stories/2026/05/21/kansas-city-ballot-questions-august-2026/' },
        { title: "KCUR: Kansas City is asking voters to pass 5 bond and tax measures in August's election", url: 'https://www.kcur.org/politics-elections-and-government/2026-05-26/kansas-city-is-asking-voters-to-pass-5-bond-and-tax-measures-in-augusts-election-heres-a-guide' },
        { title: 'KSHB 41: Kansas City, Missouri, adds 5 measures to August ballot', url: 'https://www.kshb.com/news/local-news/missouri/kansas-city/kansas-city-missouri-adds-5-measures-to-august-ballot' },
        { title: 'KCTV5: $1.7 billion question - Kansas City voters to weigh in on infrastructure, housing and more', url: 'https://www.kctv5.com/2026/05/22/17-billion-question-kansas-city-voters-weigh-infrastructure-housing-more/' },
        { title: 'KC Water: Water (drinking-water system facts)', url: 'https://www.kcwater.us/about-us/water/' },
        { title: 'KC Water: Sewer Bond Authorization (prior 2022 $750M authorization context)', url: 'https://www.kcwater.us/about-us/sewer-bond-authorization/' },
      ],
      yesCta: 'Vote YES on Clean Water',
    },
    {
      slug: 'sewers',
      name: 'Sewers',
      eyebrow: 'Sewers',
      motif: 'sewers',
      title: '$750 million to clean up our rivers and fix the sewers',
      cardPunch: 'Keep raw sewage out of our rivers.',
      cardSub:
        'Fund the federal Clean Water Act cleanup with revenue bonds, repaid through sewer fees, not property taxes.',
      amount: '$750,000,000',
      bigStat: { target: 750, decimals: 0, prefix: '$', suffix: 'M', display: '', label: 'in sewer bonds' },
      accent: {
        name: 'Navy',
        swatch: '#1e3a5f',
        gradient: 'from-navy via-navy to-sky',
        gradientHero: 'from-navy via-navy to-sky',
        glow: 'rgba(30,58,95,0.5)',
      },
      costChip: 'No new tax',
      costFraming:
        'Revenue bond repaid from utility fees, not property taxes. Distinct from the housing and civic-building questions (general obligation bonds backed by the property-tax levy) and from the Central City question (a sales-tax renewal).',
      mechanism:
        'Sanitary sewer revenue bonds. By the ballot’s own words, principal and interest are payable solely from the revenues derived by the City from the operation of its sanitary sewer system, meaning the sewer fees KC Water already collects. No property-tax pledge and no general-fund pledge.',
      honestCost:
        'No new tax and no property-tax increase. These are revenue bonds, and the ballot itself says they are payable solely from sewer system revenues, meaning the sewer fees KC Water already bills. That is the honest part: it is not a promise that your sewer bill will never rise. Sewer rates are set separately each year and have been climbing for over a decade to pay for the federally required cleanup. What a YES does is lock in the cheapest available financing for work the city is legally ordered to do. City staff say the cost of these bonds is already baked into current rates, and that rejecting them would force more expensive borrowing that drives rates up faster.',
      voteThreshold: 'Simple majority',
      officialQuestion: {
        number: 'Question 5',
        text: 'Shall the City of Kansas City, Missouri issue sanitary sewer revenue bonds in the principal amount of $750,000,000.00 for the purpose of rehabilitating, expanding and improving the City’s sanitary sewer system, including acquiring necessary land and rights of way, in order to provide for its continuing operation and to maintain compliance with federal, state and judicial requirements, with the principal of and interest on said revenue bonds to be payable solely from the revenues derived by the City from the operation of its sanitary sewer system, including all future rehabilitations, improvements and expansions thereto?',
      },
      heroStats: [
        { value: '$750M', label: 'Sanitary sewer revenue bonds on the ballot' },
        { value: '85%', label: 'Wet-weather sewage capture required by 2040' },
        { value: '$2.3B', label: 'Total court-ordered Smart Sewer cleanup' },
        { value: '$0', label: 'New taxes (repaid from sewer fees)' },
      ],
      narrative: {
        problem:
          'When heavy rain hits Kansas City, the aging sewer system overflows and pushes raw, untreated sewage into local creeks, streams, and rivers. The pollution was severe enough that the U.S. EPA and Department of Justice took the city to federal court under the Clean Water Act. The 2010 settlement documented billions of gallons of combined sewer overflow reaching area waterways and around one hundred million gallons of separate sanitary sewer overflow that had to be eliminated entirely. This is a public-health and clean-water problem the city is legally bound to fix.',
        whatItDoes:
          'Question 5 authorizes the City to issue up to $750 million in sanitary sewer revenue bonds to keep the court-ordered Smart Sewer cleanup moving: rebuilding aging pipes, pump stations, and treatment plants and building green infrastructure that keeps stormwater out of the sewers. The ballot language is explicit that the bonds are paid back only from sewer system revenues, so there is no property-tax pledge behind them.',
        whyItMatters:
          'The cleanup is not optional. A federal consent decree, amended over the years and now anchored by a 2040 deadline, requires Kansas City to capture 85 percent of wet-weather sewage flows. The work will get done either way. The only real question is how it is financed. Revenue bonds carry lower interest rates than the alternatives, and KC Water says the cost of this debt is already built into current rates. Voting the bonds down would not erase the federal obligation; it would force the city into pricier borrowing that pushes sewer rates up faster.',
        whatYourYesDoes:
          'A YES on Question 5 lets Kansas City keep paying for the federally mandated sewer cleanup with the lowest-cost financing available. It protects the Blue River, Brush Creek, and the other waterways that overflows pollute, keeps the city in compliance with its federal consent decree, and holds future sewer-rate increases down compared to rejecting the bonds. It adds no new tax and does not touch your property-tax rate.',
      },
      keyFacts: [
        'Appears on the August 4, 2026 Kansas City ballot as Question 5, authorizing up to $750,000,000 in sanitary sewer revenue bonds.',
        'Repaid solely from sewer system revenues (the sewer fees KC Water already collects). The ballot pledges no property tax and no general-fund money.',
        'Funds the court-ordered Smart Sewer program required by a 2010 federal Clean Water Act consent decree to reduce raw-sewage overflows into local creeks, streams, and rivers.',
        'The consent decree requires the city to capture 85 percent of wet-weather sewage flows in a typical year by a final deadline of 2040.',
        'The total remaining Smart Sewer program is now estimated at about $2.3 billion, reduced from an initial estimate of roughly $4.5 billion as the decree was renegotiated.',
        "Kansas City's wastewater system spans roughly 320 square miles and includes 6 wastewater treatment plants, about 40 pumping stations, and more than 2,800 miles of sewer lines, one of the largest systems in the country by area.",
        'This is the latest in a series of authorizations: voters approved $500 million in sewer bonds in 2012 (since exhausted) and another $750 million in April 2022. Question 5 renews that financing capacity.',
        'City staff say revenue bonds are the lowest-cost way to borrow for this mandated work, and the council committed to structuring the issuance to minimize the effect on ratepayers.',
        'Voters approved the prior $750 million wastewater revenue bond authorization in April 2022 with 79% support.',
      ],
      timeline: [
        { date: '2010', label: 'U.S. EPA and DOJ reach a Clean Water Act settlement with Kansas City; a federal judge enters the consent decree on September 27, 2010, ordering a 25-year overflow-control program then estimated at roughly $4.5 billion.' },
        { date: '2012', label: 'Voters authorize a first $500 million in sanitary sewer revenue bonds to begin the work.' },
        { date: '2021', label: 'The consent decree is amended; the final compliance deadline is extended to 2040 and the program scope and cost are renegotiated downward.' },
        { date: 'April 5, 2022', label: 'Kansas City voters approve $750 million in additional sanitary sewer revenue bonds.' },
        { date: '2024', label: 'The Third Amended Consent Decree sets the target at 85 percent capture of wet-weather flows by 2040 and lowers the total program cost to about $2.3 billion.' },
        { date: 'August 4, 2026', label: 'Question 5 asks voters to authorize another $750 million in sanitary sewer revenue bonds to keep the cleanup financed at the lowest cost.' },
        { date: '2040', label: 'Federal deadline to achieve 85 percent capture of annual wet-weather sewage flows.' },
      ],
      realExamples: [
        'Blue River Wastewater Treatment Plant improvements, a flagship Smart Sewer project to expand treatment capacity and cut overflows.',
        'More than 234 miles of sewer line rehabilitated under the program to date.',
        'About 287 green acres of green infrastructure built so far toward a minimum of 480 green acres planned for the combined-sewer area, capturing stormwater before it overwhelms the pipes.',
        'Wet-weather capture has risen from roughly 45 percent in 2012 toward an interim target near 77 percent by 2035 and the final 85 percent by 2040.',
      ],
      ordinance: 'Ordinance Nos. 260481 and 260482',
      cipBreakdown: {
        heading: 'Projected Wastewater CIP, FY2027 to FY2031',
        fiscalRange: 'FY2027 to FY2031',
        rows: [
          { label: 'Overflow Control Program (OCP)', value: 1273889555 },
          { label: 'Wastewater Treatment Plants', value: 257045679 },
          { label: 'Collection', value: 70350000 },
          { label: 'Pump Station', value: 55285000 },
          { label: 'Facilities', value: 40600000 },
          { label: 'Operations', value: 10000000 },
        ],
        total: 1707170234,
        asking: 750000000,
        note: 'Over $1.7 billion in projected wastewater capital needs over five years, driven by the federal Smart Sewer cleanup. This question authorizes $750 million of it.',
      },
      bondHistory: {
        heading: 'Voters keep saying yes',
        approval: '79% YES, April 2022',
        note: 'Voters authorized $750 million in wastewater revenue bonds in April 2022 with 79% support. This question renews that financing capacity at the lowest available cost.',
        points: [],
      },
      srfApplications: [
        { name: 'Todd Creek Wastewater Treatment Plant', amount: '$100M SRF loan', detail: 'Treatment plant work funded through a State Revolving Fund loan.' },
        { name: 'Blue River WWTP Grit Removal', amount: '$100M SRF loan', detail: 'Grit removal at the Blue River Wastewater Treatment Plant.' },
        { name: 'High Rate Treatment Process', amount: '$200M SRF loan', detail: 'High rate treatment to expand wet-weather capacity.' },
      ],
      srfNote: 'Two issues have already been sold from the prior authorization (series 2023A and 2024A), and three State Revolving Fund applications totaling $400 million will draw on the sewer bond authorization.',
      financingLadder: {
        rungs: [
          { tier: 'Appropriation debt', level: 'Highest cost', note: 'No voter approval needed, but the highest interest rate.' },
          { tier: 'Revenue bonds', level: 'Lower cost', note: 'Lower interest. This is what the question authorizes.' },
          { tier: 'SRF loans', level: 'Lowest cost', note: 'State Revolving Fund loans, the cheapest money available, but limited and competitive.' },
        ],
      },
      completedProjects: null,
      civicProjects: null,
      ccedRevenue: null,
      ccedProjects: null,
      ccedDistrict: null,
      faqs: [
        { q: 'Is the sewer question really not a tax?', a: 'Correct. The ballot language states the bonds are payable solely from the revenues of the sanitary sewer system, meaning the sewer fees KC Water already collects. There is no property-tax pledge and no general-fund pledge. It is not a guarantee that sewer bills stay flat, because rates are set separately by the City, but the bonds themselves add no new tax.' },
        { q: 'What is the Smart Sewer program and why is it required?', a: 'It is Kansas City’s multidecade overflow-control program, mandated by a 2010 federal Clean Water Act consent decree. The system was dumping billions of gallons of untreated sewage into local waterways during storms. The court ordered the city to fix it, and a federal judge oversees the schedule.' },
        { q: 'What does 85 percent by 2040 mean?', a: 'The consent decree requires Kansas City to capture and treat 85 percent of the sewage-and-stormwater flow that the system sees during wet weather in a typical year, with a final deadline of 2040. Capture has climbed from about 45 percent in 2012 as the work has progressed.' },
        { q: 'What happens if Question 5 fails?', a: 'The federal obligation does not go away. The cleanup still has to be finished by 2040. Rejecting the bonds simply forces the city toward more expensive financing with higher interest, which city staff warn would push sewer rates up faster than staying on the revenue-bond path.' },
        { q: 'Will my sewer bill go up because of this?', a: 'This question does not set rates and does not freeze them. Sewer rates have been rising for years to pay for the court-ordered cleanup, and that continues regardless. KC Water says using low-cost revenue bonds keeps those increases as small as possible, and that the cost of this debt is already built into current rates.' },
        { q: 'Have not voters approved sewer bonds before?', a: 'Yes. Voters authorized $500 million in 2012, which has been spent, and $750 million in April 2022. Question 5 renews that financing capacity with another $750 million so the mandated work can keep going without interruption.' },
      ],
      relatedLinks: [
        { label: 'KC Smart Sewer program (official)', url: 'https://www.kcsmartsewer.us/' },
        { label: 'KC Water sewer bond authorization', url: 'https://www.kcwater.us/about-us/sewer-bond-authorization/' },
        { label: 'EPA Kansas City Clean Water Act settlement', url: 'https://www.epa.gov/enforcement/kansas-city-missouri-clean-water-act-settlement' },
        { label: 'Kansas City Election Board sample ballot', url: 'https://kceb.org/elections/ballot/' },
      ],
      sources: [
        { title: 'Kansas City Election Board, August 4, 2026 sample ballot (Issues Only, official Question 5 language)', url: 'https://kceb.org/elections/ballot/' },
        { title: 'KSHB 41: Kansas City, Missouri, adds 5 measures to August ballot', url: 'https://www.kshb.com/news/local-news/missouri/kansas-city/kansas-city-missouri-adds-5-measures-to-august-ballot' },
        { title: "KCUR: Kansas City's August election will have 5 bond and tax measures (voter guide)", url: 'https://www.kcur.org/politics-elections-and-government/2026-05-26/kansas-city-is-asking-voters-to-pass-5-bond-and-tax-measures-in-augusts-election-heres-a-guide' },
        { title: 'The Beacon: Your guide to the August 2026 Kansas City ballot questions', url: 'https://thebeaconnews.org/stories/2026/05/21/kansas-city-ballot-questions-august-2026/' },
        { title: 'U.S. EPA: Kansas City, Missouri Clean Water Act Settlement (2010 consent decree terms)', url: 'https://www.epa.gov/enforcement/kansas-city-missouri-clean-water-act-settlement' },
        { title: 'City of Kansas City: Third Amended Consent Decree (85% capture, 2040, ~$2.3 billion)', url: 'https://www.kcsmartsewer.us/approach/third-amended-consent-decree' },
        { title: 'KC Water: Sewer Bond Authorization', url: 'https://www.kcwater.us/about-us/sewer-bond-authorization/' },
        { title: 'City of Kansas City: Council Places Five Measures on August 4 Ballot', url: 'https://www.kcmo.gov/Home/Components/News/News/3103/16' },
      ],
      yesCta: 'Vote YES on Sewers',
    },
    {
      slug: 'housing',
      name: 'Housing',
      eyebrow: 'Housing',
      motif: 'housing',
      title: '$100 million for affordable homes, with no rate increase',
      cardPunch: 'Build affordable homes across Kansas City.',
      cardSub:
        'Double the City’s annual affordable-housing investment by replacing retiring debt, keeping the property tax rate flat.',
      amount: '$100,000,000',
      bigStat: { target: 100, decimals: 0, prefix: '$', suffix: 'M', display: '', label: 'in housing bonds' },
      accent: {
        name: 'Coral',
        swatch: '#e53935',
        gradient: 'from-coral to-[#8f1815]',
        gradientHero: 'from-coral to-[#8f1815]',
        glow: 'rgba(229,57,53,0.45)',
      },
      costChip: 'No rate increase',
      costFraming:
        'No increase to your property tax RATE. The new bonds replace roughly $200 million in older City debt that is being retired, so the debt-service levy stays level. This is a property-tax-backed GO bond, not a tax-free measure.',
      mechanism:
        'General obligation (GO) bond, up to $100,000,000, backed by the City’s debt-service (tangible) property tax levy. It is structured to replace roughly $200 million in older general-obligation debt that is being paid off, so the debt-service tax RATE stays flat rather than rising. Proceeds flow through the Kansas City Housing Trust Fund. This is a property-tax-backed bond, not a tax-free measure: the ballot language itself authorizes the City to maintain property tax rates sufficient to pay principal and interest on the bonds. Requires a four-sevenths (57.1%) supermajority because it is a GO bond.',
      honestCost:
        'This is a property-tax-backed general obligation bond, not a tax-free measure, and the ballot language says so directly: it authorizes the City to keep property tax rates high enough to pay the bonds off. What stays flat is the RATE. The City can issue these $100 million in bonds without raising the debt-service levy because roughly $200 million in older general-obligation debt is being paid off and these bonds take its place. So the honest framing is: no increase to your property tax RATE, but yes, this is debt repaid by the City’s debt-service property tax, not a cost-free program.',
      voteThreshold: 'Four-sevenths supermajority',
      officialQuestion: {
        number: 'Question 1',
        text: 'Shall the City of Kansas City, Missouri issue its general obligation bonds in an amount not to exceed $100,000,000.00 for the purpose of affordable housing through the rehabilitation, renovation, and construction of houses and buildings, including blight removal, to provide affordable housing for very low- to moderate-income households?\n\nThe authorization of the bonds will authorize the City to maintain tangible property tax rates sufficient to pay the interest and principal on the bonds until fully paid.',
      },
      heroStats: [
        { value: '$100M', label: 'in bonds for affordable homes' },
        { value: '64,000', label: 'unit affordable-housing shortage in KC' },
        { value: '~$20M/yr', label: 'doubles the City’s annual housing investment' },
        { value: '$0', label: 'increase to your property tax rate' },
      ],
      narrative: {
        problem:
          'Kansas City is short an estimated 64,000 affordable homes, a gap concentrated among the very-low-income and extremely-low-income families who can least absorb rising rents. The City’s housing director, Blaine Proctor, put it plainly: the shortage is made up of households at the bottom of the income ladder, the people with the fewest options when a unit is lost or a rent goes up. The Housing Trust Fund that the City built to chip away at this gap is on track to run out: the $50 million voters approved in 2022 has been going out the door at roughly $15 million a year and is projected to be spent by 2027.',
        whatItDoes:
          'Question 1 authorizes the City to issue up to $100 million in general obligation bonds for affordable housing: rehabilitating and renovating existing houses and buildings, building new ones, and clearing blighted property, all to serve very-low- to moderate-income households. The money flows through the Housing Trust Fund, the City’s competitive grant program for affordable housing. With this infusion the Trust Fund could award about $20 million a year through 2032, roughly double its current pace, potentially producing thousands more affordable units.',
        whyItMatters:
          'Without new bonds the Trust Fund effectively goes dark in 2027, just as the shortage is most acute. The bond does not just keep the program alive, it scales it: doubling annual investment is the difference between a few hundred units and several thousand over the life of the program. And it is structured so taxpayers carry no higher rate, because it slots into the space left by about $200 million in older City debt that is being retired.',
        whatYourYesDoes:
          'A YES on Question 1 lets the City sell up to $100 million in housing bonds and roughly double what the Housing Trust Fund can invest each year, while keeping the property tax RATE flat by replacing debt that is being paid off. Because it is a general obligation bond, it needs a four-sevenths supermajority, so turnout and margin both matter.',
      },
      keyFacts: [
        'Officially Question 1 on the Kansas City portion of the August 4, 2026 primary ballot.',
        'Authorizes up to $100,000,000 in general obligation bonds for affordable housing.',
        'Money flows through the Kansas City Housing Trust Fund (established 2018, Ordinance 180719).',
        'Funds rehabilitation, renovation, new construction, and blight removal for very-low- to moderate-income households.',
        'Would roughly double the Trust Fund annual investment to about $20 million a year, sustained through 2032.',
        'Addresses an estimated 64,000-unit affordable-housing shortage cited by the City’s housing department.',
        'Requires a four-sevenths (about 57.1%) supermajority to pass, because it is a GO bond.',
        'Structured to replace roughly $200 million in older debt being retired, so the debt-service tax RATE does not rise.',
        'The Trust Fund was first seeded with $12.5 million in federal pandemic relief in 2021 and a $50 million voter-approved infusion in November 2022.',
        'To date the Trust Fund has awarded more than $61 million and helped fund roughly 3,000 affordable units.',
        'The Housing Trust Fund supports households earning about 60% or less of the area average monthly income.',
        'Completed Trust Fund developments have already delivered 365 affordable units across the city, from Amethyst Place to Forest Hill Village.',
      ],
      timeline: [
        { date: '2018', label: 'Kansas City establishes the Housing Trust Fund (Ordinance 180719)' },
        { date: 'May 2021', label: 'Fund first seeded with $12.5 million in federal pandemic relief' },
        { date: 'Nov 2022', label: 'Voters approve a $50 million infusion to the Trust Fund' },
        { date: '2026', label: 'Trust Fund has awarded more than $61 million, helping fund roughly 3,000 affordable units' },
        { date: '2027', label: 'The 2022 funding is projected to be fully spent' },
        { date: 'Aug 4, 2026', label: 'Voters decide Question 1, the $100 million affordable housing bond' },
        { date: 'Through 2032', label: 'If passed, the Trust Fund could award about $20 million a year, roughly double its current pace' },
      ],
      realExamples: [],
      ordinance: 'Ordinance No. 260484',
      cipBreakdown: null,
      bondHistory: null,
      srfApplications: [],
      srfNote: null,
      financingLadder: null,
      completedProjects: {
        heading: 'What the Housing Trust Fund has already built',
        totalLabel: 'affordable units completed',
        total: 365,
        items: [
          { name: 'Amethyst Place Expansion', address: '2770 Tracy Ave', units: 37 },
          { name: 'Community LINC Housing', address: '4004 Garfield', units: 1 },
          { name: 'Greenwood Senior Apartments', address: '3711 E 27th St', units: 44 },
          { name: 'Forest Hill Village', address: '3500 Prather Rd', units: 18 },
          { name: 'Habitat for Humanity Revitalization Homeownership', address: '4417 E 7th St', units: 1 },
          { name: 'Lykins Neighborhood Trust', address: 'Lykins Neighborhood scatter site', units: 27 },
          { name: 'Palestine Gardens Rehabilitation', address: '33rd St and Prospect Ave', units: 118 },
          { name: "St. Michael's Housing Phase III", address: '3838 Chelsea', units: 55 },
          { name: 'Heroes Home Gate', address: '2005 E 35th St', units: 24 },
          { name: 'Bodhi', address: '3840 Jackson Ave', units: 40 },
        ],
      },
      civicProjects: null,
      ccedRevenue: null,
      ccedProjects: null,
      ccedDistrict: null,
      faqs: [
        { q: 'Will Question 1 raise my taxes?', a: 'It will not raise your property tax RATE. The City can issue these $100 million in bonds while keeping the debt-service levy flat because about $200 million in older debt is being paid off and these bonds replace it. Be clear-eyed though: this is a general obligation bond backed by the property tax, and the ballot language authorizes the City to keep rates high enough to repay it. The rate stays the same; the City is not promising the bonds are free.' },
        { q: 'What is the Housing Trust Fund and how does the money get spent?', a: 'The Housing Trust Fund is the City’s competitive grant program for affordable housing, established in 2018. It awards money to developers through a regular request-for-proposals process to rehab, renovate, build, and clear blight for very-low- to moderate-income households. The $100 million bond would feed this fund, letting it award about $20 million a year through 2032, roughly double its current pace.' },
        { q: 'Why does this need a supermajority?', a: 'Because it is a general obligation bond, Missouri law requires a four-sevenths supermajority, about 57.1 percent, rather than a simple majority. That is a higher bar than a normal yes-or-no question, so both turnout and the margin of victory matter.' },
        { q: 'How big is Kansas City’s housing shortage, really?', a: 'The City’s housing department estimates a 64,000-unit shortage of affordable housing, concentrated among very-low-income and extremely-low-income households. That is the gap this bond is meant to start closing.' },
        { q: 'What happens if it fails?', a: 'The Housing Trust Fund current money, the $50 million voters approved in 2022, is going out at about $15 million a year and is projected to be spent by 2027. Without new bonds, the City’s affordable-housing program effectively stalls just as the shortage is most severe.' },
        { q: 'Has the Trust Fund actually built anything?', a: 'Yes. Since it was first funded in 2021 the Trust Fund has awarded more than $61 million and helped fund roughly 3,000 affordable units across the city. Reported unit counts vary by date and source as projects move from award to completion.' },
      ],
      relatedLinks: [
        { label: 'Kansas City Election Board sample ballot', url: 'https://kceb.org/elections/ballot/' },
        { label: 'City of Kansas City Housing Trust Fund', url: 'https://www.kcmo.gov/city-hall/housing/housing-trust-fund' },
        { label: 'Kansas City ordinance, File #260484', url: 'https://clerk.kcmo.gov/LegislationDetail.aspx?GUID=8EED7EA0-A903-4FE5-845A-84B1A6FCC962&ID=8027543' },
      ],
      sources: [
        { title: 'KCEB August 4, 2026 sample ballot (Issues Only PDF), confirming Question 1 official wording', url: 'https://kceb.org/elections/ballot/' },
        { title: 'City of Kansas City ordinance calling the housing bond election, File #260484', url: 'https://clerk.kcmo.gov/LegislationDetail.aspx?GUID=8EED7EA0-A903-4FE5-845A-84B1A6FCC962&ID=8027543' },
        { title: 'KSHB: Kansas City adds 5 measures to August ballot', url: 'https://www.kshb.com/news/local-news/missouri/kansas-city/kansas-city-missouri-adds-5-measures-to-august-ballot' },
        { title: "KCUR: Kansas City's August election will have 5 bond and tax measures, a guide", url: 'https://www.kcur.org/politics-elections-and-government/2026-05-26/kansas-city-is-asking-voters-to-pass-5-bond-and-tax-measures-in-augusts-election-heres-a-guide' },
        { title: 'The Beacon: Your guide to the August 2026 Kansas City ballot questions', url: 'https://thebeaconnews.org/stories/2026/05/21/kansas-city-ballot-questions-august-2026/' },
        { title: 'City of Kansas City: Affordable Housing Trust Fund', url: 'https://www.kcmo.gov/city-hall/housing/housing-trust-fund' },
        { title: 'KCUR: Kansas City got $50 million for its Housing Trust Fund, how did it spend the money', url: 'https://www.kcur.org/housing-development-section/2023-11-27/kansas-city-got-50-million-for-its-housing-trust-fund-how-did-it-spend-the-money-this-year' },
      ],
      yesCta: 'Vote YES on Housing',
    },
    {
      slug: 'civic-buildings',
      name: 'Civic Buildings',
      eyebrow: 'Civic Buildings',
      motif: 'civic-buildings',
      title: 'Civic Buildings: $100 Million to Repair the Convention Center and City Hall',
      cardPunch: 'Repair Bartle Hall, City Hall, and more.',
      cardSub:
        'Fix aging civic buildings by replacing retiring debt, with no projected property tax rate increase.',
      amount: '$100,000,000',
      bigStat: { target: 100, decimals: 0, prefix: '$', suffix: 'M', display: '', label: 'in repair bonds' },
      accent: {
        name: 'Golden',
        swatch: '#f5a623',
        gradient: 'from-coral via-coral to-golden',
        gradientHero: 'from-coral via-coral to-golden',
        glow: 'rgba(245,166,35,0.45)',
      },
      costChip: 'No rate increase',
      costFraming:
        'GO bond repaid from the existing debt-service property tax levy; projected to keep the property tax RATE flat by replacing retiring debt, NOT tax-free.',
      mechanism:
        'General obligation (GO) bonds, not to exceed $100 million, repaid from the City’s existing debt-service (tangible property) tax levy. The bonds are timed to replace roughly $200 million of older GO debt (this question plus the housing question) that is being fully paid off, so the City projects no increase in the property tax rate. This is not a tax-free measure: the ballot expressly authorizes the City to maintain property tax rates sufficient to repay principal and interest until the bonds are paid in full.',
      honestCost:
        'This is a general obligation bond backed by the City’s existing debt-service property tax levy, so it is not tax-free, and the ballot says so plainly: it authorizes the City to maintain property tax rates sufficient to pay the bonds until they are fully paid. The reason there is no projected rate increase is timing. The City plans to issue this $100 million (together with the $100 million housing bond) as roughly $200 million of older general obligation debt is being completely paid off, so the overall debt-service rate is projected to stay flat. You keep paying the rate you already pay rather than a higher one. The catch worth stating honestly: the ballot authorizes, but does not cap or prohibit, the levy needed to repay the bonds, and the $25 million planned for City Hall is only about half of the roughly $51 million in repairs staff have already identified there.',
      voteThreshold: 'Four-sevenths supermajority',
      officialQuestion: {
        number: 'Question 2',
        text: 'Shall the City of Kansas City, Missouri, issue its general obligation bonds in an amount not to exceed $100,000,000.00 for the purpose of paying for the acquisition, construction, renovation, improvement, equipping, and furnishing of City convention facilities and building facilities constructed before 1950 that are used primarily for governmental administration, convention, or public assembly?\n\nThe authorization of the bonds will authorize the City to maintain tangible property tax rates sufficient to pay the interest and principal on the bonds until fully paid.',
      },
      heroStats: [
        { value: '$100M', label: 'In general obligation bonds for civic buildings' },
        { value: '$75M / $25M', label: 'Convention center repairs / City Hall repairs' },
        { value: '1937', label: 'The year City Hall opened, now nearly 90 years old' },
        { value: '4/7', label: 'Supermajority of YES votes needed to pass' },
      ],
      narrative: {
        problem:
          "Kansas City's signature public buildings are wearing out. Bartle Hall and the Municipal Auditorium make up the convention center that competes for the events, visitors, and spending that flow into the local economy, and City Hall, which opened in 1937, still houses core city government nearly 90 years later. Their heating and cooling, electrical, plumbing, and building systems are aging out. City staff have identified roughly $51 million in repair needs at City Hall alone, far more than this measure can cover, including HVAC for floors 1 through 15, about $10 million in water piping, fire alarm and intercom replacement, exterior window replacement, and waterproofing of the building envelope.",
        whatItDoes:
          'Question 2 authorizes the City to issue up to $100 million in general obligation bonds to acquire, renovate, improve, equip, and furnish City convention facilities and pre-1950 government buildings used for administration, convention, or public assembly. City staff plan to direct about $75 million to the convention center and about $25 million to City Hall. Within the convention center share, roughly $49 million is planned for architectural projects, $23 million for mechanical projects such as a new heating and air conditioning system, and $3 million for electrical projects such as conference center lighting. The City is partnering with the design firm Populous on the convention center work.',
        whyItMatters:
          'The City’s convention and entertainment facilities director, Kimiko Gilmore, calls these core infrastructure investments, not cosmetic projects, that directly affect the City’s ability to operate its buildings safely, efficiently, and competitively. A convention center that cannot reliably heat, cool, and power its halls loses bookings to other cities, and those lost events mean lost hotel stays, restaurant tabs, and jobs. City Hall is where residents do business with their government every day. Letting these buildings decline costs more to fix later.',
        whatYourYesDoes:
          'A YES vote authorizes the $100 million in repair bonds and lets the City keep its debt-service property tax rate flat by timing the new borrowing to replace older debt that is being paid off. Because this is a general obligation bond on a primary election ballot, it needs a four-sevenths supermajority, about 57.1 percent, so every YES vote counts toward that higher bar.',
      },
      keyFacts: [
        'Official ballot designation: Question 2 on the City of Kansas City portion of the August 4, 2026 primary ballot.',
        'Authorizes up to $100,000,000 in general obligation bonds for City convention facilities and pre-1950 government buildings used for administration, convention, or public assembly.',
        'City staff plan roughly $75 million for the convention center (Bartle Hall and the Municipal Auditorium) and roughly $25 million for City Hall.',
        'Convention center share breaks down to about $49 million architectural, $23 million mechanical (new HVAC), and $3 million electrical (such as conference center lighting).',
        'City staff have identified about $51 million in repair needs at City Hall, more than the $25 million this measure would provide; Assistant City Manager Tammy Queen said the City has far more needs than $25 million would support.',
        "The Municipal Auditorium and Music Hall opened in 1935 and City Hall opened in 1937; both fall under the ballot's 'constructed before 1950' language.",
        'Requires a four-sevenths supermajority (about 57.1 percent) to pass because it is a general obligation bond at a primary election.',
        'Combined with the housing bond (Question 1), the City says about $200 million in new bonds replaces about $200 million in debt being fully paid off, so no property tax rate increase is projected.',
        'The bonds still require subsequent City Council approval to actually issue as specific projects move forward.',
        'The City is partnering with the design firm Populous on the convention center renovations.',
      ],
      // Real, sourced dates. Per the design spec the detail page may choose to
      // omit this rail for civic-buildings; the data stays here as source of truth.
      timeline: [
        { date: '1935', label: 'Municipal Auditorium and Music Hall open' },
        { date: '1937', label: "Kansas City's City Hall opens" },
        { date: 'May 2026', label: 'City Council votes to place five measures, including the civic facilities bond, on the August ballot' },
        { date: 'August 4, 2026', label: 'Primary election; voters decide Question 2 (needs four-sevenths to pass)' },
      ],
      realExamples: [
        'A new heating and air conditioning system for the convention center, part of the $23 million mechanical share',
        'Conference center lighting and other electrical upgrades, part of the $3 million electrical share',
        'City Hall HVAC for floors 1 through 15, about $10 million in water piping, fire alarm and intercom replacement, exterior window replacement, and building envelope waterproofing',
      ],
      ordinance: 'Ordinance No. 260483',
      cipBreakdown: null,
      bondHistory: null,
      srfApplications: [],
      srfNote: null,
      financingLadder: null,
      completedProjects: null,
      civicProjects: {
        heading: 'Planned projects from the City Manager',
        note: 'A sample of the specific projects the City Manager office has identified for the $100 million authorization. These project line items sit alongside the broader architectural, mechanical, and electrical split described above for the convention center.',
        costed: [
          { name: 'Municipal Auditorium Improvements', amountM: 36 },
          { name: 'Convention Facilities HVAC Replacement', amountM: 20.8 },
          { name: 'Conference Center Lighting Replacement', amountM: 3 },
        ],
        cityHall: ['Window replacement', 'Fire alarm and intercom improvements', 'HVAC Phase 2', 'Water piping infrastructure'],
      },
      ccedRevenue: null,
      ccedProjects: null,
      ccedDistrict: null,
      faqs: [
        { q: 'What exactly does Question 2 pay for?', a: 'Repairs and renovations to the City’s convention facilities and its older government buildings. City staff plan about $75 million for the convention center, Bartle Hall and the Municipal Auditorium, and about $25 million for City Hall. The convention center money is slated for roughly $49 million in architectural work, $23 million in mechanical work like a new heating and air conditioning system, and $3 million in electrical work such as conference center lighting.' },
        { q: 'Will this raise my taxes?', a: 'The City does not project a property tax rate increase. This is a general obligation bond backed by the existing debt-service property tax levy, and it is timed to replace older debt that is being paid off. Combined with the housing bond, staff say about $200 million in new bonds replaces about $200 million in retiring debt, so the rate stays flat. It is not tax-free, though: the ballot authorizes the City to maintain the levy needed to repay the bonds.' },
        { q: 'Why does it need a supermajority?', a: 'Because it is a general obligation bond on a primary election ballot, it requires a four-sevenths supermajority, about 57.1 percent, rather than a simple majority. That higher threshold is exactly why turnout matters; every YES vote counts toward reaching it.' },
        { q: 'How old are these buildings?', a: 'The Municipal Auditorium and Music Hall opened in 1935 and City Hall opened in 1937, making City Hall nearly 90 years old. The ballot covers government and convention buildings constructed before 1950, whose heating, cooling, electrical, and plumbing systems are wearing out.' },
        { q: 'Is $100 million enough to fix everything?', a: 'No, and city officials say so. Staff have identified about $51 million in needs at City Hall alone, while the plan directs only about $25 million there. Assistant City Manager Tammy Queen said the City has far more needs than $25 million would support. This measure addresses the most pressing core infrastructure, not every repair.' },
        { q: 'Does approval mean the bonds are issued right away?', a: 'No. A YES vote authorizes the City to issue up to $100 million in bonds. The bonds still require subsequent City Council approval to actually be issued as specific projects move forward.' },
      ],
      relatedLinks: [
        { label: 'Kansas City Election Board sample ballots and voter info', url: 'https://kceb.org/elections/ballot/' },
        { label: 'City of Kansas City official ballot measures announcement', url: 'https://www.kcmo.gov/Home/Components/News/News/3103/16' },
        { label: 'The Beacon nonpartisan ballot guide', url: 'https://thebeaconnews.org/stories/2026/05/21/kansas-city-ballot-questions-august-2026/' },
        { label: 'KCUR nonpartisan voter guide', url: 'https://www.kcur.org/politics-elections-and-government/2026-05-26/kansas-city-is-asking-voters-to-pass-5-bond-and-tax-measures-in-augusts-election-heres-a-guide' },
      ],
      sources: [
        { title: 'Kansas City Election Board sample ballot (Issues Only), August 4, 2026 primary', url: 'https://kceb.org/elections/ballot/' },
        { title: 'KSHB 41: Kansas City, Missouri, adds 5 measures to August ballot', url: 'https://www.kshb.com/news/local-news/missouri/kansas-city/kansas-city-missouri-adds-5-measures-to-august-ballot' },
        { title: 'The Beacon: Your guide to the August 2026 Kansas City ballot questions', url: 'https://thebeaconnews.org/stories/2026/05/21/kansas-city-ballot-questions-august-2026/' },
        { title: "KCUR: Kansas City's August election will have 5 bond and tax measures", url: 'https://www.kcur.org/politics-elections-and-government/2026-05-26/kansas-city-is-asking-voters-to-pass-5-bond-and-tax-measures-in-augusts-election-heres-a-guide' },
        { title: 'City of Kansas City: City Council Places Five Measures on August 4 Ballot', url: 'https://www.kcmo.gov/Home/Components/News/News/3103/16' },
        { title: 'KCTV5: $1.7 billion question: Kansas City voters to weigh in on infrastructure, housing and more', url: 'https://www.kctv5.com/2026/05/22/17-billion-question-kansas-city-voters-weigh-infrastructure-housing-more/' },
      ],
      yesCta: 'Vote YES on Civic Buildings',
    },
    {
      slug: 'central-city',
      name: 'Central City',
      eyebrow: 'Central City',
      motif: 'central-city',
      title: 'Central City Economic Development Sales Tax Renewal',
      cardPunch: 'Keep investing in the East Side.',
      cardSub:
        'Continue the one-eighth-cent sales tax that funds economic development on the East Side, at the same rate.',
      amount: '1/8-cent sales tax, renewed for 10 years (roughly $10 million per year)',
      bigStat: { target: 0, decimals: 0, prefix: '', suffix: '', display: '1/8¢', label: 'renewed 10 years' },
      accent: {
        name: 'Sunrise',
        swatch: '#d2561e',
        gradient: 'from-sky to-coral',
        gradientHero: 'from-sky to-coral',
        glow: 'rgba(229,57,53,0.4)',
      },
      costChip: 'Same rate, renewed',
      costFraming:
        'Renews an existing 1/8-cent sales tax at the same rate. No new tax, no rate increase; if rejected it expires September 30, 2027.',
      mechanism:
        'Renewal of an existing 1/8-percent (one-eighth-cent) local sales tax authorized under Section 67.1305 of the Revised Statutes of Missouri. It is collected on retail sales within the Central City district and pooled into a dedicated economic-development fund. It is not a bond and not a property tax. A Central City Economic Development (CCED) Sales Tax Board reviews developer applications and recommends projects to the City Council; as of September 2025 the program is administered by the Economic Development Corporation of Kansas City (EDCKC). The ballot language also allows proceeds to retire debt on previously authorized bonds or to repay bonds not yet issued.',
      honestCost:
        'This is a renewal of an existing tax, not a new one. The one-eighth-cent (1/8%) sales tax has been collected inside the Central City district since 2017. A YES vote keeps that rate exactly the same for 10 more years, so shoppers see no increase at the register. It is not a no-tax measure: if voters reject it, the levy simply expires after September 30, 2027, and the dedicated East Side development fund goes away. Unlike the water and sewer questions on the same ballot, this is a sales tax, not a bond, so it is not repaid from utility fees or property taxes.',
      voteThreshold: 'Simple majority',
      officialQuestion: {
        number: 'Question 3',
        text: 'Shall the City of Kansas City be authorized to renew a sales tax authorized by Section 67.1305 of the Revised Statutes of Missouri for a period of 10 years at a rate of 1/8% to be used for funding economic development projects within the area bounded by 9th Street on the north; Gregory Boulevard on the south; The Paseo on the west; and Indiana Avenue on the east, which may include the retirement of debt under previously authorized bonded indebtedness or to repay bonds not yet issued? This sales tax would continue the existing sales tax authorized by Section 67.1305 of the Revised Statutes of Missouri and scheduled to expire on September 30, 2027.',
      },
      heroStats: [
        { value: '1/8¢', label: 'Sales-tax rate, unchanged' },
        { value: '$88M+', label: 'Invested on the East Side since 2017' },
        { value: '58', label: 'Projects funded so far' },
        { value: '~$10M', label: 'Generated for the district each year' },
      ],
      narrative: {
        problem:
          "For generations, Kansas City's East Side was left out of the development boom that reshaped downtown, the Plaza, and the suburbs. Banks and private capital routinely passed it by, so good projects stalled for lack of that last piece of financing. In 2017 voters created a dedicated tool to change that: a one-eighth-cent sales tax that pools local dollars to fund economic development inside a defined Central City district. That authorization is now scheduled to expire on September 30, 2027.",
        whatItDoes:
          'Question 3 renews the existing one-eighth-cent (1/8%) Central City Economic Development sales tax for another 10 years, at the same rate, under Section 67.1305 of the Revised Statutes of Missouri. The money funds economic-development projects inside the district bounded by 9th Street on the north, Gregory Boulevard on the south, The Paseo on the west, and Indiana Avenue on the east. A citizen CCED Sales Tax Board reviews developer applications and recommends projects to the City Council, with the program now administered by the Economic Development Corporation of Kansas City for tighter oversight and steadier funding rounds.',
        whyItMatters:
          "This is the primary dedicated funding stream for reinvestment in Kansas City's historically disinvested urban core. Since 2017 it has put more than $88 million into 58 projects and generates roughly $10 million a year, financing jobs, small and locally owned businesses, early-childhood facilities, housing, and neighborhood revitalization that private capital alone has not delivered. If the renewal fails, the tax simply expires after September 30, 2027, and the East Side loses its only sales-tax-funded development engine.",
        whatYourYesDoes:
          'A YES vote keeps the sales tax exactly where it is, at the same one-eighth-cent rate, for 10 more years. Shoppers see no increase, because this renews a tax that is already in place rather than creating a new one. It keeps roughly $10 million a year flowing into East Side jobs, businesses, and neighborhoods instead of letting the program lapse in 2027.',
      },
      keyFacts: [
        'Renews an existing one-eighth-cent (1/8%) sales tax under Section 67.1305 RSMo for a 10-year term. It is not a new tax and not a rate increase.',
        'Kansas City voters first approved the tax in 2017.',
        'The district is bounded by 9th Street (north), Gregory Boulevard (south), The Paseo (west), and Indiana Avenue (east), on the city’s East Side.',
        'The current authorization is scheduled to expire September 30, 2027, if voters do not renew it.',
        'The tax generates roughly $10 million per year and is projected to total about $100 million by September 2026.',
        'The City reports more than $88 million directed into 58 projects since 2017 (earlier 2025 reporting cited about $60 million across roughly 60 projects, before the most recent rounds).',
        'A citizen CCED Sales Tax Board reviews developer applications and recommends projects to the City Council; as of September 2025 the program is administered by the Economic Development Corporation of Kansas City (EDCKC).',
        'On the August 4, 2026 City of Kansas City ballot this is Question 3. As a sales-tax renewal it requires a simple majority to pass.',
        'First authorized by Ordinance 160861, approved by Kansas City voters on April 4, 2017 with 60% support.',
      ],
      timeline: [
        { date: '2017', label: 'Kansas City voters approve the one-eighth-cent Central City Economic Development sales tax' },
        { date: '2017 to 2026', label: 'More than $88 million directed into 58 East Side projects' },
        { date: 'September 2025', label: 'CCED administration transitions to the Economic Development Corporation of Kansas City (EDCKC)' },
        { date: 'May 2026', label: 'City Council places the 10-year renewal on the August 4 ballot' },
        { date: 'August 4, 2026', label: 'Voters decide the renewal (Question 3)' },
        { date: 'September 30, 2027', label: 'Current authorization expires if the renewal does not pass' },
      ],
      realExamples: [],
      ordinance: 'Ordinance No. 260485 (renewal of Ordinance 160861)',
      cipBreakdown: null,
      bondHistory: null,
      srfApplications: [],
      srfNote: null,
      financingLadder: null,
      completedProjects: null,
      civicProjects: null,
      ccedRevenue: {
        heading: 'CCED sales tax revenue, by fiscal year',
        note: 'The tax has collected nearly $99 million in sales tax revenue since 2018 and is on track to total about $100 million by September 2026. More than $88 million of that has been directed into 58 East Side projects.',
        total: 98960087,
        points: [
          { label: '2018', value: 4148631 },
          { label: '2019', value: 10513302 },
          { label: '2020', value: 10720388 },
          { label: '2021', value: 9353764 },
          { label: '2022', value: 11382152 },
          { label: '2023', value: 12856564 },
          { label: '2024', value: 13012988 },
          { label: '2025', value: 13411970 },
          { label: '2026', value: 13560328 },
        ],
      },
      ccedProjects: {
        heading: 'What CCED is funding on the East Side',
        items: [
          { name: 'Linwood Shopping Square', summary: 'Renovation of a retail shopping center' },
          { name: 'MACPEN Enterprise', summary: 'Construction of the Kiddie Depot child care center with services' },
          { name: 'Community Builders of Kansas City', summary: 'Renovation for entrepreneur space at 5008 Prospect' },
          { name: 'Emmanuel Family and Child Development', summary: 'Construction of a child care center with services' },
          { name: 'Neighborhoods United', summary: 'Rehabilitation of homes for disabled veterans' },
          { name: 'Urban America Southpointe', summary: 'Pre-development for a housing project at 63rd and Prospect' },
          { name: 'Urban Neighborhood Initiative', summary: 'Site work and infrastructure for 30 single-family homes with Habitat for Humanity' },
          { name: 'One Nine Vine', summary: '80 new units (30 one-bedroom, 50 two-bedroom, 14 affordable) and a 138-space parking garage' },
          { name: 'The Overlook District', summary: 'Site infrastructure for a future 11-acre office and mixed-use development' },
          { name: 'Jazz Hill Apartments', summary: 'Rehabilitation of 197 affordable units' },
          { name: 'Zhou B Arts', summary: 'A vacant 5-story blighted building renovated into galleries, studios, an artist community, and event space with an outdoor garden' },
          { name: "Neyan's Place", summary: 'Renovation of 6 affordable units' },
        ],
      },
      ccedDistrict: { north: '9th Street', south: 'Gregory Boulevard', west: 'The Paseo', east: 'Indiana Avenue' },
      faqs: [
        { q: 'Is this a new tax or a tax increase?', a: 'Neither. Question 3 renews the one-eighth-cent (1/8%) sales tax that has already been collected in the Central City district since 2017. The rate does not change, so shoppers see no increase. It is a renewal, not a new tax.' },
        { q: 'What happens if it fails?', a: 'The tax expires after September 30, 2027. That removes roughly $10 million a year, the East Side’s primary dedicated economic-development funding stream, with no replacement in place.' },
        { q: 'Where does the tax apply, and who pays it?', a: 'It is a sales tax collected on purchases within a defined Central City district on the East Side, bounded by 9th Street on the north, Gregory Boulevard on the south, The Paseo on the west, and Indiana Avenue on the east. Anyone shopping inside that district pays the one-eighth-cent rate.' },
        { q: 'What has the tax actually paid for?', a: 'The City reports more than $88 million directed into 58 projects since 2017. Examples include KD Academy, a 24-hour early-learning facility on Prospect Avenue, and One Nine Vine, a mixed-use development bringing 80 new residential units and a 138-space parking garage. Developers have said projects like these likely would not have happened without the CCED boost.' },
        { q: 'Who decides which projects get funded?', a: 'A citizen Central City Economic Development (CCED) Sales Tax Board reviews and analyzes developer applications and recommends projects to the City Council, which makes the final call. As of September 2025 the program is administered by the Economic Development Corporation of Kansas City (EDCKC), a change city leaders made to strengthen oversight and deliver more predictable funding rounds after earlier criticism that the program moved slowly.' },
        { q: 'How long does the renewal last?', a: 'Ten years. If approved, the renewed tax picks up when the current authorization expires on September 30, 2027, and runs for another decade.' },
      ],
      relatedLinks: [
        { label: 'EDCKC: Central City Economic Development (CCED) Sales Tax District', url: 'https://edckc.com/what-we-do/land-development/cced/' },
        { label: 'City of Kansas City: CCED Sales Tax District', url: 'https://www.kcmo.gov/programs-initiatives/cced' },
        { label: 'City of Kansas City: CCED Governance', url: 'https://www.kcmo.gov/programs-initiatives/central-city-economic-development-cced-sales-tax-district/cced-governance' },
        { label: 'Kansas City Election Board: Sample Ballots', url: 'https://kceb.org/elections/ballot/' },
      ],
      sources: [
        { title: 'Kansas City Election Board, August 4, 2026 Issues-Only Sample Ballot (official Question 3 language)', url: 'https://kceb.org/elections/ballot/' },
        { title: 'City of Kansas City: Council Places Five Measures on August 4 Ballot (official news release, $88M/58 projects)', url: 'https://www.kcmo.gov/Home/Components/News/News/3103/16' },
        { title: "KCUR: Kansas City is asking voters to pass 5 bond and tax measures in August's election, here's a guide", url: 'https://www.kcur.org/politics-elections-and-government/2026-05-26/kansas-city-is-asking-voters-to-pass-5-bond-and-tax-measures-in-augusts-election-heres-a-guide' },
        { title: 'The Beacon: Your guide to the August 2026 Kansas City ballot questions', url: 'https://thebeaconnews.org/stories/2026/05/21/kansas-city-ballot-questions-august-2026/' },
        { title: 'KSHB 41: Kansas City, Missouri, adds 5 measures to August ballot', url: 'https://www.kshb.com/news/local-news/missouri/kansas-city/kansas-city-missouri-adds-5-measures-to-august-ballot' },
        { title: 'Startland News: Lesser-known sales tax faces pivotal 2026 vote', url: 'https://www.startlandnews.com/2025/12/kansas-city-cced-vote/' },
        { title: 'EDCKC: Central City Economic Development (CCED) Sales Tax District', url: 'https://edckc.com/what-we-do/land-development/cced/' },
        { title: 'The Community Voice: KC East Side Sales Tax Fund Shift Announced (EDCKC transition)', url: 'https://www.communityvoiceks.com/2025/09/25/cced-sales-tax-program-edckc-transition/' },
      ],
      yesCta: 'Vote YES on Central City',
    },
  ],
} as const;
