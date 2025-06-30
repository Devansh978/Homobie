import React from "react";
import { Link } from "wouter";
import { ChatbotButton } from "@/components/layout/chatbot-button";
import { LoanCalculator } from "@/components/ui/calculator";
import { SipCalculator } from "@/components/ui/sip-calculator";
import { LoanCard } from "@/components/layout/loan-card";
import { FeatureCard } from "@/components/layout/feature-card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Zap, 
  Percent, 
  UserCheck, 
  ChartLine, 
  Calendar, 
  DollarSign,
  Home,
  Building,
  TrendingUp,
  Shield,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Heart,
  Star,
  Rocket,
  BookOpen,
  Eye,
  Calculator,
  Clock,
  Lightbulb,
  Globe,
  Handshake,
  FileText,
  CheckSquare,
  IndianRupee
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
                {/* <p className="text-sm text-neutral-200">
                  Trusted by Many customers
                </p> */}
              </div>
            </div>

            {/* <div className="md:w-1/2 md:pl-12" id="calculator">
              <LoanCalculator onApply={handleLoanCalculatorApply} />
            </div> */}
               <div className="md:w-1/2 md:pl-12">
                 <img
                   src="public/assets/5571a411-806b-406e-babc-48586ad632c2-removebg-preview.png"
                   className="rounded-xl w-full transform hover:scale-105 transition duration-500 ease-in-out shadow-[0_10px_25px_rgba(0,0,0,0.3)]"
                   alt="User"
                 />
              


             </div>
          </div>
        </div>
      </section>

      {/* Built for People Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-amber-50 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-[#5f4411] to-[#FFB800] rounded-full mb-6">
                <Home className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#5f4411] to-[#34445f] bg-clip-text text-transparent mb-6">
                Built for People, Not Just Paperwork
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#5f4411] to-[#FFB800] mx-auto rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                  <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                    In India, applying for a loan often means dealing with <span className="font-semibold text-red-600">outdated systems</span>, <span className="font-semibold text-red-600">long waits</span>, and <span className="font-semibold text-red-600">biased approvals</span>. Most platforms still cater to only high-credit-score, salaried applicants.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      "But what if you're self-employed with variable income?",
                      "What if you don't have a credit card or haven't taken loans before?", 
                      "What if you're financially capable but excluded by the system?"
                    ].map((question, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        viewport={{ once: true }}
                        className="flex items-start space-x-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-l-4 border-red-400"
                      >
                        <div className="w-2 h-2 rounded-full bg-red-400 mt-3 animate-pulse"></div>
                        <p className="font-medium text-neutral-700">{question}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-[#5f4411] to-[#34445f] p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-blue-400/10 animate-pulse"></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                      <Sparkles className="w-8 h-8 text-[#FFB800] animate-spin" />
                      <h3 className="text-2xl font-bold">That's where Homobie steps in.</h3>
                    </div>
                    <p className="text-lg text-white/90">
                      We make things simple. Whether you're comparing mortgage loan options, calculating repayment with our EMI calculator, or exploring a balance transfer credit card, our platform is here to guide—not sell. We treat you like a person, not a profile.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl shadow-2xl border border-white/30">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { icon: Home, label: "Home Loans", color: "from-blue-500 to-blue-600", delay: 0 },
                      { icon: Building, label: "Property Loans", color: "from-green-500 to-green-600", delay: 0.1 },
                      { icon: TrendingUp, label: "SIP Planning", color: "from-purple-500 to-purple-600", delay: 0.2 },
                      { icon: Shield, label: "Secure Process", color: "from-orange-500 to-orange-600", delay: 0.3 }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: item.delay }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700 text-center">{item.label}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-8 text-center"
                  >
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#FFB800] to-[#5f4411] text-white px-6 py-3 rounded-full shadow-lg">
                      <Users className="w-5 h-5" />
                      <span className="font-semibold"></span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 mb-6">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Our Services</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                What We Do
              </h2>
              <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Homobie is a next-gen financial platform built around home loans, loan against property loans, and smart repayment strategies powered by SIP plans. We serve real people with real goals—not just those who fit into boxes.
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full mt-6"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  icon: Home,
                  title: "Home Loan Advisory",
                  description: "Personalized guidance to help you find the right lender, the right amount, and the right terms",
                  gradient: "from-blue-500 to-cyan-500",
                  delay: 0
                },
                {
                  icon: Building,
                  title: "Loans Against Property",
                  description: "Unlock the value of your property for personal or business needs",
                  gradient: "from-green-500 to-emerald-500",
                  delay: 0.1
                },
                {
                  icon: TrendingUp,
                  title: "SIP-Linked Repayment Planning",
                  description: "An innovative way to repay your loan and build long-term wealth through monthly investments",
                  gradient: "from-purple-500 to-pink-500",
                  delay: 0.2
                },
                {
                  icon: Shield,
                  title: "Zero-Fee Digital Consultation",
                  description: "No cost, no pressure, no agents—just expert, honest advice",
                  gradient: "from-orange-500 to-red-500",
                  delay: 0.3
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: service.delay }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group relative"
                >
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl hover:bg-white/15 transition-all duration-500 shadow-2xl">
                    <div className="relative">
                      <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center group-hover:scale-125 transition-all duration-300">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-blue-100 leading-relaxed group-hover:text-white transition-colors duration-300">
                      {service.description}
                    </p>
                    <div className={`w-0 h-1 bg-gradient-to-r ${service.gradient} rounded-full mt-4 group-hover:w-full transition-all duration-500`}></div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-[#FFB800] to-[#5f4411] p-10 rounded-3xl text-white shadow-2xl border border-yellow-400/20 relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-pulse"></div>
                </div>
                
                <div className="relative z-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center space-x-3 mb-6"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-bold">Zero-Fee Consultation</h3>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white animate-pulse" />
                    </div>
                  </motion.div>
                  
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="bg-white/20 px-4 py-2 rounded-full">
                      <span className="text-lg font-semibold">100% unbiased</span>
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-full">
                      <span className="text-lg font-semibold">100% online</span>
                    </div>
                  </div>
                  
                  <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                    We partner directly with India's top banks and NBFCs, cutting out commission-driven agents and helping you find clarity instead of confusion.
                  </p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-8"
                  >
                    <Link href="/consultation">
                      <Button className="bg-white text-[#5f4411] hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                        Start Free Consultation
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-white via-amber-50 to-orange-50 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-full blur-3xl animate-bounce delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-300/20 rounded-full px-6 py-3 mb-6">
                <Rocket className="w-5 h-5 text-orange-600" />
                <span className="text-orange-600 font-medium">Our Mission</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#5f4411] to-orange-600 bg-clip-text text-transparent mb-6">
                Empowering Financial Dreams
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-[#5f4411] to-orange-600 mx-auto rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: BookOpen,
                  title: "Bridge Financial Literacy Gap",
                  description: "Bridge the financial literacy gap in home financing",
                  gradient: "from-blue-500 to-cyan-500",
                  delay: 0
                },
                {
                  icon: Shield,
                  title: "Eliminate Middleman Exploitation",
                  description: "Eliminate middleman exploitation through technology integration",
                  gradient: "from-green-500 to-emerald-500",
                  delay: 0.1
                },
                {
                  icon: Users,
                  title: "Empower Every Indian",
                  description: "Empower every Indian with a clear, personalized, and strategic loan repayment plan",
                  gradient: "from-purple-500 to-pink-500",
                  delay: 0.2
                }
              ].map((mission, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: mission.delay }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group relative"
                >
                  <div className="bg-white/70 backdrop-blur-sm border border-white/40 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/80">
                    <div className={`w-16 h-16 bg-gradient-to-r ${mission.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg mx-auto`}>
                      <mission.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center group-hover:text-orange-600 transition-colors duration-300">
                      {mission.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-center group-hover:text-gray-800 transition-colors duration-300">
                      {mission.description}
                    </p>
                    <div className={`w-0 h-1 bg-gradient-to-r ${mission.gradient} rounded-full mt-4 group-hover:w-full transition-all duration-500 mx-auto`}></div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-[#5f4411] to-[#34445f] p-10 rounded-3xl text-white shadow-2xl border border-amber-400/20 relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-pulse"></div>
                </div>
                
                <div className="relative z-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center space-x-3 mb-6"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Home className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold">
                      With Homobie, homeownership isn't just affordable—
                      <span className="text-[#FFB800] block mt-2">it's financially smart</span>
                    </h3>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white animate-pulse" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-3/4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-300/20 rounded-full px-6 py-3 mb-6">
                <Eye className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 font-medium">Our Vision</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                A Future of Financial Equality
              </h2>
              <p className="text-xl text-purple-100 max-w-4xl mx-auto leading-relaxed mb-6">
                We see a future where every Indian has equal access to:
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: Shield,
                  title: "Transparent Credit Options",
                  description: "Transparent credit options like loan against property and mortgage loans",
                  gradient: "from-blue-500 to-cyan-500",
                  delay: 0
                },
                {
                  icon: Calculator,
                  title: "Smart Planning Tools",
                  description: "Easy-to-use planning tools like the free EMI calculator online and SIP calculator online",
                  gradient: "from-green-500 to-emerald-500",
                  delay: 0.1
                },
                {
                  icon: Lightbulb,
                  title: "Clear Financial Guidance",
                  description: "Clear guidance on responsible borrowing, smart investing, and real-time financial decisions",
                  gradient: "from-orange-500 to-red-500",
                  delay: 0.2
                }
              ].map((vision, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: vision.delay }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group relative"
                >
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/15">
                    <div className={`w-16 h-16 bg-gradient-to-r ${vision.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg mx-auto`}>
                      <vision.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 text-center group-hover:text-purple-200 transition-colors duration-300">
                      {vision.title}
                    </h3>
                    <p className="text-purple-100 leading-relaxed text-center group-hover:text-white transition-colors duration-300">
                      {vision.description}
                    </p>
                    <div className={`w-0 h-1 bg-gradient-to-r ${vision.gradient} rounded-full mt-4 group-hover:w-full transition-all duration-500 mx-auto`}></div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-10 rounded-3xl text-white shadow-2xl border border-purple-400/20 relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-pulse"></div>
                </div>
                
                <div className="relative z-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center space-x-3 mb-6"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold">Our Ultimate Goal</h3>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white animate-pulse" />
                    </div>
                  </motion.div>
                  
                  <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                    Our goal is to empower borrowers to build wealth, repay smarter, and confidently manage everything from balance transfers to SIP investments—all in one place.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Homobie Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-teal-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-300/20 rounded-full px-6 py-3 mb-6">
                <CheckSquare className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
                Why Choose Homobie?
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Unlike traditional DSAs or lead-gen portals, Homobie is a human-first platform. No sales pressure. No hidden agendas. Just financial services that put you first.
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mt-6"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Handshake,
                  title: "Real Guidance, Not Sales",
                  description: "We explain loan terms and SIP strategies clearly—so you can choose, not be sold to.",
                  gradient: "from-blue-500 to-cyan-500",
                  delay: 0
                },
                {
                  icon: Shield,
                  title: "Zero Agents. No Hidden Fees.",
                  description: "What you see is what you get. We work with banks and NBFCs directly.",
                  gradient: "from-green-500 to-emerald-500",
                  delay: 0.1
                },
                {
                  icon: TrendingUp,
                  title: "Smarter Repayment with SIP + EMI",
                  description: "We help you plan SIP investments that grow while you repay, using our built-in SIP calculator and expert guidance.",
                  gradient: "from-purple-500 to-pink-500",
                  delay: 0.2
                },
                {
                  icon: Globe,
                  title: "100% Digital and Paper-Lite",
                  description: "From applying for a loan against property to exploring credit card balance transfers, everything is managed on your mobile.",
                  gradient: "from-orange-500 to-red-500",
                  delay: 0.3
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group relative"
                >
                  <div className="bg-white/70 backdrop-blur-sm border border-white/40 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/90">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <div className={`w-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-full mt-4 group-hover:w-full transition-all duration-500`}></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/3 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-700"></div>
          <div className="absolute top-2/3 right-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-300/20 rounded-full px-6 py-3 mb-6">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Our Community</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Who We Serve
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: UserCheck,
                  title: "Self-employed professionals",
                  gradient: "from-blue-500 to-cyan-500",
                  delay: 0
                },
                {
                  icon: Home,
                  title: "First-time homebuyers",
                  gradient: "from-green-500 to-emerald-500",
                  delay: 0.1
                },
                {
                  icon: ChartLine,
                  title: "Borrowers with thin or no credit history",
                  gradient: "from-purple-500 to-pink-500",
                  delay: 0.2
                },
                {
                  icon: Building,
                  title: "Property owners exploring loan against property loans",
                  gradient: "from-orange-500 to-red-500",
                  delay: 0.3
                },
                {
                  icon: IndianRupee,
                  title: "People interested in cash transfer, balance transfer credit card options",
                  gradient: "from-teal-500 to-cyan-500",
                  delay: 0.4
                },
                {
                  icon: TrendingUp,
                  title: "Long-term SIP investment enthusiasts",
                  gradient: "from-indigo-500 to-purple-500",
                  delay: 0.5
                }
              ].map((audience, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: audience.delay }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group relative"
                >
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/15 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${audience.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg mx-auto`}>
                      <audience.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-4 group-hover:text-blue-200 transition-colors duration-300">
                      {audience.title}
                    </h3>
                    <div className={`w-0 h-1 bg-gradient-to-r ${audience.gradient} rounded-full group-hover:w-full transition-all duration-500 mx-auto`}></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-44 h-44 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-300/20 rounded-full px-6 py-3 mb-6">
                <FileText className="w-5 h-5 text-orange-600" />
                <span className="text-orange-600 font-medium">Our Commitment</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
                Our Promise
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: CheckCircle,
                  title: "Transparent rates and real offers",
                  gradient: "from-blue-500 to-cyan-500",
                  delay: 0
                },
                {
                  icon: Shield,
                  title: "Data security and RBI-compliant partners",
                  gradient: "from-green-500 to-emerald-500",
                  delay: 0.1
                },
                {
                  icon: Home,
                  title: "Advisory you can trust, in your language",
                  gradient: "from-purple-500 to-pink-500",
                  delay: 0.2
                },
                {
                  icon: Calculator,
                  title: "Tools like EMI calculators and SIP plan calculators you can actually understand",
                  gradient: "from-orange-500 to-red-500",
                  delay: 0.3
                }
              ].map((promise, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: promise.delay }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group relative"
                >
                  <div className="bg-white/70 backdrop-blur-sm border border-white/40 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/90">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${promise.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg flex-shrink-0`}>
                        <promise.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                          {promise.title}
                        </h3>
                      </div>
                    </div>
                    <div className={`w-0 h-1 bg-gradient-to-r ${promise.gradient} rounded-full mt-4 group-hover:w-full transition-all duration-500`}></div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-10 rounded-3xl text-white shadow-2xl border border-orange-400/20 relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-pulse"></div>
                </div>
                
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center space-x-3 mb-6"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold">Built on Trust, Powered by Technology</h3>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white animate-pulse" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-gradient-to-r from-[#5f4411] to-[#34445f] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
               Join Us
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
      {/* <section className="py-16 bg-neutral-50">
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
      </section> */}

      {/* SIP Section */}
      {/* <section className="py-16 bg-white">
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
      {/* <section className="py-16 bg-primary/5">
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
      </section> */}

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
      {/* <section className="py-16 bg-gradient-to-r from-primary to-[#004080] text-white">
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
      </section> */}

      <ChatbotButton />
    </div>
  );
}
