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
  url: 'https://renewkc.com',
  organization: 'Together KC',
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/endorsements', label: 'Endorsements' },
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
    { name: 'NAACP – KC Chapter', logo: '/images/endorsers/NAACP KC.png' },
    { name: 'Firefighters Local 42', logo: '/images/endorsers/Firefighters Local 42.png' },
    { name: 'Greater KC Chamber of Commerce', logo: '/images/endorsers/KC Chamber.PNG' },
    { name: 'Missouri AFL-CIO', logo: '/images/endorsers/ALF-CIO.png' },
    { name: 'Civic Council of Greater Kansas City', logo: '/images/endorsers/Civic Council of Greater Kansas City.png' },
    { name: 'Heavy Constructors Association', logo: '/images/endorsers/Heavy Constructors.png' },
    { name: 'Jobs With Justice', logo: '/images/endorsers/MO Jobs with Justice.PNG' },
    { name: 'Laborers Local 264', logo: '/images/endorsers/Laborers 264.PNG' },
    { name: 'Labor Management Council', logo: '/images/endorsers/Labor Managment Council.PNG' },
    { name: 'South KC Chamber of Commerce', logo: '/images/endorsers/South Kansas City Chamber.PNG' },
    { name: 'MO Budget Project', logo: '/images/endorsers/MO Budget Project.png' },
    { name: 'MO Healthcare for All', logo: '/images/endorsers/MO Healthcare for All.PNG' },
    { name: 'Heartland Black Chamber of Commerce', logo: '/images/endorsers/Heartland Black Chamber.PNG' },
    { name: 'Empower Missouri', logo: '/images/endorsers/Empower Missouri.PNG' },
    { name: 'KC Realtors Association', logo: '/images/endorsers/KC Realtors Association.PNG' },
    { name: 'South KC Alliance', logo: '/images/endorsers/South KC Alliance.PNG' },
    { name: 'Fraternal Order of Police', logo: '/images/endorsers/Fraternal Order of Police.png' },
    { name: 'Freedom, Inc.', logo: '/images/endorsers/Freedom Inc.PNG' },
    { name: 'Northland Progress', logo: '/images/endorsers/Northland Progress.PNG' },
    { name: 'Indivisible MO', logo: '/images/endorsers/Indivisible.PNG' },
    { name: 'Northland Neighborhoods, Inc.', logo: '/images/endorsers/Northland Neighborhoods.PNG' },
    { name: 'The Loretto KC', logo: '/images/endorsers/The Loretto KC.png' },
    { name: 'Northland Regional Chamber', logo: '/images/endorsers/Northland Regional Chamber.png' },
    { name: 'Downtown Council', logo: '/images/endorsers/Downtown Council.png' },
    { name: 'SEIU HC', logo: '/images/endorsers/SEIU HC.PNG' },
    { name: 'Missouri Faith Voices', logo: '/images/endorsers/Missouri Faith Voices.PNG' },
    { name: 'SEIU Local 1 MO', logo: '/images/endorsers/SEIU Local 1 MO.png' },
    { name: 'Southland Progress', logo: '/images/endorsers/Southland Progress.png' },
    { name: 'Forward KC', logo: '/images/endorsers/Forward KC.png' },
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
    answer: 'The earnings tax is a 1% tax on income earned within Kansas City, Missouri. It has been in place since 1963 and funds nearly half of the city\'s essential services including fire, police, emergency medical services, road maintenance, trash pickup, and snow removal.',
  },
  {
    question: 'Will voting "yes" raise my taxes?',
    answer: 'No. Voting "yes" simply renews the existing 1% earnings tax at the same rate it has been for over 60 years. This is not a tax increase — it\'s a renewal of the current tax that Kansas Citians have approved multiple times.',
  },
  {
    question: 'What benefits does the earnings tax provide?',
    answer: 'The earnings tax funds critical city services that affect daily life: fire and police protection, emergency medical services, street repair and pothole filling, trash collection, snow removal, parks maintenance, and anti-illegal dumping programs. Without it, these services would face devastating cuts.',
  },
  {
    question: 'Why is this being put up for a vote?',
    answer: 'Missouri state law requires cities with an earnings tax to put it up for renewal every 5 years. This ensures citizens have a regular say in how their city is funded. The last renewal was in 2021, and the next vote is on April 7, 2026.',
  },
  {
    question: 'Can we fund these services another way?',
    answer: 'The earnings tax is the most equitable funding mechanism because about half the revenue comes from non-residents who work in Kansas City and use city services. Without it, the burden would shift entirely to KC residents through much higher property or sales taxes, or services would be dramatically cut.',
  },
  {
    question: 'Who pays the earnings tax?',
    answer: 'Anyone who earns income working within Kansas City pays the 1% tax. This includes both residents and non-residents. Retirees, military personnel on active duty, and those who are unemployed do not pay the earnings tax.',
  },
  {
    question: 'How can I help renew the earnings tax?',
    answer: 'You can help by: voting YES on or before April 7, 2026; spreading the word to friends, family, and coworkers; displaying yard signs and sharing on social media; endorsing the renewal if you represent an organization; and contributing to Together KC\'s outreach efforts.',
  },
] as const;
