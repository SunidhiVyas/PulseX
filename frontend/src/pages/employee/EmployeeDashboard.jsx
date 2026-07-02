import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AttendanceChart from "../../components/AttendanceChart";
import AttendanceRing from "../../components/AttendanceRing";
import ActivityTimeline from "../../components/ActivityTimeline";
import AIWidget from "../../components/AIWidget";
import EmployeeAvatarCard from "../../components/EmployeeAvatarCard";
import BackgroundEffects from "../../components/BackgroundEffects";
import FloatingParticles from "../../components/FloatingParticles";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const fadeUpDelayed = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.15 } },
};

export default function EmployeeDashboard() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
  }, []);

  const [stats, setStats] = useState({
    attendanceCount: 0,
    leavesCount: 0,
    tasksCompleted: 0,
    hoursLogged: 0,
  });
  const [workLogs, setWorkLogs] = useState([]);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const statsRes = await axios.get("http://localhost:5000/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const logsRes = await axios.get("http://localhost:5000/api/worklog/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(statsRes.data);
      setWorkLogs(logsRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-x-hidden">
      <BackgroundEffects />
      <FloatingParticles />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className="px-10 xl:px-16 py-10 relative z-10 min-h-screen overflow-y-auto transition-all duration-300"
        style={{ marginLeft: collapsed ? 80 : 240 }}
      >
        {/* Navbar — only shows notification bell + user avatar */}
        <Navbar />

        {/* ── Good Afternoon Hero Card — ONLY welcome section ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          whileHover={{ scale: 1.005 }}
          className="relative glass-card shimmer-border rounded-3xl px-12 py-10 mt-6 overflow-hidden backdrop-blur-xl transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-pink-500/5" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

          <motion.img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop"
            alt=""
            className="absolute right-10 top-1/2 -translate-y-1/2 w-48 h-32 rounded-2xl object-cover opacity-20 hidden xl:block border border-white/10"
            animate={{ y: [0, -10, 0], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-4" style={{ transform: "translateX(8px)" }}>
                    Welcome Back 👋
              </p>
              <motion.h2
                className="text-4xl md:text-5xl font-black mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Good Afternoon{" "}
                <motion.span
                  animate={{ rotate: [0, 20, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  className="inline-block"
                >
                  👋
                </motion.span>
              </motion.h2>
              <p className="text-gray-400 text-base leading-relaxed">
                You completed{" "}
                <span className="text-cyan-400 font-semibold">
                  {stats.tasksCompleted} tasks
                </span>{" "}
                and logged{" "}
                <span className="text-pink-400 font-semibold">
                  {stats.hoursLogged}h
                </span>{" "}
                this week.
              </p>
              <motion.div
                className="mt-5 inline-flex items-center gap-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <span className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 px-5 py-2 rounded-xl border border-cyan-500/20 font-semibold text-sm">
                  Productivity Score: 92%
                </span>
                <motion.span
                  className="text-2xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  ⚡
                </motion.span>
              </motion.div>
            </div>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="hidden md:block text-8xl"
            >
              🚀
            </motion.div>
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          {[
            { title: "Attendance",   value: stats.attendanceCount, suffix: "",  icon: "📅", color: "text-cyan-400",    border: "border-cyan-500/20",    glow: "rgba(0,229,255,0.15)"   },
            { title: "Hours Logged", value: stats.hoursLogged,     suffix: "h", icon: "⏱️", color: "text-pink-400",    border: "border-pink-500/20",    glow: "rgba(236,72,153,0.15)"  },
            { title: "Tasks Done",   value: stats.tasksCompleted,  suffix: "",  icon: "✅", color: "text-yellow-400",  border: "border-yellow-500/20",  glow: "rgba(234,179,8,0.15)"   },
            { title: "Leaves",       value: stats.leavesCount,     suffix: "",  icon: "🌿", color: "text-emerald-400", border: "border-emerald-500/20", glow: "rgba(16,185,129,0.15)"  },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4, boxShadow: `0 8px 30px ${s.glow}` }}
              className={`glass-card shimmer-border rounded-2xl p-6 border ${s.border} transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{s.icon}</span>
                <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-lg bg-white/5 ${s.color}`}>
                  Live
                </span>
              </div>
              <p className="text-gray-400 text-sm font-medium mb-2">{s.title}</p>
              <p className={`text-4xl font-black ${s.color}`}>
                {s.value}{s.suffix}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8 items-start">
          <div className="lg:col-span-2">
            <AttendanceChart />
          </div>
          <div>
            <AttendanceRing />
          </div>
          <div>
            <AIWidget />
          </div>
        </div>

        {/* ── ZIGZAG Section ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-8 space-y-8"
        >
          {/* Row A */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <motion.div variants={fadeUp} className="lg:col-span-2">
              <div className="glass-card shimmer-border rounded-3xl p-8 backdrop-blur-xl hover:scale-[1.01] transition-all duration-300 h-full">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span>📋</span> Recent Work Logs
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 pr-4">Project</th>
                        <th className="text-left py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 pr-4">Task</th>
                        <th className="text-left py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 pr-4">Hours</th>
                        <th className="text-left py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workLogs.length > 0 ? workLogs.map((log, i) => (
                        <motion.tr
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.08 }}
                          className="border-b border-white/5 hover:bg-white/2 transition-colors"
                        >
                          <td className="py-4 font-medium text-sm text-white pr-4">{log.project}</td>
                          <td className="py-4 text-gray-300 text-sm pr-4">{log.title}</td>
                          <td className="py-4 text-cyan-400 font-bold text-sm pr-4">{log.hoursSpent}h</td>
                          <td className="py-4">
                            <span className="text-xs font-semibold px-3 py-1 rounded-full border border-cyan-500/20 text-cyan-400 bg-cyan-500/10">
                              {log.status}
                            </span>
                          </td>
                        </motion.tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="text-center text-gray-500 py-12 text-sm">
                            No work logs yet. Start logging! 📝
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Activity Timeline */}
            <motion.div variants={fadeUpDelayed} className="lg:mt-14">
              <ActivityTimeline />
            </motion.div>
          </div>

          {/* Row B */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <motion.div variants={fadeUp}>
              <EmployeeAvatarCard />
            </motion.div>

            {/* Weekly Highlights */}
            <motion.div variants={fadeUpDelayed} className="lg:col-span-2 lg:mt-14">
              <div className="glass-card shimmer-border rounded-3xl p-8 backdrop-blur-xl hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-pink-500/5" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🎯</span>
                    <h2 className="text-xl font-bold">Weekly Highlights</h2>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-7">
                    {[
                      { label: "Top Project", value: "PulseX", icon: "🏆", color: "text-yellow-400" },
                      { label: "Streak",      value: "5 days", icon: "🔥", color: "text-orange-400" },
                      { label: "AI Score",    value: "A+",     icon: "🤖", color: "text-cyan-400"   },
                    ].map((h, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05, y: -3 }}
                        className="glass-card rounded-2xl p-4 text-center cursor-default"
                      >
                        <div className="text-2xl mb-2">{h.icon}</div>
                        <div className={`${h.color} font-bold text-base`}>{h.value}</div>
                        <div className="text-gray-400 text-xs mt-1">{h.label}</div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Task Completion", pct: 85, color: "bg-cyan-400"   },
                      { label: "Attendance Rate",  pct: 95, color: "bg-pink-400"   },
                      { label: "Log Consistency",  pct: 72, color: "bg-purple-400" },
                    ].map((bar, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-gray-400 font-medium">{bar.label}</span>
                          <span className="text-white font-bold">{bar.pct}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${bar.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${bar.pct}%` }}
                            transition={{ duration: 1.2, delay: 0.4 + i * 0.15, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="h-14" />
      </div>
    </div>
  );
}