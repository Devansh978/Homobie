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
              <p className="text-lg text-neutral-100">
                At Homobie, we’re transforming the way India experiences financial access—starting with smarter home loans, flexible loan against property options, and wealth-building tools like SIP investment planning.
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

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              Why Choose Homobie?
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Our comprehensive financial solutions are designed to provide
              maximum value and flexibility for your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Instant Approval"
              description="Get pre-approved for your loan in minutes, not days, with our streamlined application process."
            />
            <FeatureCard
              icon={Percent}
              title="Competitive Rates"
              description="Our partnerships with leading financial institutions ensure you get the most competitive interest rates available."
            />
            <FeatureCard
              icon={UserCheck}
              title="Expert Guidance"
              description="Our financial consultants provide personalized advice to help you make informed decisions."
            />
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
