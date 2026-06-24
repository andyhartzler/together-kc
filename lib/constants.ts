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
  { href: '/', label: 'Home' },
  { href: '/vote', label: 'Find Your Polling Place' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/endorsements', label: 'Endorsements' },
  { href: '/donate', label: 'Donate' },
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
// bonds into "tax-free." Question numbering is intentionally omitted because
// the official KCEB ballot order is not yet confirmed.
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
        'Bartle Hall, Municipal Auditorium, and City Hall are core civic assets, and their heating, electrical, and building systems are wearing out. The convention center competes for events that bring visitors and spending into Kansas City, and City Hall, opened in 1936, houses core city government. This question authorizes up to $100 million in bonds, with city staff planning roughly $75 million for the convention center and $25 million for City Hall. It is a general obligation bond, but it is timed to replace retiring debt, so no property tax rate increase is expected. City staff describe these as core infrastructure repairs, not cosmetic upgrades.',
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
        'Five Kansas City measures placed on the ballot by the City Council, together worth roughly $1.7 billion: a $750 million drinking-water revenue bond, a $750 million sanitary-sewer revenue bond, a $100 million affordable-housing bond, a $100 million civic-facilities bond for the convention center and City Hall, and a 10-year renewal of the one-eighth-cent Central City Economic Development sales tax.',
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
    { label: 'E-Tax Victory', href: '/victory' },
    { label: 'Home', href: '/home' },
    { label: 'Endorsements', href: '/endorsements' },
    { label: 'FAQs', href: '/faqs' },
  ],
} as const;
