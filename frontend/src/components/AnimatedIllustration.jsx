import { motion } from "framer-motion";

const floatingImages = [
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
    alt: "Team collaboration",
    className: "top-8 left-4 w-24 h-24",
    delay: 0,
  },
  {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop",
    alt: "Analytics dashboard",
    className: "top-32 right-0 w-28 h-28",
    delay: 0.5,
  },
  {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop",
    alt: "Data insights",
    className: "bottom-16 left-8 w-20 h-20",
    delay: 1,
  },
  {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    alt: "Professional workspace",
    className: "bottom-8 right-12 w-24 h-24",
    delay: 1.5,
  },
];

export default function AnimatedIllustration() {
  return (
    <div className="relative w-full h-[480px] hidden lg:block">
      {/* Central animated SVG dashboard */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <motion.div
          className="relative w-80 h-80"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-2xl">
            <defs>
              <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="barGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* Monitor frame */}
            <rect x="40" y="60" width="240" height="160" rx="12" fill="#1a1f3a" stroke="#00e5ff" strokeWidth="2" opacity="0.9" />
            <rect x="50" y="70" width="220" height="130" rx="6" fill="url(#screenGrad)" />

            {/* Animated chart bars */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.rect
                key={i}
                x={70 + i * 38}
                y={140}
                width="24"
                height="40"
                rx="4"
                fill="url(#barGrad)"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 1, 0.7, 1] }}
                transition={{
                  duration: 2,
                  delay: 0.5 + i * 0.15,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                style={{ transformOrigin: `${82 + i * 38}px 180px` }}
              />
            ))}

            {/* Line chart */}
            <motion.path
              d="M 60 120 Q 100 90, 140 100 T 220 85 T 260 95"
              fill="none"
              stroke="#ec4899"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 4 }}
            />

            {/* Stand */}
            <rect x="140" y="220" width="40" height="20" rx="4" fill="#1a1f3a" stroke="#00e5ff" strokeWidth="1" />
            <rect x="110" y="240" width="100" height="8" rx="4" fill="#1a1f3a" stroke="#00e5ff" strokeWidth="1" />

            {/* Floating dots */}
            <motion.circle
              cx="280" cy="80" r="6" fill="#00e5ff"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="30" cy="140" r="4" fill="#ec4899"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />
            <motion.circle
              cx="290" cy="200" r="5" fill="#a855f7"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 1 }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Floating image cards */}
      {floatingImages.map((img, i) => (
        <motion.div
          key={i}
          className={`absolute ${img.className} rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -12, 0],
            rotate: [0, i % 2 === 0 ? 3 : -3, 0],
          }}
          transition={{
            opacity: { duration: 0.6, delay: img.delay },
            scale: { duration: 0.6, delay: img.delay },
            y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: img.delay },
            rotate: { duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: img.delay },
          }}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent" />
        </motion.div>
      ))}

      {/* Orbiting icon */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[360px] h-[360px] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-lg backdrop-blur-sm">
          📊
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-lg backdrop-blur-sm">
          🤖
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-lg backdrop-blur-sm">
          ⏰
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg backdrop-blur-sm">
          ✅
        </div>
      </motion.div>
    </div>
  );
}
