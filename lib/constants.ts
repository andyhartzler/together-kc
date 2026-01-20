export const COLORS = {
  navy: '#1e3a5f',
  coral: '#e53935',
  golden: '#f5a623',
  sky: '#4a90d9',
  white: '#ffffff',
  lightGray: '#f8f9fa',
} as const;

export const VOTE_DATE = 'April 6, 2026';

export const SITE_CONFIG = {
  title: 'Renew the KC Earnings Tax | Vote YES on April 6, 2026',
  description: 'The earnings tax funds nearly half the cost of city services: first responders, street repair, trash pickup, and more. Vote YES to renew the e-tax on or before April 6, 2026.',
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
    'Greater KC Chamber of Commerce',
    'Firefighters Local 42',
    'Fraternal Order of Police',
    'KC NAACP',
    'AFL-CIO',
    'Civic Council of Greater Kansas City',
    'Jobs with Justice',
    'Laborers 264',
    'South KC Chamber',
    'Heavy Constructors Association',
    'KC Building Trades Council',
    'IBEW Local 124',
    'Plumbers & Pipefitters Local 8',
    'Sheet Metal Workers Local 2',
    'Carpenters Regional Council',
    'Operating Engineers Local 101',
  ],
  electedOfficials: [
    'City Council President Kevin O\'Neill',
    'Council Member Andrea Bough',
    'Council Member Melissa Robinson',
    'Council Member Eric Bunch',
    'Council Member Ryana Parks-Shaw',
    'Council Member Nathan Willett',
    'Council Member Dan Fowler',
    'State Representative Richard Brown',
    'State Representative Mark Sharp',
    'Jackson County Sheriff Darryl Forté',
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
    answer: 'Missouri state law requires cities with an earnings tax to put it up for renewal every 5 years. This ensures citizens have a regular say in how their city is funded. The last renewal was in 2021, and the next vote is on April 6, 2026.',
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
    answer: 'You can help by: voting YES on or before April 6, 2026; spreading the word to friends, family, and coworkers; displaying yard signs and sharing on social media; endorsing the renewal if you represent an organization; and contributing to Together KC\'s outreach efforts.',
  },
] as const;
