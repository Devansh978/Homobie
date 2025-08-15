import React from 'react';
import {
  HomeIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  LightBulbIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

const services = [
  {
    title: 'Home Loan',
    description: 'Flexible home financing solutions tailored to your goals.',
    icon: HomeIcon,
  },
  {
    title: 'Loan Against Property',
    description: 'Unlock your property’s value with secured lending.',
    icon: CurrencyDollarIcon,
  },
  {
    title: 'Balance Transfer',
    description: 'Lower your EMIs by transferring your existing loans.',
    icon: ArrowPathIcon,
  },
  {
    title: 'SIP (Systematic Investment Plan)',
    description: 'Invest smartly with consistent, goal-based SIP plans.',
    icon: ChartBarIcon,
  },
  {
    title: 'Financial Consultation',
    description: 'Talk to experts for customized financial advice.',
    icon: ChatBubbleLeftRightIcon,
  },
];

const values = [
  { name: 'Transparency', icon: ShieldCheckIcon },
  { name: 'Customer First', icon: UserGroupIcon },
  { name: 'Innovation', icon: LightBulbIcon },
  { name: 'Compliance', icon: ClipboardDocumentCheckIcon },
];

const leaders = [
  { name: 'Rohan Desai', title: 'Founder & CEO' },
  { name: 'Anita Mehra', title: 'Chief Financial Officer' },
  { name: 'Sameer Khanna', title: 'Chief Technology Officer' },
];

const AboutPage = () => {
  return (
    <main className="bg-white text-black font-sans">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Homobie</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Empowering Smarter Financial Decisions
        </p>
        <p className="mt-4 text-gray-300 max-w-xl mx-auto">
          Your trusted partner in personal finance, delivering secure and
          reliable services for every stage of life.
        </p>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center">Who We Are</h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          Homobie is a modern fintech company offering transparent, user-centric
          financial services. Whether you’re purchasing a new home, managing
          debt, or planning your future, we provide tools, funding, and expert
          guidance every step of the way.
        </p>
      </section>

      {/* Services Section */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(({ title, description, icon: Icon }, idx) => (
              <div
                key={idx}
                className="bg-white p-6 shadow-md rounded-lg transition-transform transform hover:scale-105"
              >
                <Icon className="w-10 h-10 text-black mb-4" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {values.map(({ name, icon: Icon }, i) => (
            <div key={i} className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <Icon className="w-8 h-8 mx-auto mb-4 text-black" />
              <h3 className="text-lg font-medium">{name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Section */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">Leadership</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center">
            {leaders.map((leader, i) => (
              <div key={i} className="transition-opacity hover:opacity-80">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold">{leader.name}</h3>
                <p className="text-gray-600">{leader.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
