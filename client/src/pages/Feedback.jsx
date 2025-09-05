import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";

const Feedback = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const USE_MOCK_DATA = true;

  const getMockData = () => {
    return [
      {
        id: 1,
        name: "Rahul Sharma",
        rating: 5,
        description: "Got my dream home loan approved in just 5 days! The team guided me through every step and secured an incredible interest rate. Their expertise saved me thousands of dollars.",
      },
      {
        id: 2,
        name: "Manoj Patel", 
        rating: 4,
        description: "As a first-time buyer, I was overwhelmed by the loan process. These consultants made it seamless and stress-free. They found me the perfect loan package that fit my budget perfectly.",
      },
      {
        id: 3,
        name: "Anita Desai",
        rating: 5,
        description: "Refinanced my home and reduced my monthly payments by Rs.80,000! Their market knowledge and negotiation skills are outstanding. Couldn't have asked for better service.",
      },
      {
        id: 4,
        name: "Sanjay Mehta",
        rating: 5,
        description: "Needed urgent business financing and they delivered in record time. Professional, transparent, and got me the best rates in the market. Highly recommend for any loan needs.",
      },
      {
        id: 5,
        name: "Priya Singh",
        rating: 5,
        description: "Their personal loan consultation helped me consolidate my debts with a much lower interest rate. The financial planning advice was invaluable for my future goals.",
      },
      {
        id: 7,
        name: "Neha Kapoor",
        rating: 5,
        description: "Exceptional service! They helped me secure a construction loan for my new office building. The team's expertise in commercial financing is unmatched.",
      },
    ];
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);

    try {
      let feedbacksData = [];

      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        feedbacksData = getMockData();
      } else {
        const API_ENDPOINT = '/api/feedbacks';
        
        const response = await fetch(API_ENDPOINT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error('API endpoint not found. Please check your backend URL and ensure the /api/feedbacks endpoint exists.');
        }

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Feedback API endpoint not found. Please verify your backend is running and the endpoint exists.');
          }
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          throw new Error('Invalid JSON response from server. Please check your API endpoint.');
        }
        feedbacksData = Array.isArray(data) ? data : 
                       data.feedbacks || data.data || data.results || data.testimonials || [];

        if (!Array.isArray(feedbacksData)) {
          throw new Error('Invalid response format. Expected an array of feedbacks.');
        }
      }

      // Filter and sort
      const filteredFeedbacks = feedbacksData
        .filter((feedback) => {
          return (
            feedback && 
            typeof feedback.rating === 'number' && 
            feedback.rating >= 4 &&
            feedback.name &&
            feedback.description
          );
        })
        .sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return (b.id || 0) - (a.id || 0);
        })
        .slice(0, 6); //limit

      setFeedbacks(filteredFeedbacks);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      
      let errorMessage = err.message;
      if (err.message.includes('fetch')) {
        errorMessage = 'Unable to connect to the server. Please check if your backend is running.';
      } else if (err.message.includes('Unexpected token')) {
        errorMessage = 'API endpoint returned HTML instead of JSON. Please verify the endpoint exists in your backend.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const nextSlide = () => {
    if (isAnimating || feedbacks.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating || feedbacks.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex || feedbacks.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    if (feedbacks.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, feedbacks.length]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
        } transition-colors duration-300`}
      />
    ));
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">
            Loading Feedbacks...
          </h2>
          <p className="text-blue-200 opacity-80">
            Fetching the latest Reviews from our database
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-red-200 opacity-80 mb-4">{error}</p>
          <button
            onClick={fetchFeedbacks}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-6xl font-bold text-white mb-6 tracking-tight">
            Success Stories That Matter
          </h2>
          <p className="text-blue-200 text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            Discover how we've helped thousands achieve their financial dreams
            with personalized loan solutions and expert consultancy
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Card */}
          <div className="backdrop-blur-xl border border-white/20 rounded-3xl p-12 min-h-[400px] flex flex-col justify-center w-full bg-white/5 md:p-12 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.6)]">
            {/* Navigation */}
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 backdrop-blur-md border border-white/30 rounded-full p-3 transition-all duration-300 hover:scale-110 hover:border-blue-400/50 group z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:text-blue-300" />
            </button>

            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 backdrop-blur-md border border-white/30 rounded-full p-3 transition-all duration-300 hover:scale-110 hover:border-blue-400/50 group z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:text-blue-300" />
            </button>

            {/* Content */}
            <div className="text-center space-y-8">
              {/* Name & Icon */}
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 rounded-full backdrop-blur-md border border-white/30">
                  <User className="w-6 h-6 text-blue-300" />
                </div>
                <h3
                  key={`name-${currentIndex}`}
                  className={`text-3xl font-semibold text-white transition-all duration-500 ${
                    isAnimating
                      ? "opacity-0 transform translate-y-4"
                      : "opacity-100 transform translate-y-0"
                  }`}
                >
                  {feedbacks[currentIndex]?.name}
                </h3>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-2">
                {renderStars(feedbacks[currentIndex]?.rating || 0)}
              </div>

              {/* Description */}
              <div className="relative overflow-hidden">
                <p
                  key={currentIndex}
                  className={`text-xl leading-relaxed text-white/90 max-w-3xl mx-auto transition-all duration-500 ${
                    isAnimating
                      ? "opacity-0 transform translate-y-4"
                      : "opacity-100 transform translate-y-0"
                  }`}
                >
                  "{feedbacks[currentIndex]?.description}"
                </p>
              </div>
            </div>
          </div>

          {/* Progressbar */}
          <div className="mt-6 w-full bg-white/20 rounded-full h-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
              style={{
                width: `${
                  feedbacks.length > 0
                    ? ((currentIndex + 1) / feedbacks.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>

          {/* Refresh */}
          <div className="flex justify-center mt-6">
            <button
              onClick={fetchFeedbacks}
              disabled={loading}
              className="px-4 py-2 text-sm text-blue-300 hover:text-white border border-blue-300/30 hover:border-blue-300/60 rounded-full transition-all duration-300 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Refreshing..." : "Refresh Testimonials"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;

// import React, { useState, useEffect } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Star,
//   User,
//   Loader2,
//   AlertCircle,
// } from "lucide-react";

// const Feedback = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   //fetch
//   const fetchFeedbacks = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       // Mock data
//       const mockFeedbacks = [
//         {
//           id: 1,
//           name: "Rahul Sharma",
//           rating: 5,
//           description:
//             "Got my dream home loan approved in just 5 days! The team guided me through every step and secured an incredible interest rate. Their expertise saved me thousands of dollars.",
//         },
//         {
//           id: 2,
//           name: "Manoj Patel",
//           rating: 4,
//           description:
//             "As a first-time buyer, I was overwhelmed by the loan process. These consultants made it seamless and stress-free. They found me the perfect loan package that fit my budget perfectly.",
//         },
//         {
//           id: 3,
//           name: "Anita Desai",
//           rating: 5,
//           description:
//             "Refinanced my home and reduced my monthly payments by Rs.80,000! Their market knowledge and negotiation skills are outstanding. Couldn't have asked for better service.",
//         },
//         {
//           id: 4,
//           name: "Sanjay Mehta",
//           rating: 5,
//           description:
//             "Needed urgent business financing and they delivered in record time. Professional, transparent, and got me the best rates in the market. Highly recommend for any loan needs.",
//         },
//         {
//           id: 5,
//           name: "Priya Singh",
//           rating: 5,
//           description:
//             "Their personal loan consultation helped me consolidate my debts with a much lower interest rate. The financial planning advice was invaluable for my future goals.",
//         },
//         {
//           id: 6,
//           name: "Aakash Verma",
//           rating: 3,
//           description:
//             "Good service overall, but the process took longer than expected. However, the final outcome was satisfactory.",
//         },
//         {
//           id: 7,
//           name: "Neha Kapoor",
//           rating: 5,
//           description:
//             "Exceptional service! They helped me secure a construction loan for my new office building. The team's expertise in commercial financing is unmatched.",
//         },
//       ];

//       // Filter and sort by best ratings (4+ stars)
//       const filteredFeedbacks = mockFeedbacks
//         .filter((feedback) => feedback.rating >= 4)
//         .sort((a, b) => {
//           // sort by rating
//           if (b.rating !== a.rating) {
//             return b.rating - a.rating;
//           }
//         })
//         .slice(0, 6); // Limit top 7

//       setFeedbacks(filteredFeedbacks);
//       setLoading(false);
//     } catch (err) {
//       setError("Failed to load testimonials. Please try again later.");
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchFeedbacks();
//   }, []);

//   const nextSlide = () => {
//     if (isAnimating || feedbacks.length === 0) return;
//     setIsAnimating(true);
//     setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
//     setTimeout(() => setIsAnimating(false), 500);
//   };

//   const prevSlide = () => {
//     if (isAnimating || feedbacks.length === 0) return;
//     setIsAnimating(true);
//     setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
//     setTimeout(() => setIsAnimating(false), 500);
//   };

//   const goToSlide = (index) => {
//     if (isAnimating || index === currentIndex || feedbacks.length === 0) return;
//     setIsAnimating(true);
//     setCurrentIndex(index);
//     setTimeout(() => setIsAnimating(false), 500);
//   };

//   useEffect(() => {
//     if (feedbacks.length === 0) return;

//     const interval = setInterval(() => {
//       nextSlide();
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [currentIndex, feedbacks.length]);

//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, i) => (
//       <Star
//         key={i}
//         className={`w-5 h-5 ${
//           i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
//         } transition-colors duration-300`}
//       />
//     ));
//   };

//   // Loading
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6 ">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
//           <h2 className="text-2xl font-semibold text-white mb-2">
//             Loading Feedbacks...
//           </h2>
//           <p className="text-blue-200 opacity-80">
//             Fetching the latest Reviews
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Error
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6">
//         <div className="text-center">
//           <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-semibold text-white mb-2">
//             Something went wrong
//           </h2>
//           <p className="text-red-200 opacity-80 mb-4">{error}</p>
//           <button
//             onClick={fetchFeedbacks}
//             className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6 ">
//       <div className="w-full max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12 relative z-10">
//           <h2 className="text-6xl font-bold text-white mb-6 tracking-tight">
//             Success Stories That Matter
//           </h2>
//           <p className="text-blue-200 text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
//             Discover how we've helped thousands achieve their financial dreams
//             with personalized loan solutions and expert consultancy
//           </p>
//         </div>

//         {/* Carousel */}
//         <div className="">
//           {/*  Card */}
//           <div className="backdrop-blur-xl border border-white/20 rounded-3xl p-12 min-h-[400px] flex flex-col justify-center w-full bg-white/5 md:p-12 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.6)]">
//             {/* Navigation */}
//             <button
//               onClick={prevSlide}
//               disabled={isAnimating}
//               className="absolute left-6 top-1/2 transform -translate-y-1/2 backdrop-blur-md border border-white/30 rounded-full p-3 transition-all duration-300 hover:scale-110 hover:border-blue-400/50 group z-10 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft className="w-6 h-6 text-white group-hover:text-blue-300" />
//             </button>

//             <button
//               onClick={nextSlide}
//               disabled={isAnimating}
//               className="absolute right-6 top-1/2 transform -translate-y-1/2 backdrop-blur-md border border-white/30 rounded-full p-3 transition-all duration-300 hover:scale-110 hover:border-blue-400/50 group z-10 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronRight className="w-6 h-6 text-white group-hover:text-blue-300" />
//             </button>

//             {/* Content */}
//             <div className="text-center space-y-8">
//               {/* Name,Icon */}
//               <div className="flex items-center justify-center gap-3">
//                 <div className="p-2 rounded-full backdrop-blur-md border border-white/30">
//                   <User className="w-6 h-6 text-blue-300" />
//                 </div>
//                 <h3
//                   key={`name-${currentIndex}`}
//                   className={`text-3xl font-semibold text-white transition-all duration-500 ${
//                     isAnimating
//                       ? "opacity-0 transform translate-y-4"
//                       : "opacity-100 transform translate-y-0"
//                   }`}
//                 >
//                   {feedbacks[currentIndex]?.name}
//                 </h3>
//               </div>

//               {/* Stars */}
//               <div className="flex justify-center gap-2">
//                 {renderStars(feedbacks[currentIndex]?.rating || 0)}
//               </div>

//               {/* Description */}
//               <div className="relative overflow-hidden">
//                 <p
//                   key={currentIndex}
//                   className={`text-xl leading-relaxed text-white/90 max-w-3xl mx-auto transition-all duration-500 ${
//                     isAnimating
//                       ? "opacity-0 transform translate-y-4"
//                       : "opacity-100 transform translate-y-0"
//                   }`}
//                 >
//                   "{feedbacks[currentIndex]?.description}"
//                 </p>
//               </div>
//             </div>
//           </div>
//           {/* Progressbar */}
//           <div className="mt-6 w-full bg-white/20 rounded-full h-1 overflow-hidden">
//             <div
//               className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
//               style={{
//                 width: `${
//                   feedbacks.length > 0
//                     ? ((currentIndex + 1) / feedbacks.length) * 100
//                     : 0
//                 }%`,
//               }}
//             />
//           </div>

//           {/* Refresh Button */}
//           <div className="flex justify-center mt-6">
//             <button
//               onClick={fetchFeedbacks}
//               disabled={loading}
//               className="px-4 py-2 text-sm text-blue-300 hover:text-white border border-blue-300/30 hover:border-blue-300/60 rounded-full transition-all duration-300 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? "Refreshing..." : "Refresh Testimonials"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Feedback;
