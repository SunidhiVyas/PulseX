import { motion } from "framer-motion";

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 grid-bg" />

      <motion.div
        className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-cyan-500 opacity-[0.15] blur-[180px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-pink-500 opacity-[0.15] blur-[180px]"
        animate={{ x: [0, -40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[30%] right-[20%] w-[350px] h-[350px] rounded-full bg-purple-500 opacity-[0.08] blur-[150px]"
        animate={{ x: [0, 60, -20, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[60%] left-[15%] w-[250px] h-[250px] rounded-full bg-emerald-500 opacity-[0.06] blur-[120px]"
        animate={{ x: [0, -30, 30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated ring */}
      <motion.div
        className="absolute top-[20%] right-[10%] w-64 h-64 border border-cyan-500/10 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-[22%] right-[12%] w-48 h-48 border border-pink-500/10 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
