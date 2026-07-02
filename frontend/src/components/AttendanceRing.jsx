import { motion } from "framer-motion";

const circumference = 2 * Math.PI * 60;
const score = 95;
const offset = circumference - (score / 100) * circumference;

export default function AttendanceRing() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      whileHover={{ scale: 1.03 }}
      className="glass-card shimmer-border rounded-3xl p-10 h-full flex flex-col backdrop-blur-xl transition-all duration-300"
    >
      <h2 className="text-xl font-bold mb-4">Attendance Score</h2>

      <div className="flex-1 flex justify-center items-center">
        <div className="relative w-48 h-48">
          <svg className="w-48 h-48 rotate-[-90deg]" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="#1f2937"
              strokeWidth="12"
              fill="none"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="60"
              stroke="url(#ringGradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.h1
              className="text-4xl font-black gradient-text"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
            >
              {score}%
            </motion.h1>
            <p className="text-gray-400 text-sm mt-1">Attendance</p>
          </div>

          <motion.div
            className="absolute inset-0 rounded-full border border-cyan-500/10"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  );
}
