// import React from "react";
// import { Link } from "wouter";
// import { ChatbotButton } from "@/components/layout/chatbot-button";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import {
//   Zap,
//   Percent,
//   UserCheck,
//   ChartLine,
//   Calendar,
//   DollarSign,
//   Home,
//   Building,
//   TrendingUp,
//   Shield,
//   Users,
//   Award,
//   CheckCircle,
//   ArrowRight,
//   Sparkles,
//   Target,
//   Heart,
//   Star,
//   Rocket,
//   BookOpen,
//   Eye,
//   Calculator,
//   Clock,
//   Lightbulb,
//   Globe,
//   Handshake,
//   FileText,
//   CheckSquare,
//   IndianRupee,
// } from "lucide-react";

// export default function HomePage() {
//   // Finance-optimized dark theme palette
//   const colors = {
//     dark: "#0F0F0F",          // Primary background (slightly lighter than pure black)
//     darker: "#080808",        // Secondary/darker surfaces
//     accent: "#2962FF",        // Trust-building blue (primary accent)
//     accentLight: "#448AFF",   // Lighter interactive blue
//     accentDark: "#0039CB",    // Darker blue for pressed states
//     textPrimary: "#F5F5F5",   // Main text (high contrast)
//     textSecondary: "#A0A0A0", // Secondary text (60% opacity)
//     cardBg: "#1A1A1A",        // Card backgrounds
//     cardBorder: "#2E2E2E",    // Subtle card borders
//     positive: "#4CAF50",      // Green for gains/profits
//     negative: "#F44336",      // Red for losses
//     warning: "#FFC107",       // Yellow for warnings
//     info: "#2196F3"          // Blue for informational items
//   };

//   return (
//     <div className="bg-[#0F0F0F] text-[#F5F5F5]">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-br from-[#080808] to-[#1A1A1A]">
//         <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
//           <div className="flex flex-col lg:flex-row items-center gap-8">
//             <div className="lg:w-1/2 space-y-6">
//               <motion.h1
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
//               >
//                 A simpler, <span className="text-[#448AFF]">smarter,</span> and
//                 fairer way to finance your future.
//               </motion.h1>

//               <motion.h4
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.1 }}
//                 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight"
//               >
//                 At <span className="text-[#448AFF]">Homobie,</span>
//               </motion.h4>

//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//                 className="text-base md:text-lg text-[#A0A0A0]"
//               >
//                 we're transforming the way India experiences financial
//                 access—starting with smarter home loans, flexible loan against
//                 property options, and wealth-building tools like SIP investment
//                 planning.
//               </motion.p>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//                 className="pt-4 flex flex-wrap gap-4"
//               >
//                 <Link href="/loan-application?type=home-loan">
//                   <Button className="px-6 py-3 bg-[#2962FF] text-white font-medium rounded-lg hover:bg-[#0039CB] transition-colors shadow-lg hover:shadow-[#2962FF]/30">
//                     Get Instant Approval
//                   </Button>
//                 </Link>
//                 <Link href="/consultation">
//                   <Button
//                     variant="outline"
//                     className="px-6 py-3 bg-transparent text-white border border-[#2E2E2E] rounded-lg hover:bg-[#1A1A1A] transition-colors"
//                   >
//                     Book Free Consultation
//                   </Button>
//                 </Link>
//               </motion.div>
//             </div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//               className="lg:w-1/2 lg:pl-8 xl:pl-12"
//             >
//               <img
//                 src="assets/5571a411-806b-406e-babc-48586ad632c2-removebg-preview.png"
//                 className="rounded-xl w-full max-w-lg mx-auto transform hover:scale-105 transition duration-500 ease-in-out shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
//                 alt="Financial solutions"
//               />
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Built for People Section */}
//       <section className="py-16 md:py-20 bg-[#080808] relative overflow-hidden">
//         <div className="container mx-auto px-4">
//           <div className="max-w-6xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="text-center mb-12 md:mb-16"
//             >
//               <div className="inline-flex items-center justify-center p-2 bg-[#1A1A1A] border border-[#2E2E2E] rounded-full mb-4 md:mb-6">
//                 <Home className="w-6 h-6 md:w-8 md:h-8 text-[#448AFF]" />
//               </div>
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
//                 Built for People, Not Just Paperwork
//               </h2>
//               <div className="w-20 h-1 bg-gradient-to-r from-[#2962FF] to-[#448AFF] mx-auto rounded-full"></div>
//             </motion.div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
//               <motion.div
//                 initial={{ opacity: 0, x: -50 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.8, delay: 0.2 }}
//                 viewport={{ once: true }}
//                 className="space-y-6 md:space-y-8"
//               >
//                 <div className="bg-[#1A1A1A] border border-[#2E2E2E] p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
//                   <p className="text-base md:text-lg text-[#A0A0A0] leading-relaxed mb-4 md:mb-6">
//                     In India, applying for a loan often means dealing with{" "}
//                     <span className="font-semibold text-[#F44336]">
//                       outdated systems
//                     </span>
//                     ,{" "}
//                     <span className="font-semibold text-[#F44336]">
//                       long waits
//                     </span>
//                     , and{" "}
//                     <span className="font-semibold text-[#F44336]">
//                       biased approvals
//                     </span>
//                     . Most platforms still cater to only high-credit-score,
//                     salaried applicants.
//                   </p>

//                   <div className="space-y-3 md:space-y-4">
//                     {[
//                       "But what if you're self-employed with variable income?",
//                       "What if you don't have a credit card or haven't taken loans before?",
//                       "What if you're financially capable but excluded by the system?",
//                     ].map((question, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, x: -20 }}
//                         whileInView={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.5, delay: 0.1 * index }}
//                         viewport={{ once: true }}
//                         className="flex items-start space-x-3 p-3 md:p-4 bg-[#2E2E2E] rounded-lg border-l-4 border-[#F44336]"
//                       >
//                         <div className="w-2 h-2 rounded-full bg-[#F44336] mt-2 animate-pulse"></div>
//                         <p className="font-medium text-[#F5F5F5]">{question}</p>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>

//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.6, delay: 0.4 }}
//                   viewport={{ once: true }}
//                   className="bg-gradient-to-r from-[#2962FF] to-[#448AFF] p-6 md:p-8 rounded-xl md:rounded-2xl text-white shadow-lg"
//                 >
//                   <div className="flex items-center space-x-3 mb-3 md:mb-4">
//                     <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />
//                     <h3 className="text-xl md:text-2xl font-bold">
//                       That's where Homobie steps in.
//                     </h3>
//                   </div>
//                   <p className="text-base md:text-lg text-white/90">
//                     We make things simple. Whether you're comparing mortgage
//                     loan options, calculating repayment with our EMI
//                     calculator, or exploring a balance transfer credit card,
//                     our platform is here to guide—not sell. We treat you like
//                     a person, not a profile.
//                   </p>
//                 </motion.div>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, x: 50 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.8, delay: 0.3 }}
//                 viewport={{ once: true }}
//                 className="relative"
//               >
//                 <div className="bg-[#1A1A1A] border border-[#2E2E2E] p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg">
//                   <div className="grid grid-cols-2 gap-4 md:gap-6">
//                     {[
//                       {
//                         icon: Home,
//                         label: "Home Loans",
//                         color: "from-blue-500 to-blue-600",
//                         delay: 0,
//                       },
//                       {
//                         icon: Building,
//                         label: "Property Loans",
//                         color: "from-green-500 to-green-600",
//                         delay: 0.1,
//                       },
//                       {
//                         icon: TrendingUp,
//                         label: "SIP Planning",
//                         color: "from-purple-500 to-purple-600",
//                         delay: 0.2,
//                       },
//                       {
//                         icon: Shield,
//                         label: "Secure Process",
//                         color: "from-orange-500 to-orange-600",
//                         delay: 0.3,
//                       },
//                     ].map((item, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         whileInView={{ opacity: 1, scale: 1 }}
//                         transition={{ duration: 0.5, delay: item.delay }}
//                         viewport={{ once: true }}
//                         whileHover={{ scale: 1.05 }}
//                         className="bg-[#2E2E2E] p-4 md:p-6 rounded-lg shadow-md border border-[#3E3E3E] hover:shadow-lg transition-all duration-300"
//                       >
//                         <div
//                           className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mb-2 md:mb-3 mx-auto`}
//                         >
//                           <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                         </div>
//                         <p className="text-xs md:text-sm font-semibold text-white text-center">
//                           {item.label}
//                         </p>
//                       </motion.div>
//                     ))}
//                   </div>

//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6, delay: 0.5 }}
//                     viewport={{ once: true }}
//                     className="mt-6 md:mt-8 text-center"
//                   >
//                     <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#2962FF] to-[#448AFF] text-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-md">
//                       <Users className="w-4 h-4 md:w-5 md:h-5" />
//                       <span className="text-sm md:text-base font-semibold">
//                         Trusted by Thousands
//                       </span>
//                     </div>
//                   </motion.div>
//                 </div>
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* What We Do Section */}
//       <section className="py-16 md:py-20 bg-[#0F0F0F] relative overflow-hidden">
//         <div className="container mx-auto px-4">
//           <div className="max-w-6xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="text-center mb-12 md:mb-16"
//             >
//               <div className="inline-flex items-center space-x-2 bg-[#1A1A1A] border border-[#2E2E2E] rounded-full px-4 py-2 md:px-6 md:py-3 mb-4 md:mb-6">
//                 <Target className="w-4 h-4 md:w-5 md:h-5 text-[#448AFF]" />
//                 <span className="text-sm md:text-base text-[#448AFF] font-medium">Our Services</span>
//               </div>
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
//                 What We Do
//               </h2>
//               <p className="text-base md:text-lg text-[#A0A0A0] max-w-4xl mx-auto leading-relaxed">
//                 Homobie is a next-gen financial platform built around home
//                 loans, loan against property loans, and smart repayment
//                 strategies powered by SIP plans. We serve real people with real
//                 goals—not just those who fit into boxes.
//               </p>
//               <div className="w-24 h-1 bg-gradient-to-r from-[#2962FF] to-[#448AFF] mx-auto rounded-full mt-4 md:mt-6"></div>
//             </motion.div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
//               {[
//                 {
//                   icon: Home,
//                   title: "Home Loan Advisory",
//                   description:
//                     "Personalized guidance to help you find the right lender, the right amount, and the right terms",
//                   gradient: "from-blue-500 to-cyan-500",
//                   delay: 0,
//                 },
//                 {
//                   icon: Building,
//                   title: "Loans Against Property",
//                   description:
//                     "Unlock the value of your property for personal or business needs",
//                   gradient: "from-green-500 to-emerald-500",
//                   delay: 0.1,
//                 },
//                 {
//                   icon: TrendingUp,
//                   title: "SIP-Linked Repayment Planning",
//                   description:
//                     "An innovative way to repay your loan and build long-term wealth through monthly investments",
//                   gradient: "from-purple-500 to-pink-500",
//                   delay: 0.2,
//                 },
//                 {
//                   icon: Shield,
//                   title: "Zero-Fee Digital Consultation",
//                   description:
//                     "No cost, no pressure, no agents—just expert, honest advice",
//                   gradient: "from-orange-500 to-red-500",
//                   delay: 0.3,
//                 },
//               ].map((service, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 50 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: service.delay }}
//                   viewport={{ once: true }}
//                   whileHover={{ scale: 1.03 }}
//                   className="group relative"
//                 >
//                   <div className="bg-[#1A1A1A] border border-[#2E2E2E] p-6 md:p-8 rounded-xl hover:bg-[#2E2E2E] transition-all duration-300 shadow-lg h-full">
//                     <div className="relative">
//                       <div
//                         className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-105 transition-all duration-300 shadow-md`}
//                       >
//                         <service.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                       </div>
//                       <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-[#2962FF] to-[#448AFF] rounded-full flex items-center justify-center">
//                         <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
//                       </div>
//                     </div>
//                     <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 group-hover:text-[#448AFF] transition-colors duration-300">
//                       {service.title}
//                     </h3>
//                     <p className="text-sm md:text-base text-[#A0A0A0] leading-relaxed group-hover:text-[#F5F5F5] transition-colors duration-300">
//                       {service.description}
//                     </p>
//                     <div
//                       className={`w-0 h-1 bg-gradient-to-r ${service.gradient} rounded-full mt-3 md:mt-4 group-hover:w-full transition-all duration-500`}
//                     ></div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               viewport={{ once: true }}
//               className="relative"
//             >
//               <div className="bg-gradient-to-r from-[#2962FF] to-[#448AFF] p-6 md:p-8 lg:p-10 rounded-xl md:rounded-2xl text-white shadow-lg">
//                 <div className="text-center">
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     whileInView={{ scale: 1 }}
//                     transition={{ duration: 0.6, delay: 0.6 }}
//                     viewport={{ once: true }}
//                     className="inline-flex items-center space-x-3 mb-4 md:mb-6"
//                   >
//                     <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
//                       <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                     </div>
//                     <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">
//                       Zero-Fee Consultation
//                     </h3>
//                     <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
//                       <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                     </div>
//                   </motion.div>

//                   <div className="flex flex-wrap items-center justify-center gap-3 mb-4 md:mb-6">
//                     <div className="bg-white/20 px-3 py-1 md:px-4 md:py-2 rounded-full">
//                       <span className="text-sm md:text-base font-semibold">
//                         100% unbiased
//                       </span>
//                     </div>
//                     <div className="bg-white/20 px-3 py-1 md:px-4 md:py-2 rounded-full">
//                       <span className="text-sm md:text-base font-semibold">100% online</span>
//                     </div>
//                   </div>

//                   <p className="text-base md:text-lg text-white/90 max-w-4xl mx-auto leading-relaxed mb-4 md:mb-6">
//                     We partner directly with India's top banks and NBFCs,
//                     cutting out commission-driven agents and helping you find
//                     clarity instead of confusion.
//                   </p>

//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6, delay: 0.8 }}
//                     viewport={{ once: true }}
//                     className="mt-4 md:mt-6"
//                   >
//                     <Link href="/consultation">
//                       <Button className="bg-white text-[#0F0F0F] hover:bg-gray-100 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300">
//                         Start Free Consultation
//                         <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
//                       </Button>
//                     </Link>
//                   </motion.div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Mission Section */}
//       <section className="py-16 md:py-20 bg-[#080808] relative overflow-hidden">
//         <div className="container mx-auto px-4">
//           <div className="max-w-6xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="text-center mb-12 md:mb-16"
//             >
//               <div className="inline-flex items-center space-x-2 bg-[#1A1A1A] border border-[#2E2E2E] rounded-full px-4 py-2 md:px-6 md:py-3 mb-4 md:mb-6">
//                 <Rocket className="w-4 h-4 md:w-5 md:h-5 text-[#448AFF]" />
//                 <span className="text-sm md:text-base text-[#448AFF] font-medium">Our Mission</span>
//               </div>
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
//                 Empowering Financial Dreams
//               </h2>
//               <div className="w-24 h-1 bg-gradient-to-r from-[#2962FF] to-[#448AFF] mx-auto rounded-full"></div>
//             </motion.div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
//               {[
//                 {
//                   icon: BookOpen,
//                   title: "Bridge Financial Literacy Gap",
//                   description:
//                     "Bridge the financial literacy gap in home financing",
//                   gradient: "from-blue-500 to-cyan-500",
//                   delay: 0,
//                 },
//                 {
//                   icon: Shield,
//                   title: "Eliminate Middleman Exploitation",
//                   description:
//                     "Eliminate middleman exploitation through technology integration",
//                   gradient: "from-green-500 to-emerald-500",
//                   delay: 0.1,
//                 },
//                 {
//                   icon: Users,
//                   title: "Empower Every Indian",
//                   description:
//                     "Empower every Indian with a clear, personalized, and strategic loan repayment plan",
//                   gradient: "from-purple-500 to-pink-500",
//                   delay: 0.2,
//                 },
//               ].map((mission, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 50 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: mission.delay }}
//                   viewport={{ once: true }}
//                   whileHover={{ scale: 1.03 }}
//                   className="group relative"
//                 >
//                   <div className="bg-[#1A1A1A] border border-[#2E2E2E] p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#2E2E2E] h-full">
//                     <div
//                       className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${mission.gradient} rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-105 transition-all duration-300 shadow-md mx-auto`}
//                     >
//                       <mission.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                     </div>
//                     <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 text-center group-hover:text-[#448AFF] transition-colors duration-300">
//                       {mission.title}
//                     </h3>
//                     <p className="text-sm md:text-base text-[#A0A0A0] leading-relaxed text-center group-hover:text-[#F5F5F5] transition-colors duration-300">
//                       {mission.description}
//                     </p>
//                     <div
//                       className={`w-0 h-1 bg-gradient-to-r ${mission.gradient} rounded-full mt-3 md:mt-4 group-hover:w-full transition-all duration-500 mx-auto`}
//                     ></div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               viewport={{ once: true }}
//               className="relative"
//             >
//               <div className="bg-gradient-to-r from-[#080808] to-[#1A1A1A] p-6 md:p-8 lg:p-10 rounded-xl md:rounded-2xl text-white shadow-lg border border-[#448AFF]/20">
//                 <div className="text-center">
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     whileInView={{ scale: 1 }}
//                     transition={{ duration: 0.6, delay: 0.6 }}
//                     viewport={{ once: true }}
//                     className="inline-flex items-center space-x-3 mb-4 md:mb-6"
//                   >
//                     <div className="w-10 h-10 md:w-12 md:h-12 bg-[#448AFF]/20 rounded-full flex items-center justify-center">
//                       <Home className="w-5 h-5 md:w-6 md:h-6 text-[#448AFF]" />
//                     </div>
//                     <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">
//                       With Homobie, homeownership isn't just affordable—
//                       <span className="text-[#448AFF] block mt-2">
//                         it's financially smart
//                       </span>
//                     </h3>
//                     <div className="w-10 h-10 md:w-12 md:h-12 bg-[#448AFF]/20 rounded-full flex items-center justify-center">
//                       <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-[#448AFF]" />
//                     </div>
//                   </motion.div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Vision Section */}
//       <section className="py-16 md:py-20 bg-[#0F0F0F] relative overflow-hidden">
//         <div className="container mx-auto px-4">
//           <div className="max-w-6xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="text-center mb-12 md:mb-16"
//             >
//               <div className="inline-flex items-center space-x-2 bg-[#1A1A1A] border border-[#2E2E2E] rounded-full px-4 py-2 md:px-6 md:py-3 mb-4 md:mb-6">
//                 <Eye className="w-4 h-4 md:w-5 md:h-5 text-[#448AFF]" />
//                 <span className="text-sm md:text-base text-[#448AFF] font-medium">Our Vision</span>
//               </div>
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
//                 A Future of Financial Equality
//               </h2>
//               <p className="text-base md:text-lg text-[#A0A0A0] max-w-4xl mx-auto leading-relaxed mb-4 md:mb-6">
//                 We see a future where every Indian has equal access to:
//               </p>
//               <div className="w-24 h-1 bg-gradient-to-r from-[#2962FF] to-[#448AFF] mx-auto rounded-full"></div>
//             </motion.div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
//               {[
//                 {
//                   icon: Shield,
//                   title: "Transparent Credit Options",
//                   description:
//                     "Transparent credit options like loan against property and mortgage loans",
//                   gradient: "from-blue-500 to-cyan-500",
//                   delay: 0,
//                 },
//                 {
//                   icon: Calculator,
//                   title: "Smart Planning Tools",
//                   description:
//                     "Easy-to-use planning tools like the free EMI calculator online and SIP calculator online",
//                   gradient: "from-green-500 to-emerald-500",
//                   delay: 0.1,
//                 },
//                 {
//                   icon: Lightbulb,
//                   title: "Clear Financial Guidance",
//                   description:
//                     "Clear guidance on responsible borrowing, smart investing, and real-time financial decisions",
//                   gradient: "from-orange-500 to-red-500",
//                   delay: 0.2,
//                 },
//               ].map((vision, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 50 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: vision.delay }}
//                   viewport={{ once: true }}
//                   whileHover={{ scale: 1.03 }}
//                   className="group relative"
//                 >
//                   <div className="bg-[#1A1A1A] border border-[#2E2E2E] p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#2E2E2E] h-full">
//                     <div
//                       className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${vision.gradient} rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-105 transition-all duration-300 shadow-md mx-auto`}
//                     >
//                       <vision.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                     </div>
//                     <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 text-center group-hover:text-[#448AFF] transition-colors duration-300">
//                       {vision.title}
//                     </h3>
//                     <p className="text-sm md:text-base text-[#A0A0A0] leading-relaxed text-center group-hover:text-[#F5F5F5] transition-colors duration-300">
//                       {vision.description}
//                     </p>
//                     <div
//                       className={`w-0 h-1 bg-gradient-to-r ${vision.gradient} rounded-full mt-3 md:mt-4 group-hover:w-full transition-all duration-500 mx-auto`}
//                     ></div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               viewport={{ once: true }}
//               className="relative"
//             >
//               <div className="bg-gradient-to-r from-[#2962FF] to-[#448AFF] p-6 md:p-8 lg:p-10 rounded-xl md:rounded-2xl text-white shadow-lg">
//                 <div className="text-center">
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     whileInView={{ scale: 1 }}
//                     transition={{ duration: 0.6, delay: 0.6 }}
//                     viewport={{ once: true }}
//                     className="inline-flex items-center space-x-3 mb-4 md:mb-6"
//                   >
//                     <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
//                       <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                     </div>
//                     <h3 className="text-xl md:text-2xl font-bold">
//                       Our Ultimate Goal
//                     </h3>
//                     <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
//                       <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                     </div>
//                   </motion.div>

//                   <p className="text-base md:text-lg text-white/90 max-w-4xl mx-auto leading-relaxed">
//                     Our goal is to empower borrowers to build wealth, repay
//                     smarter, and confidently manage everything from balance
//                     transfers to SIP investments—all in one place.
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Why Choose Homobie Section */}
//       <section className="py-16 md:py-20 bg-[#080808] relative overflow-hidden">
//         <div className="container mx-auto px-4">
//           <div className="max-w-6xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="text-center mb-12 md:mb-16"
//             >
//               <div className="inline-flex items-center space-x-2 bg-[#1A1A1A] border border-[#2E2E2E] rounded-full px-4 py-2 md:px-6 md:py-3 mb-4 md:mb-6">
//                 <CheckSquare className="w-4 h-4 md:w-5 md:h-5 text-[#448AFF]" />
//                 <span className="text-sm md:text-base text-[#448AFF] font-medium">
//                   Why Choose Us
//                 </span>
//               </div>
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
//                 Why Choose Homobie?
//               </h2>
//               <p className="text-base md:text-lg text-[#A0A0A0] max-w-4xl mx-auto leading-relaxed">
//                 Unlike traditional DSAs or lead-gen portals, Homobie is a
//                 human-first platform. No sales pressure. No hidden agendas. Just
//                 financial services that put you first.
//               </p>
//               <div className="w-24 h-1 bg-gradient-to-r from-[#2962FF] to-[#448AFF] mx-auto rounded-full mt-4 md:mt-6"></div>
//             </motion.div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
//               {[
//                 {
//                   icon: Handshake,
//                   title: "Real Guidance, Not Sales",
//                   description:
//                     "We explain loan terms and SIP strategies clearly—so you can choose, not be sold to.",
//                   gradient: "from-blue-500 to-cyan-500",
//                   delay: 0,
//                 },
//                 {
//                   icon: Shield,
//                   title: "Zero Agents. No Hidden Fees.",
//                   description:
//                     "What you see is what you get. We work with banks and NBFCs directly.",
//                   gradient: "from-green-500 to-emerald-500",
//                   delay: 0.1,
//                 },
//                 {
//                   icon: TrendingUp,
//                   title: "Smarter Repayment with SIP + EMI",
//                   description:
//                     "We help you plan SIP investments that grow while you repay, using our built-in SIP calculator and expert guidance.",
//                   gradient: "from-purple-500 to-pink-500",
//                   delay: 0.2,
//                 },
//                 {
//                   icon: Globe,
//                   title: "100% Digital and Paper-Lite",
//                   description:
//                     "From applying for a loan against property to exploring credit card balance transfers, everything is managed on your mobile.",
//                   gradient: "from-orange-500 to-red-500",
//                   delay: 0.3,
//                 },
//               ].map((feature, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 50 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: feature.delay }}
//                   viewport={{ once: true }}
//                   whileHover={{ scale: 1.03 }}
//                   className="group relative"
//                 >
//                   <div className="bg-[#1A1A1A] border border-[#2E2E2E] p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#2E2E2E] h-full">
//                     <div className="flex items-start space-x-4">
//                       <div
//                         className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-md flex-shrink-0`}
//                       >
//                         <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 group-hover:text-[#448AFF] transition-colors duration-300">
//                           {feature.title}
//                         </h3>
//                         <p className="text-sm md:text-base text-[#A0A0A0] leading-relaxed group-hover:text-[#F5F5F5] transition-colors duration-300">
//                           {feature.description}
//                         </p>
//                       </div>
//                     </div>
//                     <div
//                       className={`w-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-full mt-3 md:mt-4 group-hover:w-full transition-all duration-500`}
//                     ></div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Who We Serve Section */}
//       <section className="py-16 md:py-20 bg-[#0F0F0F] relative overflow-hidden">
//         <div className="container mx-auto px-4">
//           <div className="max-w-6xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="text-center mb-12 md:mb-16"
//             >
//               <div className="inline-flex items-center space-x-2 bg-[#1A1A1A] border border-[#2E2E2E] rounded-full px-4 py-2 md:px-6 md:py-3 mb-4 md:mb-6">
//                 <Users className="w-4 h-4 md:w-5 md:h-5 text-[#448AFF]" />
//                 <span className="text-sm md:text-base text-[#448AFF] font-medium">
//                   Our Community
//                 </span>
//               </div>
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
//                 Who We Serve
//               </h2>
//               <div className="w-24 h-1 bg-gradient-to-r from-[#2962FF] to-[#448AFF] mx-auto rounded-full"></div>
//             </motion.div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//               {[
//                 {
//                   icon: UserCheck,
//                   title: "Self-employed professionals",
//                   gradient: "from-blue-500 to-cyan-500",
//                   delay: 0,
//                 },
//                 {
//                   icon: Home,
//                   title: "First-time homebuyers",
//                   gradient: "from-green-500 to-emerald-500",
//                   delay: 0.1,
//                 },
//                 {
//                   icon: ChartLine,
//                   title: "Borrowers with thin or no credit history",
//                   gradient: "from-purple-500 to-pink-500",
//                   delay: 0.2,
//                 },
//                 {
//                   icon: Building,
//                   title:
//                     "Property owners exploring loan against property loans",
//                   gradient: "from-orange-500 to-red-500",
//                   delay: 0.3,
//                 },
//                 {
//                   icon: IndianRupee,
//                   title:
//                     "People interested in cash transfer, balance transfer credit card options",
//                   gradient: "from-teal-500 to-cyan-500",
//                   delay: 0.4,
//                 },
//                 {
//                   icon: TrendingUp,
//                   title: "Long-term SIP investment enthusiasts",
//                   gradient: "from-indigo-500 to-purple-500",
//                   delay: 0.5,
//                 },
//               ].map((audience, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 50 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: audience.delay }}
//                   viewport={{ once: true }}
//                   whileHover={{ scale: 1.03 }}
//                   className="group relative"
//                 >
//                   <div className="bg-[#1A1A1A] border border-[#2E2E2E] p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#2E2E2E] text-center h-full">
//                     <div
//                       className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${audience.gradient} rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-105 transition-all duration-300 shadow-md mx-auto`}
//                     >
//                       <audience.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                     </div>
//                     <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4 group-hover:text-[#448AFF] transition-colors duration-300">
//                       {audience.title}
//                     </h3>
//                     <div
//                       className={`w-0 h-1 bg-gradient-to-r ${audience.gradient} rounded-full group-hover:w-full transition-all duration-500 mx-auto`}
//                     ></div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Our Promise Section */}
//       <section className="py-16 md:py-20 bg-[#080808] relative overflow-hidden">
//         <div className="container mx-auto px-4">
//           <div className="max-w-6xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="text-center mb-12 md:mb-16"
//             >
//               <div className="inline-flex items-center space-x-2 bg-[#1A1A1A] border border-[#2E2E2E] rounded-full px-4 py-2 md:px-6 md:py-3 mb-4 md:mb-6">
//                 <FileText className="w-4 h-4 md:w-5 md:h-5 text-[#448AFF]" />
//                 <span className="text-sm md:text-base text-[#448AFF] font-medium">
//                   Our Commitment
//                 </span>
//               </div>
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
//                 Our Promise
//               </h2>
//               <div className="w-24 h-1 bg-gradient-to-r from-[#2962FF] to-[#448AFF] mx-auto rounded-full"></div>
//             </motion.div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
//               {[
//                 {
//                   icon: CheckCircle,
//                   title: "Transparent rates and real offers",
//                   gradient: "from-blue-500 to-cyan-500",
//                   delay: 0,
//                 },
//                 {
//                   icon: Shield,
//                   title: "Data security and RBI-compliant partners",
//                   gradient: "from-green-500 to-emerald-500",
//                   delay: 0.1,
//                 },
//                 {
//                   icon: Home,
//                   title: "Advisory you can trust, in your language",
//                   gradient: "from-purple-500 to-pink-500",
//                   delay: 0.2,
//                 },
//                 {
//                   icon: Calculator,
//                   title:
//                     "Tools like EMI calculators and SIP plan calculators you can actually understand",
//                   gradient: "from-orange-500 to-red-500",
//                   delay: 0.3,
//                 },
//               ].map((promise, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 50 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: promise.delay }}
//                   viewport={{ once: true }}
//                   whileHover={{ scale: 1.03 }}
//                   className="group relative"
//                 >
//                   <div className="bg-[#1A1A1A] border border-[#2E2E2E] p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#2E2E2E]">
//                     <div className="flex items-start space-x-4">
//                       <div
//                         className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${promise.gradient} rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-md flex-shrink-0`}
//                       >
//                         <promise.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-base md:text-lg font-bold text-white group-hover:text-[#448AFF] transition-colors duration-300">
//                           {promise.title}
//                         </h3>
//                       </div>
//                     </div>
//                     <div
//                       className={`w-0 h-1 bg-gradient-to-r ${promise.gradient} rounded-full mt-3 md:mt-4 group-hover:w-full transition-all duration-500`}
//                     ></div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8, delay: 0.5 }}
//               viewport={{ once: true }}
//               className="mt-12 md:mt-16 text-center"
//             >
//               <div className="bg-gradient-to-r from-[#2962FF] to-[#448AFF] p-6 md:p-8 lg:p-10 rounded-xl md:rounded-2xl text-white shadow-lg">
//                 <div className="text-center">
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     whileInView={{ scale: 1 }}
//                     transition={{ duration: 0.6, delay: 0.7 }}
//                     viewport={{ once: true }}
//                     className="inline-flex items-center space-x-3 mb-4 md:mb-6"
//                   >
//                     <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
//                       <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                     </div>
//                     <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">
//                       Built on Trust, Powered by Technology
//                     </h3>
//                     <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
//                       <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                     </div>
//                   </motion.div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Join Us Section */}
//       <section className="py-12 md:py-16 bg-gradient-to-r from-[#080808] to-[#0F0F0F] text-white">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8"
//             >
//               Join Us
//             </motion.h2>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//               className="space-y-4 md:space-y-6 mb-8 md:mb-12"
//             >
//               <p className="text-lg md:text-xl">
//                 India's borrowers deserve better—and Homobie is building that
//                 future.
//               </p>
//               <p className="text-base md:text-lg text-[#A0A0A0]">
//                 If you've ever felt excluded, misinformed, or unsure, we're here
//                 to change that.
//               </p>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="bg-[#1A1A1A] border border-[#2E2E2E] p-6 md:p-8 rounded-xl mb-6 md:mb-8"
//             >
//               <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[#448AFF]">
//                 BOOK YOUR FREE LOAN CONSULTATION TODAY
//               </h3>
//               <p className="text-base md:text-lg mb-4 md:mb-6">
//                 and take the first step toward smarter financial freedom.
//               </p>
//               <Link href="/consultation">
//                 <Button className="px-6 py-3 md:px-8 md:py-4 bg-[#448AFF] text-white font-semibold text-base md:text-lg rounded-lg hover:bg-[#2962FF] transition-colors shadow-md hover:shadow-lg">
//                   Let's Get Started →
//                 </Button>
//               </Link>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       <ChatbotButton />
//     </div>
//   );
// }

//
import React, { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calculator,
  Home,
  Building,
  TrendingUp,
  Shield,
  Users,
  BookOpen,
  Handshake,
  Zap,
  Sparkles,
  CheckCircle,
  ChevronDown,
  Circle,
  MoveRight,
} from "lucide-react";

// Animation variants for consistent reuse
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8
    }
  }
};

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Floating particles component
  const Particle = ({ size, x, y, delay }) => (
    <motion.div
      className="absolute rounded-full bg-white/5"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.2, 0],
        scale: [0, 1, 1.2],
        x: [0, Math.random() * 100 - 50],
        y: [0, Math.random() * 100 - 50]
      }}
      transition={{
        duration: Math.random() * 15 + 10,
        repeat: Infinity,
        repeatType: "reverse",
        delay,
        ease: "easeInOut"
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
      }}
    />
  );

  // Gradient text component
  const GradientText = ({ children }) => (
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white bg-[length:200%_auto] animate-gradient">
      {children}
    </span>
  );

  return (
    <div className="bg-black text-white overflow-hidden relative font-sans">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <Particle
            key={i}
            size={Math.random() * 8 + 2}
            x={Math.random() * 100}
            y={Math.random() * 100}
            delay={Math.random() * 5}
          />
        ))}
      </div>
<div>
  
</div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800 opacity-90" />
        </motion.div>

        <div className="container mx-auto px-4 z-10 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div className="mb-12" variants={containerVariants}>
              <motion.p variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                The Home Loans Experience,
              </motion.p>
              <motion.p variants={itemVariants} className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter">
                <GradientText>REIMAGINED.</GradientText>
              </motion.p>
            </motion.div>

            {/* Glass card with hover effect */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 md:p-12 shadow-2xl mb-12 border border-white/10"
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(255, 255, 255, 0.1), 0 10px 10px -5px rgba(255, 255, 255, 0.04)"
              }}
            >
              <motion.h1
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl md:text-0xl font-medium mb-3 leading-relaxed"
              >
                Home loans, mortgage loans, SIP plans? —{" "}
                <span className="font-bold">we speak fluent finance,</span> so
                you don't have to.
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link href="/loan-application?type=home-loan">
                  <Button className="px-8 py-4 bg-white hover:bg-white/90 text-black text-lg font-medium rounded-xl backdrop-blur-md border border-white/20 shadow-lg hover:shadow-white/30 transition-all duration-300 group">
                    Smarter loans start here
                    <MoveRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/consultation">
                  <Button
                    variant="outline"
                    className="px-8 py-4 bg-white hover:bg-white/90 text-black text-lg font-medium rounded-xl backdrop-blur-md border border-white/20 shadow-lg hover:shadow-white/30 transition-all duration-300 group">
                    Book Free Consultation
                    <MoveRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
            >
              We don't push products.
              <br />
              <GradientText>We match you to the right one.</GradientText>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8 }}
              className="w-32 h-1 bg-gradient-to-r from-white to-gray-300 mx-auto rounded-full"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "We read your profile",
                description: "Then connect you to the Home loan that fits it best",
                delay: 0.1,
              },
              {
                icon: Users,
                title: "For People Who Expect More",
                description: "And settle for less. Less paperwork. Less waiting. Less interest.",
                delay: 0.2,
              },
              {
                icon: Shield,
                title: "Transparent Matching",
                description: "No hidden agendas, just the best financial products for your needs",
                delay: 0.3,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: item.delay }}
                viewport={{ once: true }}
                className="relative"
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                {/* Hover effect background */}
                <motion.div
                  className="absolute inset-0 backdrop-blur-xl bg-white/10 rounded-2xl"
                  animate={{
                    opacity: hoveredCard === index ? 1 : 0,
                    scale: hoveredCard === index ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />

                <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 h-full relative overflow-hidden border border-white/10">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-white/70">{item.description}</p>

                  {/* Floating circles on hover */}
                  <AnimatePresence>
                    {hoveredCard === index && (
                      <>
                        <motion.div
                          className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ delay: 0.1 }}
                        />
                        <motion.div
                          className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-white/10"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ delay: 0.2 }}
                        />
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Offerings Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
            >
              What We Offer
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8 }}
              className="w-32 h-1 bg-gradient-to-r from-white to-gray-300 mx-auto rounded-full"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Home,
                title: "Home Loans Made Simple",
                description: "Move in faster. Stress less. Borrow smarter. Let us handle the paperwork — you focus on the housewarming.",
                cta: "See how",
                path: "/loan-application?type=home-loan",
                delay: 0.1,
              },
              {
                icon: Building,
                title: "Loan Against Property",
                description: "Turn your property into potential. You've built assets — now let them work for you.",
                cta: "See how",
                path: "/loan-application?type=lap",
                delay: 0.2,
              },
              {
                icon: TrendingUp,
                title: "Balance Transfer That Makes Sense",
                description: "Stop overpaying for being loyal. Lower your EMIs, transfer your loan balance, or top it up.",
                cta: "See how",
                path: "/loan-application?type=bt-topup",
                delay: 0.3,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: item.delay }}
                viewport={{ once: true }}
                className="relative"
                onHoverStart={() => setHoveredCard(index + 3)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 h-full overflow-hidden group border border-white/10">
                  <motion.div
                    className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 mx-auto"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-bold mb-4 text-center text-white">{item.title}</h3>
                  <p className="text-white/70 mb-6 text-center">{item.description}</p>

                  <div className="text-center">
                    <Link href={item.path}>
                      <Button
                        variant="ghost"
                        className="px-8 py-4 bg-white hover:bg-white/90 text-black text-lg font-medium rounded-xl backdrop-blur-md border border-white/20 shadow-lg hover:shadow-white/30 transition-all duration-300 group"
                      >
                        {item.cta}
                        <MoveRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SIP Feature Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-6xl mx-auto backdrop-blur-2xl bg-white/5 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden border border-white/10"
          >
            {/* Animated gradient border */}
            <motion.div
              initial={{ x: "-100%" }}
              whileInView={{ x: "100%" }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              viewport={{ once: true }}
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />

            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="md:w-1/2"
              >
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold mb-6 text-white"
                >
                  Make your SIPs work for your home loan
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-white/80 mb-6"
                >
                  Your SIPs aren't just growing wealth — they could be quietly
                  paying off your home loan too.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white font-medium mb-8"
                >
                  With our platform, reinvest your SIPs strategically to reduce your
                  interest, shorten your tenure, and own your home faster.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link href="/sip">
                    <Button className="bg-white hover:bg-white/90 text-black text-lg font-medium rounded-xl backdrop-blur-md border border-white/20 shadow-lg hover:shadow-white/30 transition-all duration-300 group">
                      Learn about SIP-linked loans
                      <MoveRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="md:w-1/2"
              >
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-6 flex items-center text-white">
                    <Zap className="w-5 h-5 text-white mr-2" />
                    How it works:
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Link your existing SIPs or start new ones",
                      "We optimize your investments to align with loan repayment",
                      "Watch your home loan reduce faster while building wealth",
                      "Complete transparency with no hidden fees",
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="flex items-start text-white/80"
                      >
                        <CheckCircle className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center backdrop-blur-2xl bg-white/5 rounded-3xl p-12 shadow-2xl overflow-hidden border border-white/10"
          >
            {/* Floating elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-white/10"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-white/10"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
            >
              Ready to borrow better?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
            >
              Because smarter lending starts with smarter matching. Let's make
              your next financial move your smartest one yet.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/loan-application">
                <Button className="px-8 py-4 bg-white hover:bg-white/90 text-black text-lg font-medium rounded-xl backdrop-blur-md border border-white/20 shadow-lg hover:shadow-white/30 transition-all duration-300 group">
                  Apply Now
                  <Sparkles className="w-5 h-5 ml-2 text-black group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}