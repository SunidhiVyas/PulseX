import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const data = [
  { day: "Mon", hours: 8 },
  { day: "Tue", hours: 7 },
  { day: "Wed", hours: 9 },
  { day: "Thu", hours: 8 },
  { day: "Fri", hours: 6 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl px-4 py-2 border border-cyan-500/20">
        <p className="text-cyan-400 font-semibold">{label}</p>
        <p className="text-white">{payload[0].value} hours</p>
      </div>
    );
  }
  return null;
};

export default function AttendanceChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card shimmer-border rounded-3xl p-10 h-full backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Weekly Hours</h2>
        <motion.span
          className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Live
        </motion.span>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#00E5FF"
              strokeWidth={3}
              fill="url(#hoursGradient)"
              animationDuration={1500}
            />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#00E5FF"
              strokeWidth={3}
              dot={{ fill: "#00E5FF", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8, fill: "#ec4899", stroke: "#00E5FF", strokeWidth: 2 }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
