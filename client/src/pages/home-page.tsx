import React, { useState, useEffect, memo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Feedback from "./Feedback/Feedback";
import SipCalculator from "./SipCalculator/SipCalculator";
import { useAuth } from "../hooks/use-auth";
import { Banner } from "./Banner.jsx";
import { Industries } from "./Industries.jsx";
import { PartnerBanks } from "./PartnerBanks.jsx";
const MemoizedSipCalculator = memo(SipCalculator);
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
  LogOut,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const floatAnimation = {
  y: [0, -20, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 20, y: 20 });
  const [amount, setAmount] = useState(250000);
  const [months, setMonths] = useState(12);
  const [showResult, setShowResult] = useState(false);
  const { logoutMutation, user } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e) => {
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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const Particle = ({ size, x, y, delay }) => (
    <motion.div
      className="absolute rounded-full bg-white/3"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.5, 0],
        scale: [0, 1, 1.3],
        x: [0, Math.random() * 120 - 60],
        y: [0, Math.random() * 120 - 60],
      }}
      transition={{
        duration: Math.random() * 18 + 12,
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
        filter: "blur(1px)",
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
      <Banner />
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black" />

        {/* Enhanced floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <Particle
              key={i}
              size={Math.random() * 8 + 2}
              x={Math.random() * 100}
              y={Math.random() * 100}
              delay={Math.random() * 5}
            />
          ))}
        </div>

        {/* Ambient glow effects */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Glass Content Container */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section
          id="hero-section"
          className="relative min-h-screen flex items-center justify-center overflow-hidden mt-12 bg-black opacity-90"
        >
          <div className="container mx-auto px-4 z-10 relative flex items-center justify-between">
            {/* Left*/}
            <div className="w-[75%] flex-1 flex flex-col items-center text-center md:items-start md:text-center">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto"
              >
                <motion.div className="mb-12" variants={containerVariants}>
                  {/* Mobile Layout */}
                  <div className="block md:hidden">
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center justify-center mb-2"
                    >
                      <motion.div
                        animate={pulseAnimation}
                        className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0"
                      >
                        <div className="w-full h-1/3 bg-[#FF9933]"></div>
                        <div className="w-full h-1/3 bg-white flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full border-2 border-[#000080] relative">
                            <div className="absolute inset-0">
                              {[...Array(24)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="absolute w-px h-3 bg-[#000080] left-1/2 top-1/2 origin-bottom"
                                  style={{
                                    transform: `translate(-50%, -100%) rotate(${
                                      i * 15
                                    }deg)`,
                                  }}
                                  animate={{
                                    opacity: [0.5, 1, 0.5],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.05,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="w-full h-1/3 bg-[#138808]"></div>
                      </motion.div>
                    </motion.div>

                    <motion.p
                      variants={itemVariants}
                      className="text-4xl font-bold mb-4 tracking-tight text-white"
                    >
                      India's home loan experience,
                    </motion.p>
                    <motion.p
                      variants={itemVariants}
                      className="text-5xl font-bold mb-8 tracking-tighter"
                    >
                      <GradientText>REIMAGINED.</GradientText>
                    </motion.p>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:block">
                    <motion.p
                      variants={itemVariants}
                      className="text-5xl md:text-[75px] font-bold mb-6 tracking-tight text-white mt-4 flex items-center justify-center flex-wrap gap-4"
                    >
                      <span className="flex items-center gap-4">
                        <motion.div
                          animate={pulseAnimation}
                          className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0"
                        >
                          <div className="w-full h-1/3 bg-[#FF9933]"></div>
                          <div className="w-full h-1/3 bg-white flex items-center justify-center">
                            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full border-2 border-[#000080] relative">
                              <div className="absolute inset-0">
                                {[...Array(24)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-px h-3 md:h-3.5 bg-[#000080] left-1/2 top-1/2 origin-bottom"
                                    style={{
                                      transform: `translate(-50%, -100%) rotate(${
                                        i * 15
                                      }deg)`,
                                    }}
                                    animate={{
                                      opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      delay: i * 0.05,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="w-full h-1/3 bg-[#138808]"></div>
                        </motion.div>
                        India's
                      </span>
                      home loan experience,
                    </motion.p>
                    <motion.p
                      variants={itemVariants}
                      className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter"
                    >
                      <GradientText>REIMAGINED.</GradientText>
                    </motion.p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 md:p-12 shadow-2xl mb-12 border border-white/10 relative overflow-hidden"
                  whileHover={{
                    y: -8,
                    boxShadow: "0 25px 30px -5px rgba(255, 255, 255, 0.15)",
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 1,
                    }}
                  />

                  <motion.h1
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-xl md:text-2xl font-medium mb-3 leading-relaxed p-1 text-center tracking-tight text-white relative z-10"
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      From home loans to SIPs,
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                    >
                      Tailored finance for your brighter future.
                    </motion.div>
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex flex-wrap justify-center gap-6 relative z-10"
                  >
                    <Link href="/loan-application?type=home-loan">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button className="px-2 py-4 bg-white hover:bg-white/90 text-black text-lg font-bold rounded-xl backdrop-blur-md border border-white/20 shadow-lg hover:shadow-white/30 transition-all duration-300 group">
                          Smarter Loans start here
                          <MoveRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                    </Link>
                    <Link href="/consultation">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button className="px-2 py-4 bg-white hover:bg-white/90 text-black text-lg font-bold rounded-xl backdrop-blur-md border border-white/20 shadow-lg hover:shadow-white/30 transition-all duration-300 group">
                          Book Free Consultation
                          <MoveRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SIP Calculator */}
        <div key="sip-calculator-stable" className="relative z-20">
          <MemoizedSipCalculator />
        </div>

        {/* Value Proposition Section */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl mb-16 relative overflow-hidden"
            >
              {/* Animated gradient border */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: "-100%" }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 2,
                }}
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"
              />

              <div className="text-center mb-12 relative z-10">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
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
                    <motion.div
                      className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 h-full relative overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300"
                      whileHover={{
                        y: -12,
                        scale: 1.03,
                        boxShadow: "0 20px 40px rgba(255,255,255,0.1)",
                      }}
                    >
                      <motion.div
                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-6"
                        whileHover={{
                          scale: 1.3,
                          rotate: 360,
                          backgroundColor: "rgba(255,255,255,0.3)",
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <item.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3 text-white">
                        {item.title}
                      </h3>
                      <p className="text-white/80">{item.description}</p>

                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"
                        animate={{
                          opacity: hoveredCard === index ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        animate={{
                          boxShadow:
                            hoveredCard === index
                              ? "inset 0 0 60px rgba(255,255,255,0.1)"
                              : "inset 0 0 0px rgba(255,255,255,0)",
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
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
                    <motion.div
                      className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 h-full overflow-hidden group border border-white/20 hover:border-white/40 transition-all duration-300"
                      whileHover={{
                        y: -12,
                        scale: 1.03,
                        boxShadow: "0 20px 40px rgba(255,255,255,0.15)",
                      }}
                    >
                      <motion.div
                        className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto relative"
                        whileHover={{
                          rotate: 360,
                          scale: 1.25,
                          backgroundColor: "rgba(255,255,255,0.3)",
                        }}
                        transition={{ duration: 0.8 }}
                      >
                        <item.icon className="w-8 h-8 text-white" />

                        {/* Rotating ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-white/30"
                          animate={{
                            rotate: 360,
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </motion.div>

                      <h3 className="text-xl font-bold mb-4 text-center text-white">
                        {item.title}
                      </h3>
                      <p className="text-white/80 mb-6 text-center">
                        {item.description}
                      </p>

                      <div className="text-center">
                        <a href={item.path}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl backdrop-blur-md border border-white/30 shadow-lg hover:shadow-white/20 transition-all duration-300 group">
                              {item.cta}
                              <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </motion.div>
                        </a>
                      </div>

                      {/* Glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        animate={{
                          boxShadow:
                            hoveredCard === index + 3
                              ? "inset 0 0 80px rgba(255,255,255,0.15)"
                              : "inset 0 0 0px rgba(255,255,255,0)",
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        <PartnerBanks />
        <Industries />
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
                animate={{ x: "100%" }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: "-100%" }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 2,
                }}
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"
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
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button className="bg-white/20 hover:bg-white/30 text-white text-lg font-medium rounded-xl backdrop-blur-md border border-white/30 shadow-lg hover:shadow-white/20 transition-all duration-300 group">
                          Learn about SIP-linked loans
                          <MoveRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
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
                  <motion.div
                    className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl shadow-lg relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                    />

                    <h3 className="text-xl font-bold mb-6 flex items-center text-white relative z-10">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Zap className="w-5 h-5 text-blue-300 mr-2" />
                      </motion.div>
                      How it works:
                    </h3>
                    <ul className="space-y-4 relative z-10">
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
                          whileHover={{ x: 5 }}
                          className="flex items-start text-white/80"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.2,
                            }}
                          >
                            <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-400" />
                          </motion.div>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
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
              {/* Floating elements with enhanced animation */}
              <motion.div
                className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-white/10"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-white/10"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [360, 180, 0],
                }}
                transition={{ duration: 7, repeat: Infinity, delay: 1 }}
              />
              <motion.div
                className="absolute top-1/2 right-10 w-12 h-12 rounded-full bg-blue-400/10"
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold mb-6 text-white relative z-10"
              >
                Ready to borrow better?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-white/80 mb-8 max-w-2xl mx-auto relative z-10"
              >
                Because smarter lending starts with smarter matching. Let's make
                your next financial move your smartest one yet.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative z-10"
              >
                <a href="/loan-application">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white text-lg font-medium rounded-xl backdrop-blur-md border border-white/30 shadow-lg hover:shadow-white/20 transition-all duration-300 group relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span className="relative z-10 flex items-center">
                        Apply Now
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles className="w-5 h-5 ml-2 text-white" />
                        </motion.div>
                      </span>
                    </Button>
                  </motion.div>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
