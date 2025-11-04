import React, { useState, useEffect } from 'react';
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
    <div
      className={`fixed right-0 top-[75%] -translate-y-1/2 z-50 transition-transform duration-500 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-l-2xl shadow-2xl w-80">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
          aria-label="Close banner"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-[15px] mb-5">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-xl mb-2">
              {currentBanner.heading}
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              {currentBanner.subtext}
            </p>
          </div>
        </div>

        <button
          onClick={handleClick}
          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg"
        >
          <span>{currentBanner.buttonText}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="flex justify-center gap-2 mt-5">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 bg-white'
                  : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;




// import React, { useState, useEffect } from 'react';
// import { ArrowRight, Home, Calendar, CreditCard, X } from 'lucide-react';

// export const Banner = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isVisible, setIsVisible] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const banners = [
//     {
//       heading: 'Discover Your Dream Home',
//       subtext: 'Browse through premium properties tailored to your lifestyle',
//       buttonText: 'Explore Properties',
//       link: '/properties',
//       icon: Home,
//     },
//     {
//       heading: 'Expert Guidance Awaits',
//       subtext: 'Get personalized consultation from real estate professionals',
//       buttonText: 'Book Free Consultation',
//       link: '/consultation',
//       icon: Calendar,
//     },
//     {
//       heading: 'Fast Track Your Home Loan',
//       subtext: 'Quick approval process with competitive interest rates',
//       buttonText: 'Apply Now',
//       link: '/loan-application?type=home-loan',
//       icon: CreditCard,
//     },
//   ];

//   useEffect(() => {
//     const showTimer = setTimeout(() => {
//       setIsVisible(true);
//     }, 1000);

//     const interval = setInterval(() => {
//       if (!isModalOpen) {
//         setIsVisible(false);

//         setTimeout(() => {
//           setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
//           setIsVisible(true);
//         }, 500);
//       }
//     }, 15000);

//     return () => {
//       clearTimeout(showTimer);
//       clearInterval(interval);
//     };
//   }, [isModalOpen]);

//   const currentBanner = banners[currentIndex];
//   const Icon = currentBanner.icon;

//   const handleBannerClick = () => {
//     setIsModalOpen(true);
//   };

//   const handleClose = (e) => {
//     e.stopPropagation();
//     setIsVisible(false);
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//   };

//   const handleButtonClick = (e) => {
//     e.stopPropagation();
//     window.location.href = currentBanner.link;
//   };

//   return (
//     <>
//       {/* Small Sliding Banner */}
//       <div
//         className={`fixed right-0 top-[75%] -translate-y-1/2 z-50 transition-transform duration-500 ease-in-out cursor-pointer ${
//           isVisible && !isModalOpen ? 'translate-x-0' : 'translate-x-full'
//         }`}
//         onClick={handleBannerClick}
//       >
//         <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-l-2xl shadow-2xl w-80 hover:bg-white/15 transition-all">
//           <button
//             onClick={handleClose}
//             className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors z-10"
//             aria-label="Close banner"
//           >
//             <X className="w-5 h-5" />
//           </button>

//           <div className="flex items-start gap-4 mb-5">
//             <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30">
//               <Icon className="w-6 h-6 text-white" />
//             </div>
//             <div className="flex-1 pr-6">
//               <h3 className="text-white font-bold text-xl mb-2">
//                 {currentBanner.heading}
//               </h3>
//               <p className="text-white/80 text-sm leading-relaxed">
//                 {currentBanner.subtext}
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={handleBannerClick}
//             className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-2 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg mb-3"
//           >
//             <span>Learn More</span>
//             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//           </button>

//           <div className="flex justify-center gap-2">
//             {banners.map((_, index) => (
//               <div
//                 key={index}
//                 className={`h-1.5 rounded-full transition-all duration-300 ${
//                   index === currentIndex
//                     ? 'w-6 bg-white'
//                     : 'w-1.5 bg-white/40'
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Large Modal Popup */}
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
//           onClick={handleModalClose}
//         >
//           <div
//             className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl max-w-lg w-full mx-4 p-8 animate-in fade-in zoom-in duration-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={handleModalClose}
//               className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2"
//               aria-label="Close modal"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             <div className="text-center mb-6">
//               <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-sm border border-white/30 inline-flex mb-5">
//                 <Icon className="w-12 h-12 text-white" />
//               </div>
              
//               <h2 className="text-3xl font-bold text-white mb-3">
//                 {currentBanner.heading}
//               </h2>
              
//               <p className="text-lg text-white/80 leading-relaxed">
//                 {currentBanner.subtext}
//               </p>
//             </div>

//             <div className="flex justify-center">
//               <button
//                 onClick={handleButtonClick}
//                 className="px-8 py-3 bg-white text-black text-lg font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg"
//               >
//                 <span>{currentBanner.buttonText}</span>
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </button>
//             </div>

//             {/* Progress dots */}
//             <div className="flex justify-center gap-3 mt-6">
//               {banners.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setCurrentIndex(index);
//                   }}
//                   className={`h-2 rounded-full transition-all duration-300 ${
//                     index === currentIndex
//                       ? 'w-8 bg-white'
//                       : 'w-2 bg-white/40 hover:bg-white/60'
//                   }`}
//                   aria-label={`Go to banner ${index + 1}`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Banner;