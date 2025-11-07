import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Home, Calendar, CreditCard, X } from 'lucide-react';

export const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const banners = [
    {
      heading: 'Discover Your Dream Home',
      subtext: 'Browse through premium properties tailored to your lifestyle',
      buttonText: 'Explore Properties',
      link: '/properties',
      icon: Home,
    },
    {
      heading: 'Expert Guidance Awaits',
      subtext: 'Get personalized consultation from real estate professionals',
      buttonText: 'Book Free Consultation',
      link: '/consultation',
      icon: Calendar,
    },
    {
      heading: 'Fast Track Your Home Loan',
      subtext: 'Quick approval process with competitive interest rates',
      buttonText: 'Apply Now',
      link: '/loan-application?type=home-loan',
      icon: CreditCard,
    },
  ];

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        setIsVisible(true);
      }, 500);
    }, 15000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(interval);
    };
  }, []);

  const currentBanner = banners[currentIndex];
  const Icon = currentBanner.icon;

  const handleClick = () => {
    window.location.href = currentBanner.link;
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isVisible ? 0 : '100%' }}
      transition={{ 
        type: 'spring',
        stiffness: 100,
        damping: 20,
        mass: 1
      }}
      className="fixed right-0 top-[55%] -translate-y-1/2 z-50"
    >
      <motion.div 
        className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-l-2xl shadow-2xl w-80 overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2
          }}
        />

        <motion.button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-1.5"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close banner"
        >
          <X className="w-5 h-5" />
        </motion.button>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-start gap-[15px] mb-5">
                <motion.div 
                  className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30 relative overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Icon glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-xl"
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <Icon className="w-6 h-6 text-white relative z-10" />
                </motion.div>
                
                <div className="flex-1">
                  <motion.h3 
                    className="text-white font-bold text-xl mb-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {currentBanner.heading}
                  </motion.h3>
                  <motion.p 
                    className="text-white/80 text-sm leading-relaxed"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentBanner.subtext}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.button
            onClick={handleClick}
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg relative overflow-hidden"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 1
              }}
            />
            <span className="relative z-10">{currentBanner.buttonText}</span>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </motion.button>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mt-5">
            {banners.map((_, index) => (
              <motion.div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white'
                    : 'bg-white/40'
                }`}
                animate={{
                  width: index === currentIndex ? 24 : 6,
                }}
                whileHover={{ 
                  scale: 1.2,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-l-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          }}
          animate={{
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Banner;