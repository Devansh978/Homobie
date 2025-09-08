import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Feedback from "./Feedback/Feedback";
import InterestFreeLoans from "./InterestFreeLoans";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 20, y: 20 });
  const [amount, setAmount] = useState(250000);
  const [months, setMonths] = useState(12);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      //mouse position
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      setMousePosition({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const Particle = ({ size, x, y, delay }) => (
    <motion.div
      className="absolute rounded-full bg-white/3"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.4, 0],
        scale: [0, 1, 1.2],
        x: [0, Math.random() * 100 - 50],
        y: [0, Math.random() * 100 - 50],
      }}
      transition={{
        duration: Math.random() * 15 + 10,
        repeat: Infinity,
        repeatType: "reverse",
        delay,
        ease: "easeInOut",
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
      }}
    />
  );

  const GradientText = ({ children }) => (
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white bg-[length:200%_auto] animate-gradient">
      {children}
    </span>
  );
  const handleCalculate = () => {
    if (amount > 0 && months > 0) {
      setShowResult(true);
    }
  };
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black" />

        <div
          className="absolute pointer-events-none transition-all duration-200 ease-out"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "800px",
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(59, 130, 246, 0.3) 25%, rgba(147, 51, 234, 0.2) 50%, rgba(99, 102, 241, 0.1) 75%, transparent 100%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute pointer-events-none transition-all duration-300 ease-out"
          style={{
            left: `${mousePosition.x + 10}%`,
            top: `${mousePosition.y + 10}%`,
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.2) 40%, rgba(59, 130, 246, 0.15) 70%, transparent 90%)",
            filter: "blur(100px)",
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <Particle
              key={i}
              size={Math.random() * 6 + 2}
              x={Math.random() * 100}
              y={Math.random() * 100}
              delay={Math.random() * 5}
            />
          ))}
        </div>
      </div>

      {/* Glass Content Container */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section
          id="hero-section"
          className="relative min-h-screen flex items-center justify-center overflow-hidden mt-12 bg-gradient-to-br from-black via-gray-900 to-gray-800 opacity-90"
        >
          <div
            className="absolute pointer-events-none transition-all duration-100 ease-out"
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "600px",
              background:
                "radial-gradient(circle, #4f46e5 0%, #1f2937  30%, #111827  55%, rgba(0,0,128,0.2) 75%, transparent 100%)",
              filter: "blur(100px)",
              zIndex: 1,
            }}
          />

          <div
            className="absolute pointer-events-none transition-all duration-100 ease-out"
            style={{
              left: `${mousePosition.x + 5}%`,
              top: `${mousePosition.y + 5}%`,
              transform: "translate(-50%, -50%)",
              width: "400px",
              height: "400px",
              background:
                "radial-gradient(circle, 4f46e5 0%, #1f2937 45%, rgba(0,0,128,0.25) 65%, transparent 90%)",
              filter: "blur(80px)",
              zIndex: 1,
            }}
          />

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
                <motion.p
                  variants={itemVariants}
                  className="text-5xl md:text-[75px] font-bold mb-6 tracking-tight text-white"
                >
                  the home loan experience,
                </motion.p>
                <motion.p
                  variants={itemVariants}
                  className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter"
                >
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
                  boxShadow:
                    "0 20px 25px -5px rgba(255, 255, 255, 0.1), 0 10px 10px -5px rgba(255, 255, 255, 0.04)",
                }}
              >
                <motion.h1
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl md:text-2xl font-medium mb-3 leading-relaxed p-1 text-center tracking-tight text-white"
                >
                  Home loans, mortgage loans, SIP plans? — we speak fluent
                  finance, so you don't have to
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <Link href="/loan-application?type=home-loan">
                    <Button
                      variant="outline"
                      className="px-8 py-4 bg-white hover:bg-white/90 text-black text-lg font-bold rounded-xl backdrop-blur-md border border-white/20 shadow-lg hover:shadow-white/30 transition-all duration-300 group"
                    >
                      Smarter Loans start here
                      <MoveRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/consultation">
                    <Button
                      variant="outline"
                      className="px-8 py-4 bg-white hover:bg-white/90 text-black text-lg font-bold rounded-xl backdrop-blur-md border border-white/20 shadow-lg hover:shadow-white/30 transition-all duration-300 group"
                    >
                      Book Free Consultation
                      <MoveRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Custom cursor indicator */}
          <div
            className="absolute pointer-events-none w-4 h-4 border border-white/40 rounded-full transition-all duration-100 ease-out z-20"
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="absolute inset-0.5 bg-white/60 rounded-full" />
          </div>
        </section>
        <InterestFreeLoans />
        {/* Value Proposition Section */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl mb-16"
            >
              <div className="text-center mb-12">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white"
                >
                  We don't push products.
                  <br />
                  <GradientText>We match you to the right one.</GradientText>
                </motion.h2>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: BookOpen,
                    title: "We read your profile",
                    description:
                      "Then connect you to the Home loan that fits it best",
                    delay: 0.1,
                  },
                  {
                    icon: Users,
                    title: "For People Who Expect More",
                    description:
                      "And settle for less. Less paperwork. Less waiting. Less interest.",
                    delay: 0.2,
                  },
                  {
                    icon: Shield,
                    title: "Transparent Matching",
                    description:
                      "No hidden agendas, just the best financial products for your needs",
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
                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 h-full relative overflow-hidden border border-white/20 hover:border-white/30 transition-all duration-300">
                      <motion.div
                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-6"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <item.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3 text-white">
                        {item.title}
                      </h3>
                      <p className="text-white/80">{item.description}</p>

                      {/* Hover gradient overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"
                        animate={{
                          opacity: hoveredCard === index ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Product Offerings Section */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl"
            >
              <div className="text-center mb-16">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white"
                >
                  What We Offer
                </motion.h2>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Home,
                    title: "Home Loans Made Simple",
                    description:
                      "Move in faster. Stress less. Borrow smarter. Let us handle the paperwork — you focus on the housewarming.",
                    cta: "See how",
                    path: "/loan-application?type=home-loan",
                    delay: 0.1,
                  },
                  {
                    icon: Building,
                    title: "Loan Against Property",
                    description:
                      "Turn your property into potential. You've built assets — now let them work for you.",
                    cta: "See how",
                    path: "/loan-application?type=lap",
                    delay: 0.2,
                  },
                  {
                    icon: TrendingUp,
                    title: "Balance Transfer That Makes Sense",
                    description:
                      "Stop overpaying for being loyal. Lower your EMIs, transfer your loan balance, or top it up.",
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
                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 h-full overflow-hidden group border border-white/20 hover:border-white/30 transition-all duration-300">
                      <motion.div
                        className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                      >
                        <item.icon className="w-8 h-8 text-white" />
                      </motion.div>

                      <h3 className="text-xl font-bold mb-4 text-center text-white">
                        {item.title}
                      </h3>
                      <p className="text-white/80 mb-6 text-center">
                        {item.description}
                      </p>

                      <div className="text-center">
                        <a href={item.path}>
                          <Button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl backdrop-blur-md border border-white/30 shadow-lg hover:shadow-white/20 transition-all duration-300 group">
                            {item.cta}
                            <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
<Feedback />
        {/* SIP Feature Section */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden border border-white/20 relative"
            >
              {/* Animated gradient border */}
              <motion.div
                initial={{ x: "-100%" }}
                whileInView={{ x: "100%" }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                viewport={{ once: true }}
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
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
                    className="text-lg text-blue-200 font-medium mb-8"
                  >
                    With our platform, reinvest your SIPs strategically to
                    reduce your interest, shorten your tenure, and own your home
                    faster.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <a href="/sip">
                      <Button className="bg-white/20 hover:bg-white/30 text-white text-lg font-medium rounded-xl backdrop-blur-md border border-white/30 shadow-lg hover:shadow-white/20 transition-all duration-300 group">
                        Learn about SIP-linked loans
                        <MoveRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </a>
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
                      <Zap className="w-5 h-5 text-blue-300 mr-2" />
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
                          <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
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
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center backdrop-blur-xl bg-white/10 rounded-3xl p-12 shadow-2xl overflow-hidden border border-white/20 relative"
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
                <a href="/loan-application">
                  <Button className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white text-lg font-medium rounded-xl backdrop-blur-md border border-white/30 shadow-lg hover:shadow-white/20 transition-all duration-300 group">
                    Apply Now
                    <Sparkles className="w-5 h-5 ml-2 text-white group-hover:rotate-12 transition-transform" />
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
