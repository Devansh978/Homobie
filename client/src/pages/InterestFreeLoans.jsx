import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";

const InterestFreeLoans = () => {
  const [amount, setAmount] = useState(250000);
  const [months, setMonths] = useState(12);

  const GradientText = ({ children }) => (
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white bg-[length:200%_auto] animate-gradient">
      {children}
    </span>
  );

  return (
    <div>
      <section
        id="hero-interest-free"
        className="relative min-h-[86vh] w-full overflow-hidden"
      >
        {/* Decorative gradient glows */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl" />
        </div>

        {/* Subtle grain for depth */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-soft-light" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-24 md:px-10 z-10">
          {/* Glassmorphism panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.6)]"
          >
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                Calculate <GradientText>interest-free{" "}</GradientText>
                loans— <span className="text-white/90">no hooks, no hassles.</span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base text-white/70 md:text-lg">
                Get crystal-clear numbers in seconds. Zero hidden fees. Zero
                fine print. Just the truth about what you'll pay.
              </p>
            </div>

            {/* Quick calculator */}
            <div className="mx-auto mt-8 max-w-2xl">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <label className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-4 text-white/90">
                  <span className="mb-2 text-sm text-white/60">Amount</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="rounded-lg bg-transparent/40 p-3 outline-none ring-0 placeholder:text-white/40 focus:bg-transparent/30"
                    placeholder="₹2,50,000"
                    min={0}
                  />
                </label>

                <label className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-4 text-white/90">
                  <span className="mb-2 text-sm text-white/60">
                    Tenure (months)
                  </span>
                  <input
                    type="number"
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="rounded-lg bg-transparent/40 p-3 outline-none ring-0 placeholder:text-white/40 focus:bg-transparent/30"
                    placeholder="12"
                    min={1}
                  />
                </label>

                <div className="flex items-center">
                  <Link
                    href="/sip"
                    className="inline-flex w-full items-center justify-center rounded-xl border border-sky-500/40 bg-gradient-to-r from-sky-500/20 to-blue-600/20 px-5 py-3 font-semibold text-sky-300 backdrop-blur-md transition hover:from-sky-500/30 hover:to-blue-600/30 hover:text-sky-200"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate now
                  </Link>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                <span className="text-white/50">
                  No credit impact • No spam • Cancel anytime
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient line accent */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
      </section>
    </div>
  );
};

export default InterestFreeLoans;
