import React from "react";
import { Link } from "wouter";
import { ChatbotButton } from "@/components/layout/chatbot-button";
import { LoanCalculator } from "@/components/ui/calculator";
import { SipCalculator } from "@/components/ui/sip-calculator";
import { LoanCard } from "@/components/layout/loan-card";
import { TestimonialCard } from "@/components/layout/testimonial-card";
import { FeatureCard } from "@/components/layout/feature-card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Percent, 
  UserCheck, 
  ChartLine, 
  Calendar, 
  DollarSign
} from "lucide-react";

export default function HomePage() {
  const handleLoanCalculatorApply = (loanDetails: any) => {
    // Redirect to loan application with pre-filled data
    window.location.href = `/loan-application?type=${loanDetails.loanType}&amount=${loanDetails.amount}&interestRate=${loanDetails.interestRate}&tenure=${loanDetails.tenure}`;
  };

  const handleSipCalculatorStart = (sipDetails: any) => {
    // Redirect to SIP application with pre-filled data
    window.location.href = `/sip?amount=${sipDetails.monthlyAmount}&period=${sipDetails.investmentPeriod}&rate=${sipDetails.expectedReturnRate}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#5f4411] to-[#34445f] text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                A simpler,  {" "}
                <span className="text-[#FFB800]">smarter,</span> and fairer way to finance your future.
              </h1>
                <h4 className="text-2xl md:text-3xl font-bold leading-tight">
                  At  {" "}
                  <span className="text-[#FFB800]">Homobie,</span> </h4>
                  <p className="text-lg text-neutral-100"> we’re transforming the way India experiences financial access—starting with smarter home loans, flexible loan against property options, and wealth-building tools like SIP investment planning.
                <br />
                <br />
We believe finance shouldn’t be confusing, biased, or built only for the  privileged. Whether you’re self-employed, managing household income, or navigating loans for the first time, Homobie is here to connect you with financial solutions that are practical, transparent, and built for your life.
                <br />
                <br />
                Through our digital-first platform, zero-cost consultations, and real-time tools like our free EMI calculator online and SIP calculator online, we help every borrower make confident, informed decisions.
                
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link href="/loan-application?type=home-loan">
                  <Button className="px-6 py-3 bg-[#FFB800] text-neutral-900 font-medium rounded-lg hover:bg-[#D99B00] transition-colors">
                    Get Instant Approval
                  </Button>
                </Link>
                <Link href="/consultation">
                  <Button variant="outline" className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg hover:bg-white/20 transition-colors">
                    Book Free Consultation
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-4 pt-2">
                {/* <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80"
                    className="w-8 h-8 rounded-full border-2 border-white"
                    alt="User"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80"
                    className="w-8 h-8 rounded-full border-2 border-white"
                    alt="User"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80"
                    className="w-8 h-8 rounded-full border-2 border-white"
                    alt="User"
                  />
                </div> */}
                <p className="text-sm text-neutral-200">
                  Trusted by Many customers
                </p>
              </div>
            </div>

            {/* <div className="md:w-1/2 md:pl-12" id="calculator">
              <LoanCalculator onApply={handleLoanCalculatorApply} />
            </div> */}
               <div className="md:w-1/2 md:pl-12">
                 <img
                   src="src/assets/5571a411-806b-406e-babc-48586ad632c2-removebg-preview.png"
                   className="rounded-xl w-full transform hover:scale-105 transition duration-500 ease-in-out shadow-[0_10px_25px_rgba(0,0,0,0.3)]"
                   alt="User"
                 />
              


             </div>
          </div>
        </div>
      </section>

      {/* Built for People Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">
                🔹 Built for People, Not Just Paperwork
              </h2>
            </div>
            
            <div className="prose prose-lg mx-auto text-neutral-700 leading-relaxed">
              <p className="text-lg mb-6">
                In India, applying for a loan often means dealing with outdated systems, long waits, and biased approvals. Most platforms still cater to only high-credit-score, salaried applicants.
              </p>
              
              <div className="bg-neutral-50 p-6 rounded-lg my-8">
                <p className="mb-4 font-medium">But what if you're self-employed with variable income?</p>
                <p className="mb-4 font-medium">What if you don't have a credit card or haven't taken loans before?</p>
                <p className="mb-4 font-medium">What if you're financially capable but excluded by the system?</p>
              </div>
              
              <p className="text-xl font-semibold text-[#5f4411] mb-6">
                That's where Homobie steps in.
              </p>
              
              <p className="text-lg">
                We make things simple. Whether you're comparing mortgage loan options, calculating repayment with our EMI calculator, or exploring a balance transfer credit card, our platform is here to guide—not sell. We treat you like a person, not a profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">
                🔹 What We Do
              </h2>
              <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
                Homobie is a next-gen financial platform built around home loans, loan against property loans, and smart repayment strategies powered by SIP plans. We serve real people with real goals—not just those who fit into boxes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
                <div className="flex items-start space-x-4">
                  <div className="text-green-600 text-2xl">✅</div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-3">Home Loan Advisory</h3>
                    <p className="text-neutral-600">Personalized guidance to help you find the right lender, the right amount, and the right terms</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
                <div className="flex items-start space-x-4">
                  <div className="text-green-600 text-2xl">✅</div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-3">Loans Against Property</h3>
                    <p className="text-neutral-600">Unlock the value of your property for personal or business needs</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
                <div className="flex items-start space-x-4">
                  <div className="text-green-600 text-2xl">✅</div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-3">SIP-Linked Repayment Planning</h3>
                    <p className="text-neutral-600">An innovative way to repay your loan and build long-term wealth through monthly investments</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
                <div className="flex items-start space-x-4">
                  <div className="text-green-600 text-2xl">✅</div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-3">Zero-Fee Digital Consultation</h3>
                    <p className="text-neutral-600">No cost, no pressure, no agents—just expert, honest advice</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center bg-[#5f4411] text-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Zero-Fee Consultation – 100% unbiased, 100% online</h3>
              <p className="text-lg opacity-90">
                We partner directly with India's top banks and NBFCs, cutting out commission-driven agents and helping you find clarity instead of confusion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-8">
              🔹 Our Mission
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="p-6">
                <div className="text-4xl mb-4">🌉</div>
                <p className="text-neutral-700">Bridge the financial literacy gap in home financing</p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">🔧</div>
                <p className="text-neutral-700">Eliminate middleman exploitation through technology integration</p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">💪</div>
                <p className="text-neutral-700">Empower every Indian with a clear, personalized, and strategic loan repayment plan</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-[#5f4411] to-[#34445f] text-white p-8 rounded-xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                With Homobie, homeownership isn't just affordable—
                <span className="text-[#FFB800]">it's financially smart</span>
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">
                🔹 Our Vision
              </h2>
              <p className="text-lg text-neutral-700">
                We see a future where every Indian has equal access to:
              </p>
            </div>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg">
                <div className="text-2xl">🔍</div>
                <p className="text-neutral-700">Transparent credit options like loan against property and mortgage loans</p>
              </div>
              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg">
                <div className="text-2xl">🧮</div>
                <p className="text-neutral-700">Easy-to-use planning tools like the free EMI calculator online and SIP calculator online</p>
              </div>
              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg">
                <div className="text-2xl">💡</div>
                <p className="text-neutral-700">Clear guidance on responsible borrowing, smart investing, and real-time financial decisions</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-lg text-neutral-700">
                Our goal is to empower borrowers to build wealth, repay smarter, and confidently manage everything from balance transfers to SIP investments—all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Homobie Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">
                🔹 Why Choose Homobie?
              </h2>
              <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
                Unlike traditional DSAs or lead-gen portals, Homobie is a human-first platform. No sales pressure. No hidden agendas. Just financial services that put you first.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-neutral-50 p-8 rounded-xl">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="text-3xl">💬</div>
                  <h3 className="text-xl font-semibold text-neutral-800">Real Guidance, Not Sales</h3>
                </div>
                <p className="text-neutral-700">We explain loan terms and SIP strategies clearly—so you can choose, not be sold to.</p>
              </div>
              
              <div className="bg-neutral-50 p-8 rounded-xl">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="text-3xl">🤝</div>
                  <h3 className="text-xl font-semibold text-neutral-800">Zero Agents. No Hidden Fees.</h3>
                </div>
                <p className="text-neutral-700">What you see is what you get. We work with banks and NBFCs directly.</p>
              </div>
              
              <div className="bg-neutral-50 p-8 rounded-xl">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="text-3xl">📈</div>
                  <h3 className="text-xl font-semibold text-neutral-800">Smarter Repayment with SIP + EMI</h3>
                </div>
                <p className="text-neutral-700">We help you plan SIP investments that grow while you repay, using our built-in SIP calculator and expert guidance.</p>
              </div>
              
              <div className="bg-neutral-50 p-8 rounded-xl">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="text-3xl">📲</div>
                  <h3 className="text-xl font-semibold text-neutral-800">100% Digital and Paper-Lite</h3>
                </div>
                <p className="text-neutral-700">From applying for a loan against property to exploring credit card balance transfers, everything is managed on your mobile.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-12">
              🔹 Who We Serve
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-4">👨‍💼</div>
                <h3 className="font-semibold text-neutral-800 mb-2">Self-employed professionals</h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-4">🏠</div>
                <h3 className="font-semibold text-neutral-800 mb-2">First-time homebuyers</h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="font-semibold text-neutral-800 mb-2">Borrowers with thin or no credit history</h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-4">🏢</div>
                <h3 className="font-semibold text-neutral-800 mb-2">Property owners exploring loan against property loans</h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-4">💳</div>
                <h3 className="font-semibold text-neutral-800 mb-2">People interested in cash transfer, balance transfer credit card options</h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-4">📈</div>
                <h3 className="font-semibold text-neutral-800 mb-2">Long-term SIP investment enthusiasts</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-12">
              🔹 Our Promise
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="text-green-600 text-2xl">✅</div>
                <p className="text-neutral-700 text-left">Transparent rates and real offers</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-green-600 text-2xl">✅</div>
                <p className="text-neutral-700 text-left">Data security and RBI-compliant partners</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-green-600 text-2xl">✅</div>
                <p className="text-neutral-700 text-left">Advisory you can trust, in your language</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-green-600 text-2xl">✅</div>
                <p className="text-neutral-700 text-left">Tools like EMI calculators and SIP plan calculators you can actually understand</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-gradient-to-r from-[#5f4411] to-[#34445f] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              🔹 Join Us
            </h2>
            
            <div className="space-y-6 mb-12">
              <p className="text-xl">
                India's borrowers deserve better—and Homobie is building that future.
              </p>
              <p className="text-lg opacity-90">
                If you've ever felt excluded, misinformed, or unsure, we're here to change that.
              </p>
            </div>
            
            <div className="bg-white/10 p-8 rounded-xl mb-8">
              <h3 className="text-2xl font-bold mb-4 text-[#FFB800]">
                BOOK YOUR FREE LOAN CONSULTATION TODAY
              </h3>
              <p className="text-lg mb-6">
                and take the first step toward smarter financial freedom.
              </p>
              <Link href="/consultation">
                <Button className="px-8 py-4 bg-[#FFB800] text-neutral-900 font-semibold text-lg rounded-lg hover:bg-[#D99B00] transition-colors">
                  Let's Get Started →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Products Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              Our Loan Products
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Tailored financial solutions to meet your specific needs and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <LoanCard
              type="home-loan"
              title="Home Loans"
              description="Make your dream home a reality with our flexible home loan options featuring competitive interest rates."
              features={[
                { text: "Interest rates from 7.5% p.a." },
                { text: "Loan tenure up to 30 years" },
                { text: "Up to 90% of property value" },
              ]}
              imageSrc="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80"
              buttonText="Apply for Home Loan"
              buttonColor="#0052CC"
              hoverColor="#003D99"
            />
            <LoanCard
              type="lap"
              title="Loan Against Property"
              description="Leverage your property to secure funds for business expansion, education, or other major expenses."
              features={[
                { text: "Interest rates from 8.5% p.a." },
                { text: "Loan tenure up to 15 years" },
                { text: "Up to 70% of property value" },
              ]}
              imageSrc="https://images.unsplash.com/photo-1555636222-cae831e670b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80"
              buttonText="Apply for LAP"
              buttonColor="#004080"
              hoverColor="#00305F"
            />
            <LoanCard
              type="bt-topup"
              title="Balance Transfer Top-Up"
              description="Transfer your existing loan and get additional funds at lower interest rates."
              features={[
                { text: "Interest rates from 7.0% p.a." },
                { text: "Consolidate multiple loans" },
                { text: "Reduce EMI by up to 30%" },
              ]}
              imageSrc="https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80"
              buttonText="Apply for BT Top-Up"
              buttonColor="#FFB800"
              hoverColor="#D99B00"
            />
          </div>
        </div>
      </section>

      {/* SIP Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">
                Grow Your Wealth with SIP
              </h2>
              <p className="text-neutral-600 mb-6">
                Systematic Investment Plans (SIPs) allow you to invest small
                amounts regularly in mutual funds, helping you build wealth over
                time.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1 mr-4">
                    <ChartLine className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Power of Compounding
                    </h3>
                    <p className="text-neutral-600">
                      Start early and let your investments grow exponentially
                      over time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1 mr-4">
                    <Calendar className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Disciplined Investing
                    </h3>
                    <p className="text-neutral-600">
                      Regular investments help you develop a saving habit and
                      financial discipline.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1 mr-4">
                    <DollarSign className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Start with Just ₹500
                    </h3>
                    <p className="text-neutral-600">
                      Begin your investment journey with as little as ₹500 per
                      month.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/sip">
                  <Button className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
                    Explore SIP Plans
                  </Button>
                </Link>
              </div>
            </div>

            <div className="md:w-1/2">
              <SipCalculator onStart={handleSipCalculatorStart} />
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img
                src="https://i.pinimg.com/736x/1c/5a/72/1c5a72bd9e391f3cd4ad2be04aaa55e2.jpg"
                alt="Financial Consultation"
                className="rounded-xl shadow-lg w-full"
              />
            </div>

            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">
                Book Your Free Financial Consultation
              </h2>
              <p className="text-neutral-600 mb-6">
                Our financial experts will help you understand your options and
                create a personalized plan to achieve your financial goals.
              </p>

              <Link href="/consultation">
                <Button className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                  Schedule Consultation Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

        {/* Testimonials Section  */}
      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their
              financial future with Homobie.
            </p>
          </div> 

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="The home loan process was incredibly smooth. I got pre-approved within minutes and had my loan disbursed in just 7 days. The interest rate was also better than what other banks offered!"
              name="Priya Sharma"
              role="Home Loan Customer"
              avatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80"
            />
            <TestimonialCard
              quote="I was paying high EMIs until I discovered Homobie's Balance Transfer Top-Up. Reduced my EMI by almost 25% and got additional funds for my business expansion. Excellent service!"
              name="Rahul Mehta"
              role="BT Top-Up Customer"
              avatarUrl="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80"
            />
            <TestimonialCard
              quote="The free consultation changed my financial perspective. Their advisor helped me start a SIP plan tailored to my goals. I've seen consistent growth and couldn't be happier with my investments."
              name="Ananya Patel"
              role="SIP Investment Customer"
              avatarUrl="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80"
            />
          </div>
        </div>
      </section>  */}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-[#004080] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Financial Journey?
          </h2>
          <p className="text-lg text-neutral-100 mb-8 max-w-2xl mx-auto">
            Take the first step towards financial freedom today. Apply for a
            loan, start investing, or book your free consultation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/loan-application?type=home-loan">
              <Button variant="secondary" className="px-8 py-3 bg-white text-primary font-medium rounded-lg hover:bg-neutral-100 transition-colors">
                Apply for Loan
              </Button>
            </Link>
            <Link href="/sip">
              <Button className="px-8 py-3 bg-[#FFB800] text-neutral-900 font-medium rounded-lg hover:bg-[#D99B00] transition-colors">
                Start SIP with ₹500
              </Button>
            </Link>
            <Link href="/consultation">
              <Button variant="outline" className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                Book Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ChatbotButton />
    </div>
  );
}
