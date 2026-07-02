import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import BackgroundEffects from "../../components/BackgroundEffects";
import FloatingParticles from "../../components/FloatingParticles";
import {
  FiPlus, FiX, FiCalendar, FiClock,
  FiCheckCircle, FiXCircle, FiTrash2,
} from "react-icons/fi";

const API = "http://localhost:5000/api";

const leaveTypeColor = (t) =>
  t === "CASUAL" ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/25"
  : t === "SICK"  ? "text-pink-400 bg-pink-500/10 border-pink-500/25"
  : "text-purple-400 bg-purple-500/10 border-purple-500/25";

const statusStyle = (s) =>
  s === "APPROVED" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
  : s === "REJECTED" ? "text-red-400 bg-red-500/10 border-red-500/25"
  : "text-yellow-400 bg-yellow-500/10 border-yellow-500/25";

const statusIcon = (s) =>
  s === "APPROVED" ? <FiCheckCircle />
  : s === "REJECTED" ? <FiXCircle />
  : <FiClock />;

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all";

const daysBetween = (from, to) => {
  const diff = new Date(to) - new Date(from);
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
};

export default function Leave() {
  const [collapsed, setCollapsed] = useState(false);
  const [leaves, setLeaves]       = useState([]);
  const [stats, setStats]         = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [showModal, setShowModal] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const [filter, setFilter]       = useState("ALL");
  const [form, setForm]           = useState({
    type: "CASUAL", fromDate: "", toDate: "", reason: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchLeaves();
    fetchStats();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${API}/leave/all`, { headers });
      setLeaves(res.data);
    } catch (e) { console.log(e); }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/leave/stats`, { headers });
      setStats(res.data);
    } catch (e) { console.log(e); }
  };

  const handleSubmit = async () => {
    setFormError("");
    if (!form.fromDate || !form.toDate || !form.reason.trim()) {
      setFormError("Please fill in all fields."); return;
    }
    if (new Date(form.fromDate) > new Date(form.toDate)) {
      setFormError("From date cannot be after To date."); return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/leave/apply`, form, { headers });
      setShowModal(false);
      setForm({ type: "CASUAL", fromDate: "", toDate: "", reason: "" });
      fetchLeaves();
      fetchStats();
    } catch (e) {
      setFormError(e.response?.data?.message || "Failed to apply. Try again.");
    }
    setSubmitting(false);
  };

  const handleCancel = async (id) => {
    setCancelling(id);
    try {
      await axios.delete(`${API}/leave/cancel/${id}`, { headers });
      fetchLeaves();
      fetchStats();
    } catch (e) {
      alert(e.response?.data?.message || "Cancel failed");
    }
    setCancelling(null);
  };

  const filtered = filter === "ALL"
    ? leaves
    : leaves.filter((l) => l.status === filter);

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-x-hidden">
      <BackgroundEffects />
      <FloatingParticles />

      {/* Neon atmosphere */}
      <div className="fixed top-32 right-20 w-72 h-72 bg-yellow-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-32 left-40 w-72 h-72 bg-emerald-500/6 rounded-full blur-3xl pointer-events-none" />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="px-10 xl:px-16 py-10 relative z-10 min-h-screen overflow-y-auto transition-all duration-300" style={{ marginLeft: collapsed ? 80 : 240 }}>
        <Navbar />

        {/* ── Header Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative glass-card shimmer-border rounded-3xl px-10 py-8 mt-6 mb-8 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-emerald-500/5" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2" style={{ transform: "translateX(8px)" }}>
                Manage your time off
              </p>
              <h2 className="text-3xl font-black">
                Leave{" "}
                <span className="gradient-text">Management</span>
              </h2>
              <p className="text-gray-400 mt-2 text-sm">
                <span className="text-yellow-400 font-semibold">{stats.pending} pending</span>
                {" · "}
                <span className="text-emerald-400 font-semibold">{stats.approved} approved</span>
                {" · "}
                <span className="text-red-400 font-semibold">{stats.rejected} rejected</span>
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 28px rgba(234,179,8,0.4)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setFormError(""); setShowModal(true); }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-yellow-500 to-orange-400 text-[#050816] shadow-lg"
            >
              <FiPlus size={16} /> Apply for Leave
            </motion.button>
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Total Applied", value: stats.total,    icon: "📋", color: "text-cyan-400",    border: "border-cyan-500/20"    },
            { label: "Pending",       value: stats.pending,  icon: "⏳", color: "text-yellow-400",  border: "border-yellow-500/20"  },
            { label: "Approved",      value: stats.approved, icon: "✅", color: "text-emerald-400", border: "border-emerald-500/20" },
            { label: "Rejected",      value: stats.rejected, icon: "❌", color: "text-red-400",     border: "border-red-500/20"     },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03, y: -3 }}
              className={`glass-card shimmer-border rounded-2xl p-5 border ${s.border}`}
            >
              <span className="text-2xl">{s.icon}</span>
              <p className="text-gray-400 text-xs mt-3 mb-1 font-medium">{s.label}</p>
              <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                filter === f
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/20"
                  : "glass-card text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>

        {/* ── Leave Cards Grid ── */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((leave, i) => (
                <motion.div
                  key={leave.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="glass-card shimmer-border rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Status glow top line */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 ${
                    leave.status === "APPROVED" ? "bg-emerald-400/60"
                    : leave.status === "REJECTED" ? "bg-red-400/60"
                    : "bg-yellow-400/60"
                  }`} />

                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${leaveTypeColor(leave.type)}`}>
                      {leave.type}
                    </span>
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${statusStyle(leave.status)}`}>
                      {statusIcon(leave.status)} {leave.status}
                    </span>
                  </div>

                  {/* Reason */}
                  <p className="text-white text-sm font-semibold leading-relaxed mb-4 line-clamp-2">
                    {leave.reason}
                  </p>

                  {/* Date range */}
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                    <FiCalendar size={12} className="shrink-0" />
                    <span>
                      {new Date(leave.fromDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {" → "}
                      {new Date(leave.toDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  {/* Days count */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <span className="text-gray-400 text-xs">
                      <span className="text-white font-bold text-base">
                        {daysBetween(leave.fromDate, leave.toDate)}
                      </span>{" "}
                      {daysBetween(leave.fromDate, leave.toDate) === 1 ? "day" : "days"}
                    </span>

                    {/* Cancel button — only for PENDING */}
                    {leave.status === "PENDING" && (
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCancel(leave.id)}
                        disabled={cancelling === leave.id}
                        className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all disabled:opacity-50"
                      >
                        <FiTrash2 size={11} />
                        {cancelling === leave.id ? "Cancelling..." : "Cancel"}
                      </motion.button>
                    )}
                  </div>

                  {/* Applied date */}
                  <p className="text-gray-600 text-xs mt-2">
                    Applied {new Date(leave.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="text-6xl mb-4">🌿</div>
              <p className="text-gray-400 text-base font-medium">
                {filter === "ALL" ? "No leaves applied yet." : `No ${filter.toLowerCase()} leaves.`}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {filter === "ALL" && "Click 'Apply for Leave' to get started."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Apply Leave Modal ── */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center px-4"
              onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.88, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 24 }}
                transition={{ type: "spring", damping: 20 }}
                className="glass-card shimmer-border rounded-3xl p-8 w-full max-w-lg relative overflow-hidden"
              >
                {/* Glow blobs */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-yellow-500/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

                {/* Close */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(false);
                  }}
                  className="absolute top-4 right-4 z-[9999] w-10 h-10 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/40 cursor-pointer"
                >
                  <FiX size={22} className="text-white" />
                </button>

                {/* Title */}
                <div className="flex items-center gap-3 mb-7 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 flex items-center justify-center text-xl">
                    🌿
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Apply for Leave</h3>
                    <p className="text-gray-400 text-xs mt-0.5">Fill in the details below</p>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-5 relative z-10">

                  {/* Leave Type */}
                  <div>
                    <label className="text-gray-300 text-xs font-bold uppercase tracking-wider block mb-2">
                      Leave Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["CASUAL", "SICK", "EARNED"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm({ ...form, type: t })}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                            form.type === t
                              ? t === "CASUAL"
                                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                                : t === "SICK"
                                ? "bg-pink-500/20 border-pink-500/50 text-pink-400"
                                : "bg-purple-500/20 border-purple-500/50 text-purple-400"
                              : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          {t === "CASUAL" ? "🏖️" : t === "SICK" ? "🤒" : "📅"} {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-300 text-xs font-bold uppercase tracking-wider block mb-2">
                        From Date *
                      </label>
                      <input
                        type="date"
                        className={inputCls}
                        value={form.fromDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-xs font-bold uppercase tracking-wider block mb-2">
                        To Date *
                      </label>
                      <input
                        type="date"
                        className={inputCls}
                        value={form.toDate}
                        min={form.fromDate || new Date().toISOString().split("T")[0]}
                        onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Days preview */}
                  {form.fromDate && form.toDate && new Date(form.fromDate) <= new Date(form.toDate) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
                    >
                      <FiCalendar className="text-cyan-400" size={14} />
                      <span className="text-cyan-400 text-sm font-semibold">
                        {daysBetween(form.fromDate, form.toDate)}{" "}
                        {daysBetween(form.fromDate, form.toDate) === 1 ? "day" : "days"} of leave
                      </span>
                    </motion.div>
                  )}

                  {/* Reason */}
                  <div>
                    <label className="text-gray-300 text-xs font-bold uppercase tracking-wider block mb-2">
                      Reason *
                    </label>
                    <textarea
                      rows={3}
                      className={inputCls}
                      placeholder="Briefly describe the reason for your leave..."
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    />
                    <p className="text-gray-600 text-xs mt-1 text-right">
                      {form.reason.length}/200
                    </p>
                  </div>

                  {/* Error */}
                  {formError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm font-medium flex items-center gap-2"
                    >
                      <FiXCircle size={14} /> {formError}
                    </motion.p>
                  )}

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(234,179,8,0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-400 text-[#050816] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                  >
                    {submitting ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-[#050816]/30 border-t-[#050816] rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        Submitting...
                      </>
                    ) : (
                      <><FiCalendar size={15} /> Submit Leave Request</>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-12" />
      </div>
    </div>
  );
}