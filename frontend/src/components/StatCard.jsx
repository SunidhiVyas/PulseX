import { motion } from "framer-motion";

const icons = {
  Attendance: "📅",
  "Hours Logged": "⏱️",
  "Tasks Done": "✅",
  Leaves: "🌴",
};

export default function StatCard({ title, value, color, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        scale: 1.05,
        y: -6,
        boxShadow: "0 20px 40px rgba(0,229,255,0.1)",
      }}
      className="glass-card shimmer-border rounded-3xl p-10 cursor-default relative overflow-hidden group backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <motion.span
          className="text-2xl"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
        >
          {icons[title] || "📊"}
        </motion.span>
      </div>

      <motion.p
        className={`text-4xl font-black mt-3 ${color}`}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.1, type: "spring" }}
      >
        {value}
      </motion.p>

      <motion.div
        className="h-1 rounded-full mt-4 bg-gradient-to-r from-cyan-400/60 to-transparent opacity-40"
        initial={{ width: 0 }}
        animate={{ width: "60%" }}
        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
      />
    </motion.div>
  );
}
