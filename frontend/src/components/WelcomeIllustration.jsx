import { motion } from "framer-motion";

export default function WelcomeIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="glass-card shimmer-border rounded-3xl p-10 h-full relative overflow-hidden backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-pink-500/10"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative text-center">
        <motion.img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop"
          alt="Team"
          className="w-28 h-28 rounded-2xl object-cover mx-auto border border-white/10 shadow-xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <h2 className="text-2xl font-bold mt-5">Keep Building</h2>

        <p className="text-gray-400 mt-3 leading-7 text-sm">
          Complete your attendance, maintain work logs and track productivity using AI insights.
        </p>

        <motion.div
          className="mt-5 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {["📈", "🎯", "✨"].map((e, i) => (
            <motion.span
              key={i}
              className="text-xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              {e}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
