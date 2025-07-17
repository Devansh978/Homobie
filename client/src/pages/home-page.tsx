// import React from "react";
// import { Link } from "wouter";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import {
//   ArrowRight,
//   Calculator,
//   Home,
//   Building,
//   TrendingUp,
//   Shield,
//   Users,
//   BookOpen,
//   Handshake,
//   Zap,
//   Sparkles,
//   CheckCircle,
//   ChevronDown,
//   Circle,
//   MoveRight,
// } from "lucide-react";

// export default function HomePage() {
//   return (
//     <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden">
//         <div className="container mx-auto px-4 py-16 md:py-24">
//           <div className="text-center max-w-4xl mx-auto">
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               className="text-4xl md:text-6xl font-bold text-white mb-6"
//             >
//               A simpler, <span className="text-blue-400">smarter,</span> and
//               fairer way to finance your future.
//             </motion.h1>
            
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="text-xl md:text-2xl text-gray-300 mb-8"
//             >
//               Transparent loans, smart investments, and personalized guidance
//               for every financial goal.
//             </motion.p>
            
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="flex flex-col sm:flex-row gap-4 justify-center"
//             >
//               <Link href="/loan-application">
//                 <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
//                   Apply for Loan
//                   <ArrowRight className="ml-2 w-5 h-5" />
//                 </Button>
//               </Link>
//               <Link href="/consultation">
//                 <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3 text-lg">
//                   Book Consultation
//                 </Button>
//               </Link>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Our Financial Services
//             </h2>
//             <p className="text-xl text-gray-600">
//               Comprehensive financial solutions tailored to your needs
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
//             >
//               <Home className="w-12 h-12 text-blue-600 mb-6" />
//               <h3 className="text-2xl font-bold text-gray-900 mb-4">
//                 Loan Applications
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 Get competitive rates on home loans, personal loans, and business financing
//                 with our streamlined application process.
//               </p>
//               <Link href="/loan-application">
//                 <Button className="bg-blue-600 hover:bg-blue-700 text-white">
//                   Apply Now <ArrowRight className="ml-2 w-4 h-4" />
//                 </Button>
//               </Link>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
//             >
//               <TrendingUp className="w-12 h-12 text-green-600 mb-6" />
//               <h3 className="text-2xl font-bold text-gray-900 mb-4">
//                 SIP Investments
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 Build wealth systematically with our curated mutual fund SIPs
//                 and investment advisory services.
//               </p>
//               <Link href="/sip">
//                 <Button className="bg-green-600 hover:bg-green-700 text-white">
//                   Start Investing <ArrowRight className="ml-2 w-4 h-4" />
//                 </Button>
//               </Link>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               className="bg-gradient-to-br from-purple-50 to-violet-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
//             >
//               <BookOpen className="w-12 h-12 text-purple-600 mb-6" />
//               <h3 className="text-2xl font-bold text-gray-900 mb-4">
//                 Financial Consultation
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 Get personalized financial advice from certified experts to plan
//                 your financial future effectively.
//               </p>
//               <Link href="/consultation">
//                 <Button className="bg-purple-600 hover:bg-purple-700 text-white">
//                   Book Session <ArrowRight className="ml-2 w-4 h-4" />
//                 </Button>
//               </Link>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Why Choose Our Platform?
//             </h2>
//             <p className="text-xl text-gray-600">
//               Built for transparency, efficiency, and your financial success
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               {
//                 icon: Shield,
//                 title: "Secure & Trusted",
//                 description: "Bank-grade security with encrypted transactions"
//               },
//               {
//                 icon: Zap,
//                 title: "Fast Processing",
//                 description: "Quick approvals and instant digital processes"
//               },
//               {
//                 icon: Users,
//                 title: "Expert Support",
//                 description: "Certified financial advisors at your service"
//               },
//               {
//                 icon: Calculator,
//                 title: "Transparent Pricing",
//                 description: "No hidden fees, clear terms and conditions"
//               }
//             ].map((feature, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: index * 0.1 }}
//                 className="text-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
//               >
//                 <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-600">
//                   {feature.description}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 bg-blue-600">
//         <div className="container mx-auto px-4 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="max-w-3xl mx-auto"
//           >
//             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
//               Ready to Transform Your Financial Future?
//             </h2>
//             <p className="text-xl text-blue-100 mb-8">
//               Join thousands of satisfied customers who have achieved their financial goals with us.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href="/auth">
//                 <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
//                   Get Started Today
//                   <ArrowRight className="ml-2 w-5 h-5" />
//                 </Button>
//               </Link>
//               <Link href="/consultation">
//                 <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
//                   Schedule Consultation
//                 </Button>
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import * as THREE from "three";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Text3D, useTexture, PerspectiveCamera, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Glitch } from "@react-three/postprocessing";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
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

extend({ TextGeometry });

// 3D Animated House Model
const HouseModel = () => {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.2;
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.1;
  });

  return (
    <group ref={meshRef} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? "#ffffff" : "#aaaaaa"} />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.8, 0.5, 4]} />
        <meshStandardMaterial color={hovered ? "#ffffff" : "#aaaaaa"} />
      </mesh>
    </group>
  );
};

// 3D Animated Text Component
const AnimatedText3D = ({ text, position = [0, 0, 0], size = 0.5 }) => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
  });

  return (
    <Text3D
      ref={meshRef}
      font="/fonts/helvetiker_regular.typeface.json"
      size={size}
      height={0.1}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.02}
      bevelSize={0.02}
      bevelOffset={0}
      bevelSegments={5}
      position={position}
    >
      {text}
      <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} />
    </Text3D>
  );
};

// Floating Particles Background
const FloatingParticles = ({ count = 100 }) => {
  const particles = useRef();
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
    }
    return new Float32Array(pos);
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    particles.current.rotation.x = time * 0.1;
    particles.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={particles}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        size={0.05}
        sizeAttenuation
        color="white"
        transparent
        opacity={0.8}
      />
    </points>
  );
};

// Hero Scene with 3D Elements
const HeroScene = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={60} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <Environment preset="city" />

        <group position={[2, -1, 0]}>
          <HouseModel />
          <AnimatedText3D text="Home" position={[0, -1.5, 0]} size={0.3} />
        </group>

        <FloatingParticles count={200} />

        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
          <Glitch delay={[1, 10]} duration={[0.1, 0.3]} strength={[0.01, 0.03]} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

// Animated Card with Hover Effects
const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="relative group"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 h-full overflow-hidden border border-white/10 shadow-lg">
        <motion.div
          className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6"
          whileHover={{ rotate: 15, scale: 1.1 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-white/70">{description}</p>

        <motion.div
          className="absolute inset-0 border-2 border-white/20 rounded-2xl pointer-events-none"
          initial={{ opacity: 0, scale: 0.9 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [isHovered, setIsHovered] = useState(false);

  // Animated gradient for text
  const gradientVariants = {
    initial: { backgroundPosition: "0% 50%" },
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: { duration: 8, repeat: Infinity, ease: "linear" },
    },
  };

  return (
    <div className="bg-black text-white overflow-hidden relative">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-white to-gray-400 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroScene />

        <div className="container mx-auto px-4 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Hook with animated gradient */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-6xl md:text-7xl font-bold mb-6"
              >
                The Home Loans Experience,
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl md:text-8xl font-bold mb-8"
              >
                <motion.span
                  className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white bg-[length:200%_auto]"
                  variants={gradientVariants}
                  initial="initial"
                  animate="animate"
                >
                  REIMAGINED.
                </motion.span>
              </motion.p>
            </motion.div>

            {/* Floating CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 md:p-12 shadow-2xl mb-12 border border-white/10"
              whileHover={{ y: -5 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>

              <motion.h1
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-1.5xl md:text-1.5xl font-medium mb-6 text-white"
              >
                Home loans, Mortgage loans, SIP plans? —{" "}
                <span className="font-bold">We speak fluent finance,</span> So
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
                    className="px-8 py-4 bg-transparent text-white border border-white/90 hover:bg-white/10 text-lg font-medium rounded-xl backdrop-blur-md shadow-lg hover:shadow-white/30 transition-all duration-300 group"
                  >
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Canvas>
            <FloatingParticles count={100} />
          </Canvas>
        </div>

        <div className="container mx-auto px-4 relative">
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
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
            >
              We don't push products.
              <br />
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                We match you to the right one.
              </motion.span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8 }}
              className="w-32 h-1 bg-gradient-to-r from-white to-gray-300 mx-auto rounded-full"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={BookOpen}
              title="We read your profile"
              description="Then connect you to the Home loan that fits it best"
              delay={0.1}
            />
            <FeatureCard
              icon={Users}
              title="For People Who Expect More"
              description="And settle for less. Less paperwork. Less waiting. Less interest."
              delay={0.2}
            />
            <FeatureCard
              icon={Shield}
              title="Transparent Matching"
              description="No hidden agendas, just the best financial products for your needs"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* 3D Visualization Section */}
      <section className="py-24 relative h-screen">
        <div className="absolute inset-0">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />

            <AnimatedText3D 
              text="Your Dream Home" 
              position={[-3, 2, 0]} 
              size={0.8} 
            />

            <group position={[3, -1, 0]}>
              <HouseModel />
              <AnimatedText3D 
                text="Our Expertise" 
                position={[0, -2, 0]} 
                size={0.5} 
              />
            </group>

            <EffectComposer>
              <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
            </EffectComposer>
          </Canvas>
        </div>

        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-black/50 rounded-2xl p-8 max-w-md border border-white/10"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Visualize Your Future</h2>
            <p className="text-white/80 mb-6">
              See how your dream home comes to life with our interactive 3D visualization tools.
            </p>
            <Button className="bg-white text-black hover:bg-white/90">
              Explore 3D Planner
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA with Particle Background */}
      <section className="py-24 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Canvas>
            <FloatingParticles count={300} />
          </Canvas>
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center backdrop-blur-2xl bg-white/5 rounded-3xl p-12 shadow-2xl overflow-hidden border border-white/10"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
            >
              Ready to reimagine your home loan experience?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
            >
              Join thousands who've found smarter financing with our platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link href="/loan-application">
                <Button className="px-8 py-4 bg-white hover:bg-white/90 text-black text-lg font-medium rounded-xl backdrop-blur-md border border-white/20 shadow-lg hover:shadow-white/30 transition-all duration-300 group">
                  Get Started Now
                  <Sparkles className="w-5 h-5 ml-2 text-black group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" className="text-white border-white hover:bg-white/10">
                  Watch Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}