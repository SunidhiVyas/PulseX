import { motion } from "framer-motion";

const timeline = [
  { time: "9:00 AM",  label: "Checked In",           color: "bg-cyan-400",    dot: "shadow-cyan-400/50" },
  { time: "10:30 AM", label: "Updated Work Log",      color: "bg-pink-400",    dot: "shadow-pink-400/50" },
  { time: "1:00 PM",  label: "Completed Dashboard UI",color: "bg-emerald-400", dot: "shadow-emerald-400/50" },
  { time: "5:30 PM",  label: "Checked Out",           color: "bg-purple-400",  dot: "shadow-purple-400/50" },
];

export default function ActivityTimeline() {
  return (
    <div className="glass-card shimmer-border rounded-3xl p-7 h-full backdrop-blur-xl hover:scale-[1.01] transition-all duration-300">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span>🕐</span> Activity Timeline
      </h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />

        <div className="space-y-6">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 pl-2"
            >
              {/* Dot */}
              <div className={`relative z-10 w-3 h-3 rounded-full mt-1 shrink-0 ${item.color} shadow-lg ${item.dot}`} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Time — explicit white color so it never disappears */}
                <p className="text-white text-xs font-bold mb-0.5 opacity-90">
                  {item.time}
                </p>
                <p className="text-gray-300 text-sm leading-snug">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}