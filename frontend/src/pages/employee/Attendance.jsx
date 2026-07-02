import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import BackgroundEffects from "../../components/BackgroundEffects";
import FloatingParticles from "../../components/FloatingParticles";
import { FiCheckCircle, FiXCircle, FiClock, FiCalendar } from "react-icons/fi";

const API = "http://localhost:5000/api";

const statusColor = (s) =>
  s === "PRESENT" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
  : s === "ABSENT" ? "text-red-400 bg-red-500/10 border-red-500/25"
  : "text-yellow-400 bg-yellow-500/10 border-yellow-500/25";

export default function Attendance() {
  const [collapsed, setCollapsed] = useState(false);
  const [records, setRecords]     = useState([]);
  const [stats, setStats]         = useState({ present: 0, absent: 0, late: 0, total: 0, totalHours: 0 });
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [recRes, statRes] = await Promise.all([
        axios.get(`${API}/attendance/all`,  { headers }),
        axios.get(`${API}/attendance/stats`, { headers }),
      ]);
      setRecords(recRes.data);
      setStats(statRes.data);

      // find today's record
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const found = recRes.data.find(
        (r) => new Date(r.date) >= todayStart
      );
      setTodayRecord(found || null);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    setActionMsg("");
    try {
      await axios.post(`${API}/attendance/checkin`, {}, { headers });
      setActionMsg("✅ Checked in successfully!");
      fetchAll();
    } catch (e) {
      setActionMsg("⚠️ " + (e.response?.data?.message || "Check-in failed"));
    }
    setLoading(false);
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setActionMsg("");
    try {
      await axios.post(`${API}/attendance/checkout`, {}, { headers });
      setActionMsg("✅ Checked out successfully!");
      fetchAll();
    } catch (e) {
      setActionMsg("⚠️ " + (e.response?.data?.message || "Check-out failed"));
    }
    setLoading(false);
  };

  const alreadyCheckedIn  = todayRecord && todayRecord.checkIn;
  const alreadyCheckedOut = todayRecord && todayRecord.checkOut;

  return (
      <div className="min-h-screen bg-[#050816] text-white relative overflow-x-hidden">
      <BackgroundEffects /><FloatingParticles />
      <div className="fixed top-20 right-20 w-72 h-72 bg-emerald-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-40 w-72 h-72 bg-cyan-500/6 rounded-full blur-3xl pointer-events-none" />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="px-10 xl:px-16 py-10 relative z-10 min-h-screen overflow-y-auto transition-all duration-300" style={{ marginLeft: collapsed ? 80 : 240 }}>
        <Navbar />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative glass-card shimmer-border rounded-3xl px-10 py-8 mt-6 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2" style={{ transform: "translateX(10px)" }}
>
Today</p>
              <h2 className="text-3xl font-black">
                Attendance <span className="gradient-text">Tracker</span>
              </h2>
              <p className="text-gray-400 mt-3 text-sm flex items-center gap-1">
                <FiCalendar size={13} /> {today}
              </p>
              {actionMsg && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`mt-3 text-sm font-semibold ${actionMsg.startsWith("✅") ? "text-emerald-400" : "text-red-400"}`}>
                  {actionMsg}
                </motion.p>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(16,185,129,0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCheckIn}
                disabled={!!alreadyCheckedIn || loading}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#050816] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
              >
                <FiCheckCircle size={16} />
                {alreadyCheckedIn ? "Checked In ✓" : "Check In"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(239,68,68,0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCheckOut}
                disabled={!alreadyCheckedIn || !!alreadyCheckedOut || loading}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-red-500 to-red-400 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
              >
                <FiXCircle size={16} />
                {alreadyCheckedOut ? "Checked Out ✓" : "Check Out"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Today's Status Card */}
        {todayRecord && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card shimmer-border rounded-2xl p-6 mb-8 border border-cyan-500/20">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Today's Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Status",    value: todayRecord.status, colored: true },
                { label: "Check In",  value: todayRecord.checkIn  ? new Date(todayRecord.checkIn).toLocaleTimeString("en-IN",  { hour: "2-digit", minute: "2-digit" }) : "—" },
                { label: "Check Out", value: todayRecord.checkOut ? new Date(todayRecord.checkOut).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—" },
                { label: "Hours",     value: todayRecord.hoursWorked ? `${todayRecord.hoursWorked}h` : "Active" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-gray-500 text-xs mb-1">{item.label}</p>
                  <p className={`font-bold text-base ${item.colored ? (todayRecord.status === "PRESENT" ? "text-emerald-400" : "text-red-400") : "text-white"}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-8">
          {[
            { label: "Present",      value: stats.present,    icon: "✅", color: "text-emerald-400", border: "border-emerald-500/20" },
            { label: "Absent",       value: stats.absent,     icon: "❌", color: "text-red-400",     border: "border-red-500/20"     },
            { label: "Late",         value: stats.late,       icon: "⏰", color: "text-yellow-400",  border: "border-yellow-500/20"  },
            { label: "Total Days",   value: stats.total,      icon: "📅", color: "text-cyan-400",    border: "border-cyan-500/20"    },
            { label: "Total Hours",  value: `${stats.totalHours}h`, icon: "⏱️", color: "text-pink-400", border: "border-pink-500/20" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }} whileHover={{ scale: 1.03, y: -3 }}
              className={`glass-card shimmer-border rounded-2xl p-5 border ${s.border}`}>
              <span className="text-xl">{s.icon}</span>
              <p className="text-gray-400 text-xs mt-3 mb-1 font-medium">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* History Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card shimmer-border rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FiClock className="text-cyan-400" /> Attendance History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["Date","Day","Check In","Check Out","Hours","Status"].map((h) => (
                    <th key={h} className="text-left py-3 pr-4 text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? records.map((r, i) => (
                  <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-4 pr-4 text-sm font-medium text-white">
                      {new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-4 pr-4 text-sm text-gray-400">
                      {new Date(r.date).toLocaleDateString("en-IN", { weekday: "short" })}
                    </td>
                    <td className="py-4 pr-4 text-sm text-gray-300">
                      {r.checkIn ? new Date(r.checkIn).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                    <td className="py-4 pr-4 text-sm text-gray-300">
                      {r.checkOut ? new Date(r.checkOut).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                    <td className="py-4 pr-4 text-sm text-cyan-400 font-bold">
                      {r.hoursWorked ? `${r.hoursWorked}h` : r.checkIn && !r.checkOut ? "Active" : "—"}
                    </td>
                    <td className="py-4">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${statusColor(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-14 text-sm">
                      <div className="text-4xl mb-3">📅</div>
                      No attendance records yet. Check in to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
        <div className="h-12" />
      </div>
    </div>
  );
}