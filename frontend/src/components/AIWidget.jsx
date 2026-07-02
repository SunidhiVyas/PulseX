import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiZap } from "react-icons/fi";

export default function AIWidget() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45 }}
      whileHover={{ scale: 1.02 }}
      className="relative rounded-3xl p-10 h-full overflow-hidden border border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-pink-500/20" />
      <motion.div
        className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl"
          >
            🤖
          </motion.div>
          <div>
            <h2 className="text-xl font-bold">AI Assistant</h2>
            <p className="text-xs text-cyan-400/80 flex items-center gap-1">
              <FiZap size={10} /> Powered by PulseX AI
            </p>
          </div>
        </div>

        <motion.p
          className="text-gray-300 leading-7 text-sm flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Your productivity increased by{" "}
          <span className="text-cyan-400 font-bold">12%</span> this week.
          You are maintaining excellent attendance and completing tasks ahead of schedule.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,229,255,0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/ai")}
          className="mt-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#050816] px-5 py-3 rounded-xl font-bold text-sm w-full"
        >
          Ask AI ✨
        </motion.button>
      </div>
    </motion.div>
  );
}
