import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";

// Dummy team data
const teamMembers = [
  {
    id: 1,
    name: "Alex Chen",
    role: "Creative Director",
    bio: "Design enthusiast with a passion for minimalist aesthetics and user experience.",
    funFact: "Collects vintage typewriters",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Lead Developer",
    bio: "Full-stack wizard specializing in React and Node.js architectures.",
    funFact: "Competitive chess player",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Product Manager",
    bio: "Bridges the gap between technical and business needs with precision.",
    funFact: "Speaks 4 languages fluently",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    id: 4,
    name: "Priya Patel",
    role: "UX Designer",
    bio: "Creates intuitive interfaces with a focus on accessibility and inclusivity.",
    funFact: "Avid rock climber",
    image:
      "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=300&h=300&fit=crop",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    id: 5,
    name: "James Wilson",
    role: "Frontend Engineer",
    bio: "Specializes in animation and interactive web experiences.",
    funFact: "Plays in a weekend jazz band",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    id: 6,
    name: "Emma Zhang",
    role: "Marketing Director",
    bio: "Crafts compelling narratives that connect brands with their audiences.",
    funFact: "Published poet",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
];

const TeamCard = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800/20 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10 dark:to-gray-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 p-6">
        {/* Profile Image */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-md"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <img
            src={member.image}
            alt={`Portrait of ${member.name}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/10 dark:bg-white/10 group-hover:opacity-0 transition-opacity" />
        </motion.div>

        {/* Name & Role */}
        <div className="text-center mb-3">
          <motion.h3
            className="text-xl font-bold text-gray-900 dark:text-white"
            whileHover={{ color: "#3b82f6" }}
            transition={{ duration: 0.3 }}
          >
            {member.name}
          </motion.h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            {member.role}
          </p>
        </div>

        {/* Bio */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center">
          {member.bio}
        </p>

        {/* Fun Fact */}
        <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">
            <span className="font-bold">Fun fact:</span> {member.funFact}
          </p>
        </div>

        {/* Social Icons - Animate on hover */}
        <motion.div
          className="flex justify-center space-x-4"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 },
          }}
        >
          <motion.a
            href={member.social.linkedin}
            aria-label={`Connect with ${member.name} on LinkedIn`}
            className="text-gray-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </motion.a>
          <motion.a
            href={member.social.twitter}
            aria-label={`Follow ${member.name} on Twitter`}
            className="text-gray-500 hover:text-blue-400 transition-colors"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </motion.a>
        </motion.div>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
        <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-blue-400/30 dark:group-hover:ring-blue-500/30 transition-all duration-500" />
        <div className="absolute inset-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
};

export default function TeamPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          ref={ref}
        >
          <motion.h1
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Meet Our Team
          </motion.h1>
          <motion.p
            className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            The talented individuals who bring creativity, expertise, and
            passion to every project we undertake.
          </motion.p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : {}}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {teamMembers.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Want to join our team?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            We're always looking for passionate individuals to join our growing
            team.
          </p>
          <motion.a
            href="#"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Open Positions
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}

