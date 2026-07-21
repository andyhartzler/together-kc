import Link from 'next/link';
import Footer from '@/components/layout/Footer';

// Static legal page: the committee privacy policy plus the terms for the
// call and text outreach programs. Content carries forward the policy that
// lived at /privacy on the pre-rebuild site, updated to cover voice calls
// alongside SMS. Deliberately unanimated: this page is read for its words.

const LAST_UPDATED = 'July 21, 2026';

const SECTIONS = [
  { id: 'at-a-glance', label: 'At a Glance' },
  { id: 'information-we-collect', label: 'Information We Collect' },
  { id: 'how-we-use-it', label: 'How We Use Your Information' },
  { id: 'sharing', label: 'Sharing & Disclosure' },
  { id: 'calls-and-texts', label: 'Calls & Text Messages' },
  { id: 'cookies', label: 'Cookies & Analytics' },
  { id: 'security', label: 'Security' },
  { id: 'changes', label: 'Changes to This Policy' },
  { id: 'contact', label: 'Contact Us' },
];

const AT_A_GLANCE: { question: string; answer: string }[] = [
  {
    question: 'What we collect',
    answer: 'Name, email address, phone number, and basic usage information when you visit our site or sign up for updates.',
  },
  {
    question: 'Why we collect it',
    answer: 'To share election information, respond to your questions, and keep you posted on the campaign.',
  },
  {
    question: 'Do we sell your information?',
    answer: 'No. We do not sell, rent, or trade your personal information.',
  },
  {
    question: 'How to stop texts',
    answer: 'Reply STOP to any text message from us.',
  },
  {
    question: 'How to stop calls',
    answer: 'Follow the opt-out instructions in the call, or email action@together-kc.com.',
  },
  {
    question: 'Questions?',
    answer: 'Email action@together-kc.com and we will help.',
  },
];

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-32 md:scroll-mt-36 pt-10 first:pt-0">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-navy leading-tight [text-wrap:balance]">
        {children}
      </h2>
      <div className="mt-3 h-px w-16 bg-gradient-to-r from-coral via-golden to-sky" />
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-navy pt-28 sm:pt-32 pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm text-white px-4 py-1.5 text-xs sm:text-sm font-semibold border border-white/20 uppercase tracking-[0.14em]">
            Together KC
          </span>
          <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight [text-wrap:balance]">
            Privacy Policy &amp; Terms
          </h1>
          <p className="mt-4 text-white/70 text-base sm:text-lg leading-relaxed">
            How we collect, use, and protect your personal information, and the
            terms for our informational call and text programs.
          </p>
          <p className="mt-3 text-white/50 text-sm">Last updated {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Jump nav */}
      <nav
        aria-label="Sections of this policy"
        className="border-b border-navy/10 bg-white/95 backdrop-blur sticky top-16 md:top-20 z-20"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <ul className="flex gap-x-6 py-3 whitespace-nowrap text-sm">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-navy/60 hover:text-coral font-medium transition-colors"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-navy/80 text-[15px] sm:text-base leading-relaxed [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:space-y-2 [&_li]:pl-1">
        <p className="text-lg text-navy/90">
          Together KC understands the importance of protecting your personal
          information. This Privacy Policy describes how we collect, use, and
          disclose your personal information when you use our website or take
          part in our outreach programs. By using our website, you consent to
          the collection and use of your personal information as described
          here.
        </p>

        <SectionHeading id="at-a-glance">At a Glance</SectionHeading>
        <p>The short version, in plain language:</p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-navy/10 shadow-sm">
          <table className="w-full text-left border-collapse">
            <caption className="sr-only">Summary of this privacy policy</caption>
            <tbody>
              {AT_A_GLANCE.map((row, i) => (
                <tr key={row.question} className={i % 2 === 0 ? 'bg-navy/[0.03]' : 'bg-white'}>
                  <th
                    scope="row"
                    className="align-top w-2/5 sm:w-1/3 px-4 sm:px-5 py-3.5 text-sm font-semibold text-navy border-t border-navy/10 first:border-t-0"
                  >
                    {row.question}
                  </th>
                  <td className="align-top px-4 sm:px-5 py-3.5 text-sm text-navy/75 border-t border-navy/10">
                    {row.answer}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-navy/60">
          The table above is a summary only. The full policy below is what
          governs.
        </p>

        <SectionHeading id="information-we-collect">Information We Collect</SectionHeading>
        <p>
          When you visit our website or sign up to receive updates, we may
          collect certain personal information from you, including your name,
          email address, phone number, and other contact information. We may
          also collect other information about your usage of our website, such
          as your IP address, browser type, and operating system.
        </p>

        <SectionHeading id="how-we-use-it">How We Use Your Information</SectionHeading>
        <p>We may use your personal information to:</p>
        <ul className="list-disc list-outside ml-5">
          <li>Provide and improve our website and services.</li>
          <li>Respond to your inquiries and requests.</li>
          <li>
            Share information about the campaign, upcoming elections, and how
            to vote.
          </li>
          <li>Communicate with you about our services, promotions, and events.</li>
          <li>Personalize your experience on our website.</li>
          <li>Analyze and monitor usage of our website.</li>
          <li>Comply with legal obligations.</li>
        </ul>

        <SectionHeading id="sharing">Sharing &amp; Disclosure</SectionHeading>
        <p>
          We may disclose your personal information to third-party service
          providers who assist us in providing our services, such as hosting
          providers, payment processors, telephone and messaging providers, and
          analytics providers. We may also disclose your personal information
          if required by law or to protect our legal rights.
        </p>
        <p>
          Together KC maintains strict privacy practices, ensuring that the
          personal information of our users and members is not sold, rented,
          released, or traded to others without prior consent or a legal
          obligation. Personal information includes your name, email address,
          phone number, and other contact information.
        </p>

        <SectionHeading id="calls-and-texts">Calls &amp; Text Messages</SectionHeading>
        <p>
          By providing your mobile phone number to Together KC, you consent to
          receive recurring informational, marketing, and fundraising messages
          from Together KC at that number, including text (SMS and MMS)
          messages and voice calls. These may include messages and calls placed
          using an automatic telephone dialing system or delivering a
          prerecorded or artificial voice message. All the different types of
          messages and calls you may receive are known collectively as the
          &ldquo;Programs.&rdquo; Consent is not a condition of any purchase or
          donation.
        </p>

        <h3 className="mt-8 text-lg font-bold text-navy">Cost</h3>
        <p>
          Message and data rates may apply. Please consult your carrier for
          rate information.
        </p>

        <h3 className="mt-8 text-lg font-bold text-navy">Frequency</h3>
        <p>
          Message and call frequency will vary. We reserve the right to alter
          the frequency of messages and calls at any time, and to change the
          phone number from which they are sent or placed. Not all mobile
          devices or handsets may be supported, and our messages may not be
          deliverable in all areas. Our service providers and the mobile
          carriers supported by the Programs are not liable for delayed or
          undelivered messages.
        </p>

        <h3 className="mt-8 text-lg font-bold text-navy">Opting Out</h3>
        <p>
          If you no longer wish to receive text messages from a Program, reply
          to any message from that Program with STOP, END, CANCEL, UNSUBSCRIBE,
          or QUIT. You may receive one additional message confirming your
          decision to opt out. If you are subscribed to multiple Programs
          across different phone numbers or short codes, you must opt out of
          each one separately.
        </p>
        <p>
          If you no longer wish to receive voice calls, follow the opt-out
          instructions provided in the call, or email us at{' '}
          <a href="mailto:action@together-kc.com" className="text-coral font-medium hover:underline">
            action@together-kc.com
          </a>{' '}
          with the phone number you would like removed.
        </p>
        <p>
          You understand and agree that the options above are the only
          reasonable and exclusive methods of opting out of text Programs.
          Texting words or phrases other than those set forth above is not a
          reasonable means of opting out.
        </p>

        <h3 className="mt-8 text-lg font-bold text-navy">Support</h3>
        <p>
          For support regarding a Program, text HELP to the number from which
          you received the message, or email us at{' '}
          <a href="mailto:action@together-kc.com" className="text-coral font-medium hover:underline">
            action@together-kc.com
          </a>
          . Please note that emailing us or texting HELP is not a method of
          opting out; opt-outs must be submitted as described above.
        </p>

        <h3 className="mt-8 text-lg font-bold text-navy">Disclaimer of Warranty</h3>
        <p>
          The Programs are offered on an &ldquo;as-is&rdquo; basis and may not
          be available in all areas at all times, and may not continue to work
          in the event of product, software, coverage, or other changes made by
          your wireless carrier. We will not be liable for any delays or
          failures in the receipt of any messages or calls connected with any
          Program. Delivery is subject to effective transmission from your
          wireless service provider and network operator and is outside of our
          control.
        </p>
        <p>
          We respect your privacy. We will only use information you provide
          through the Programs to transmit messages and calls and to respond to
          you when necessary. This includes sharing information with Program
          partners, message content providers, phone companies, and vendors who
          assist us in delivery. Except as set forth in this section, we do not
          sell, rent, loan, trade, lease, or otherwise transfer for profit any
          phone numbers or contact information collected through the Programs
          to any third party. We reserve the right to disclose information as
          necessary to satisfy any law, regulation, or governmental request, to
          avoid liability, or to protect our rights or property.
        </p>
        <p>
          When you complete forms online or otherwise provide us information in
          connection with a Program, you agree to provide accurate, complete,
          and true information, and not to use a false or misleading name or a
          name you are not authorized to use. If, in our sole discretion, we
          believe any such information is untrue, inaccurate, or incomplete, or
          that you have opted into a Program for an ulterior purpose, we may
          refuse you access to the Program and pursue any appropriate legal
          remedies.
        </p>

        <SectionHeading id="cookies">Cookies &amp; Analytics</SectionHeading>
        <p>
          We may use cookies and other tracking technologies to collect
          information about your usage of our website and to personalize your
          experience. You can choose to accept or decline cookies through your
          browser settings. If you decline cookies, some features of our
          website may not be available to you.
        </p>

        <SectionHeading id="security">Security</SectionHeading>
        <p>
          We take reasonable measures to protect your personal information from
          unauthorized access, disclosure, and use. However, no security
          measures are perfect, and we cannot guarantee the security of your
          personal information.
        </p>

        <SectionHeading id="changes">Changes to This Policy</SectionHeading>
        <p>
          We may update this Privacy Policy from time to time by posting a new
          version on our website. We encourage you to review this page
          periodically. This Privacy Policy and these terms apply to Together
          KC&rsquo;s website and outreach Programs and have no effect on any
          other privacy policies that may govern your relationship with us in
          other contexts.
        </p>

        <SectionHeading id="contact">Contact Us</SectionHeading>
        <p>
          Questions about this policy, your information, or our Programs? Email
          us at{' '}
          <a href="mailto:action@together-kc.com" className="text-coral font-medium hover:underline">
            action@together-kc.com
          </a>
          .
        </p>
        <p className="mt-8 text-sm text-navy/60">
          Paid for by Together KC, Dan Kopp, Treasurer.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-navy text-white text-sm font-semibold px-5 py-2.5 hover:bg-navy/90 transition-colors"
          >
            Back to the August 4 Ballot
          </Link>
          <Link
            href="/vote"
            className="inline-flex items-center rounded-full border border-navy/20 text-navy text-sm font-semibold px-5 py-2.5 hover:border-coral hover:text-coral transition-colors"
          >
            Find Where to Vote
          </Link>
        </div>
      </article>

      <Footer />
    </main>
  );
}
