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

export const SITE_CONFIG = {
  title: 'Renew the KC Earnings Tax | Vote YES on April 7, 2026',
  description: 'The earnings tax funds nearly half the cost of city services: first responders, street repair, trash pickup, and more. Vote YES to renew the e-tax on or before April 7, 2026.',
  url: 'https://together-kc.com',
  organization: 'Together KC',
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
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
    { name: 'Greater KC AFL-CIO', fullName: 'Greater Kansas City AFL-CIO', logo: '/images/endorsers/Greater Kansas City AFL-CIO.png', website: 'https://www.kcaflcio.org/' },
    { name: 'Urban League', fullName: 'Urban League of Greater Kansas City', logo: '/images/endorsers/Urban League.png', website: 'https://www.ulkc.org/' },
    // Confirmed endorsers
    { name: 'Heartland Black Chamber of Commerce', fullName: 'Heartland Black Chamber of Commerce', logo: '/images/endorsers/Heartland Black Chamber.PNG', website: 'https://heartlandblackchamber.com/' },
    { name: 'Freedom, Inc.', fullName: 'Freedom, Incorporated', logo: '/images/endorsers/Freedom Inc.PNG', website: 'https://freedomincorporated.org/' },
    { name: 'Southland Progress', fullName: 'Southland Progress', logo: '/images/endorsers/Southland Progress.png', website: null },
    { name: '12th Street Heritage', fullName: 'Twelfth Street Heritage Development Corporation', logo: '/images/endorsers/12th Street Heritage.png', website: 'https://www.twelfthstreetheritage.org/' },
    { name: 'LiUNA Local 264', fullName: "Laborers' International Union of North America Local 264", logo: '/images/endorsers/Laborers 264.PNG', website: 'https://www.local264.com/', logoScale: 1.25 },
    { name: 'LaRaza', fullName: 'LaRaza Political Club', logo: '/images/endorsers/LaRaza.png', website: null },
    { name: 'Bridlespur Neighborhood Assoc', fullName: 'Bridlespur Homeowners Association', logo: '/images/endorsers/Bridlespur Neighborhood Assoc.png', website: 'https://bridlespurhomeowners.org/' },
    { name: 'Historic West Bottom', fullName: 'Historic West Bottoms Association', logo: '/images/endorsers/Historic West Bottom.png', website: 'https://www.hwb-kc.com/' },
    { name: 'Holmes Garden Neighborhood Association', fullName: 'Holmes Garden Neighborhood Association', logo: '/images/endorsers/Holmes Garden Neighborhood Association.png', website: null },
    { name: 'Northeast Chamber of Commerce', fullName: 'Northeast Kansas City Chamber of Commerce', logo: '/images/endorsers/Northeast Chamber of Commerce.png', website: 'https://nekcchamber.com/' },
    { name: 'South KC Chamber of Commerce', fullName: 'South Kansas City Chamber of Commerce', logo: '/images/endorsers/South Kansas City Chamber.PNG', website: 'https://www.southkcchamber.com/' },
    // Union endorsers
    { name: 'Plumbers Local 8', fullName: 'Plumbers & Gasfitters Local 8, United Association', logo: '/images/endorsers/Plumbers Local 8.png', website: 'https://plumberslocal8.com/', logoScale: 1.25 },
    { name: 'IBEW Local 124', fullName: 'International Brotherhood of Electrical Workers Local 124', logo: '/images/endorsers/IBEW Local 124.png', website: 'https://ibew124.org/', logoScale: 1.25 },
    { name: 'OPCMIA Local 518', fullName: "Operative Plasterers' and Cement Masons' International Association Local 518", logo: '/images/endorsers/OPCMIA Local 518.png', website: 'https://opcmia518.org/', logoScale: 1.25 },
    { name: 'IUPAT DC #3', fullName: 'International Union of Painters and Allied Trades District Council 3', logo: '/images/endorsers/IUPAT-DC-3.png', website: 'https://iupatdc3.com/' },
    { name: 'IUOE Local 101', fullName: 'International Union of Operating Engineers Local 101', logo: '/images/endorsers/IUOE Local 101 logo.png', website: 'https://iuoelocal101.org/', logoScale: 1.25 },
    { name: 'CWA Local 6360', fullName: 'Communications Workers of America Local 6360', logo: '/images/endorsers/CWA Local 6360.png', website: 'https://www.cwa6360.org/', logoScale: 1.25 },
    { name: 'IAMAW Local Lodge 778', fullName: 'International Association of Machinists and Aerospace Workers Local Lodge 778', logo: '/images/endorsers/IAMAW Local Lodge 778.png', website: 'https://www.goiam.org/', logoScale: 1.25 },
    { name: 'AFT Local 691', fullName: 'Kansas City Federation of Teachers & School-Related Personnel, AFT Local 691', logo: '/images/endorsers/AFT Local 691.png', website: 'https://691.mo.aft.org/', logoScale: 1.25 },
    { name: 'Roofers Local 20', fullName: 'Roofers & Waterproofers Local 20', logo: '/images/endorsers/Roofers Local 20.png', website: 'https://www.rooferslocal20.com/', logoScale: 1.25 },
    { name: 'SEATU', fullName: 'Seafarers Entertainment and Allied Trades Union', logo: '/images/endorsers/SEATU.png', website: 'https://www.seatu.org/' },
    { name: 'APWU Local 67', fullName: 'American Postal Workers Union, Greater Kansas City Metro Area Local 67', logo: '/images/endorsers/APWU Local 67.png', website: 'https://www.gkcmal.org/', logoScale: 1.25 },
    { name: 'Greater KC Building Construction Trades Council', fullName: 'Greater Kansas City Building & Construction Trades Council', logo: '/images/endorsers/Greater KC Building Construction Trades Council .png', website: 'https://www.buildkc.org/' },
    { name: 'Missouri AFL-CIO', fullName: 'Missouri AFL-CIO', logo: '/images/endorsers/ALF-CIO.png', website: 'https://moaflcio.org/' },
    { name: 'AFGE 1336', fullName: 'American Federation of Government Employees Local 1336', logo: '/images/endorsers/AFGE 1336.png', website: 'https://afge1336.com/', logoScale: 1.25 },
    { name: 'IBEW Local 53', fullName: 'International Brotherhood of Electrical Workers Local 53', logo: '/images/endorsers/IBEW Local 53.png', website: 'https://www.ibewlocal53.org/', logoScale: 1.25 },
    { name: 'IAFF Local 3808', fullName: 'International Association of Fire Fighters Local 3808', logo: '/images/endorsers/IAFF Local 3808.png', website: null, logoScale: 1.25 },
    { name: 'Pipefitters Local 533', fullName: 'Pipefitters Local Union 533, United Association', logo: '/images/endorsers/Pipefitters Local 533.png', website: 'https://www.local533.com/', logoScale: 1.25 },
  ],
  cityOfficials: [
    { name: 'Quinton Lucas', title: 'Mayor', district: '', photo: '/images/council/mayor-q.png' },
    { name: 'Ryana Parks-Shaw', title: 'Mayor Pro Tem', district: '5th District', photo: '/images/council/Ryana-Parks-Shaw.png' },
    { name: 'Kevin O\'Neill', title: 'Councilmember', district: '1st District at Large', photo: '/images/council/Kevin-ONeill.png' },
    { name: 'Lindsay French', title: 'Councilmember', district: '2nd District at Large', photo: '/images/council/Lindsay-French.png' },
    { name: 'Wes Rogers', title: 'Councilmember', district: '2nd District', photo: '/images/council/Wes-Rogers.png' },
    { name: 'Melissa Patterson Hazley', title: 'Councilmember', district: '3rd District at Large', photo: '/images/council/Melissa-Patterson.png' },
    { name: 'Melissa Robinson', title: 'Councilmember', district: '3rd District', photo: '/images/council/Melissa-Robinson.png' },
    { name: 'Crispin Rea', title: 'Councilmember', district: '4th District at Large', photo: '/images/council/Crispin-Rea.png' },
    { name: 'Eric Bunch', title: 'Councilmember', district: '4th District', photo: '/images/council/Eric-Bunch.png' },
    { name: 'Darrell Curls', title: 'Councilmember', district: '5th District at Large', photo: '/images/council/Darrell-Curls.png' },
    { name: 'Andrea Bough', title: 'Councilmember', district: '6th District at Large', photo: '/images/council/Andrea-Bough.png' },
    { name: 'Johnathan Duncan', title: 'Councilmember', district: '6th District', photo: '/images/council/Johnathan-Duncan.png' },
  ],
  electedOfficials: [
    { name: 'Ashley Aune', title: 'State Representative', district: '', photo: '/images/council/Ashley Aune .jpg' },
    { name: 'Maggie Nurrenbern', title: 'State Senator', district: '', photo: '/images/council/Maggie Nurrenbern.jpg' },
    { name: 'Darryl Forté', title: 'Jackson County Sheriff', district: '', photo: '/images/council/darryl forté.jpg' },
    { name: 'Michael Johnson', title: 'State Representative', district: '', photo: '/images/council/Michael Johnson.jpg' },
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
    question: 'When is the election?',
    answer: 'The e-tax renewal will appear on the ballot in the April 7, 2026, election. Qualified voters may vote absentee in person beginning on March 24.',
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
