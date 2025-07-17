import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  Calculator,
  Home,
  Building,
  TrendingUp,
  Shield,
  Users,
  BookOpen,
  Zap,
  Sparkles,
  CheckCircle,
  Heart,
  Star,
  Target,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { staggerContainer, fadeIn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-4">
        <div className="container mx-auto">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto text-center"
          >
            <motion.h1
              variants={fadeIn("up", 0.2)}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6"
            >
              Your Financial{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Future
              </span>{" "}
              Starts Here
            </motion.h1>

            <motion.p
              variants={fadeIn("up", 0.3)}
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12"
            >
              Smart loans, intelligent investments, and personalized financial guidance - 
              all in one modern platform built for India's evolving financial landscape.
            </motion.p>

            <motion.div
              variants={fadeIn("up", 0.4)}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/loan-application">
                <Button size="lg" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  Apply for Loan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/consultation">
                <Button size="lg" variant="outline" className="px-8 py-4 border-gray-600 text-white hover:bg-gray-800">
                  Free Consultation
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeIn("up", 0.1)}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            >
              Our Services
            </motion.h2>
            <motion.div
              variants={fadeIn("up", 0.2)}
              className="h-1 w-20 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Home className="w-8 h-8" />,
                title: "Home Loans",
                description: "Competitive rates and flexible terms for your dream home",
                delay: 0.1,
              },
              {
                icon: <Building className="w-8 h-8" />,
                title: "Loan Against Property",
                description: "Unlock the value of your property with our LAP solutions",
                delay: 0.2,
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "SIP Investments",
                description: "Systematic investment plans to build long-term wealth",
                delay: 0.3,
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={fadeIn("up", service.delay)}
                className="p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-center hover:bg-white/15 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeIn("up", 0.1)}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Why Choose Us
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Secure & Trusted",
                description: "Bank-grade security for all your financial data",
              },
              {
                icon: <Calculator className="w-6 h-6" />,
                title: "Smart Calculators",
                description: "EMI and SIP calculators for informed decisions",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Expert Guidance",
                description: "Personalized advice from financial experts",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Quick Processing",
                description: "Fast approvals and seamless experience",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn("up", index * 0.1)}
                className="p-6 bg-slate-800 rounded-xl border border-slate-700"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-cyan-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join thousands who trust us with their financial journey
            </p>
            <Link href="/loan-application">
              <Button size="lg" className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-900 font-medium">
                Get Started Today
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}