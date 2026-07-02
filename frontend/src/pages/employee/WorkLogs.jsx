import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import BackgroundEffects from "../../components/BackgroundEffects";
import FloatingParticles from "../../components/FloatingParticles";
import { FiPlus, FiX, FiEdit3, FiTrash2, FiClock, FiCheck } from "react-icons/fi";

const API = "http://localhost:5000/api";

const statusStyle = (s) =>
  s === "COMPLETED"   ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
  : s === "IN_PROGRESS" ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/25"
  : "text-yellow-400 bg-yellow-500/10 border-yellow-500/25";

const statusIcon = (s) =>
  s === "COMPLETED" ? "✅" : s === "IN_PROGRESS" ? "🔄" : "⏳";

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/50 transition-all";

const emptyForm = { project: "", title: "", hoursSpent: "", status: "IN_PROGRESS", description: "" };

export default function WorkLogs() {
  const [collapsed, setCollapsed] = useState(false);
  const [logs, setLogs]           = useState([]);
  const [stats, setStats]         = useState({ total: 0, completed: 0, inProgress: 0, pending: 0, totalHours: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editLog, setEditLog]     = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting]   = useState(null);
  const [filter, setFilter]       = useState("ALL");

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [logsRes, statsRes] = await Promise.all([
        axios.get(`${API}/worklog/all`,   { headers }),
        axios.get(`${API}/worklog/stats`, { headers }),
      ]);
      setLogs(logsRes.data);
      setStats(statsRes.data);
    } catch (e) { console.log(e); }
  };

  const openAdd = () => {
    setEditLog(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (log) => {
    setEditLog(log);
    setForm({
      project:     log.project,
      title:       log.title,
      hoursSpent:  log.hoursSpent,
      status:      log.status,
      description: log.description || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setFormError("");
    if (!form.project.trim() || !form.title.trim() || !form.hoursSpent) {
      setFormError("Project, title and hours are required."); return;
    }
    if (parseFloat(form.hoursSpent) <= 0) {
      setFormError("Hours must be greater than 0."); return;
    }
    setSubmitting(true);
    try {
      if (editLog) {
        await axios.put(`${API}/worklog/update/${editLog.id}`, form, { headers });
      } else {
        await axios.post(`${API}/worklog/add`, form, { headers });
      }
      
      await fetchAll();
      setShowModal(false);
      setForm(emptyForm);
    } catch (e) {
      setFormError(e.response?.data?.message || "Failed. Try again.");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await axios.delete(`${API}/worklog/delete/${id}`, { headers });
      fetchAll();
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed");
    }
    setDeleting(null);
  };

  const filtered = filter === "ALL" ? logs : logs.filter((l) => l.status === filter);

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-x-hidden">
      <BackgroundEffects /><FloatingParticles />
      <div className="fixed top-20 right-20 w-72 h-72 bg-pink-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-40 w-72 h-72 bg-purple-500/6 rounded-full blur-3xl pointer-events-none" />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="px-10 xl:px-16 py-10 relative z-10 min-h-screen overflow-y-auto transition-all duration-300" style={{ marginLeft: collapsed ? 80 : 240 }}>
        <Navbar />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative glass-card shimmer-border rounded-3xl px-10 py-8 mt-6 mb-8 overflow-hidden ">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2" style={{ transform: "translateX(10px)" }}>Track your work</p>
              <h2 className="text-3xl font-black">Work <span className="gradient-text">Logs</span></h2>
              <p className="text-gray-400 mt-1.5 text-sm">
                <span className="text-pink-400 font-semibold">{ stats.totalHours}h</span> logged ·{" "}
                <span className="text-emerald-400 font-semibold">{stats.completed}</span> completed ·{" "}
                <span className="text-cyan-400 font-semibold">{stats.inProgress}</span> in progress
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 28px rgba(236,72,153,0.4)" }}
              whileTap={{ scale: 0.97 }}
              onClick={openAdd}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
            >
              <FiPlus size={16} /> Add Work Log
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-8">
          {[
            { label: "Total Logs",   value: stats.total,       icon: "📋", color: "text-cyan-400",    border: "border-cyan-500/20"    },
            { label: "Completed",    value: stats.completed,   icon: "✅", color: "text-emerald-400", border: "border-emerald-500/20" },
            { label: "In Progress",  value: stats.inProgress,  icon: "🔄", color: "text-pink-400",    border: "border-pink-500/20"    },
            { label: "Pending",      value: stats.pending,     icon: "⏳", color: "text-yellow-400",  border: "border-yellow-500/20"  },
            { label: "Total Hours",  value: `${stats.totalHours}h`, icon: "⏱️", color: "text-purple-400", border: "border-purple-500/20" },
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

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["ALL","IN_PROGRESS","COMPLETED","PENDING"].map((f) => (
            <motion.button key={f} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                  : "glass-card text-gray-400 hover:text-white border border-white/10"
              }`}>
              {f.replace("_", " ")}
            </motion.button>
          ))}
        </div>

        {/* Cards */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((log, i) => (
                <motion.div key={log.id} layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="glass-card shimmer-border rounded-2xl p-6 transition-all duration-300 relative overflow-visible z=50">

                  <div className={`absolute top-0 left-0 right-0 h-0.5 ${
                    log.status === "COMPLETED" ? "bg-emerald-400/60"
                    : log.status === "IN_PROGRESS" ? "bg-cyan-400/60"
                    : "bg-yellow-400/60"}`} />

                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400">
                      {log.project}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1 ${statusStyle(log.status)}`}>
                      {statusIcon(log.status)} {log.status.replace("_"," ")}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-base mt-3 mb-2 leading-snug">{log.title}</h3>
                  {log.description && (
                    <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{log.description}</p>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <FiClock size={12} className="text-cyan-400" />
                      <span className="text-cyan-400 font-black text-xl">{log.hoursSpent}</span>
                      <span className="text-gray-400 text-xs">hrs</span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {new Date(log.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => openEdit(log)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all">
                      <FiEdit3 size={12} /> Edit
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(log.id)}
                      disabled={deleting === log.id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all disabled:opacity-50">
                      <FiTrash2 size={12} /> {deleting === log.id ? "..." : "Delete"}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-400 font-medium">
                {filter === "ALL" ? "No work logs yet." : `No ${filter.replace("_"," ").toLowerCase()} logs.`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center px-4"
              onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
              <motion.div
                initial={{ scale: 0.88, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 24 }}
                transition={{ type: "spring", damping: 20 }}
                className="glass-card shimmer-border rounded-3xl p-8 w-full max-w-lg relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(false);
                  }}
                  className="absolute top-4 right-4 z-[9999] w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center cursor-pointer"
         >
                  <FiX size={22} className="text-white" />
                </button>

                <div className="flex items-center gap-3 mb-7 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20 flex items-center justify-center text-xl">
                    📝
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{editLog ? "Edit Work Log" : "Add Work Log"}</h3>
                    <p className="text-gray-400 text-xs mt-0.5">Fill in the task details</p>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div>
                    <label className="text-gray-300 text-xs font-bold uppercase tracking-wider block mb-2">Project *</label>
                    <input className={inputCls} placeholder="e.g. PulseX Dashboard"
                      value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-bold uppercase tracking-wider block mb-2">Task Title *</label>
                    <input className={inputCls} placeholder="e.g. Built login UI"
                      value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-300 text-xs font-bold uppercase tracking-wider block mb-2">Hours *</label>
                      <input type="number" min="0.5" step="0.5" className={inputCls} placeholder="e.g. 3.5"
                        value={form.hoursSpent} onChange={(e) => setForm({ ...form, hoursSpent: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-gray-300 text-xs font-bold uppercase tracking-wider block mb-2">Status</label>
                      <select className={inputCls} value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="PENDING">Pending</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-bold uppercase tracking-wider block mb-2">Description</label>
                    <textarea rows={3} className={inputCls} placeholder="Brief description (optional)"
                      value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>

                  {formError && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-red-400 text-sm font-medium flex items-center gap-2">
                      ⚠️ {formError}
                    </motion.p>
                  )}

                  <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(236,72,153,0.4)" }}
                    whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={submitting}
                    className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center gap-2 disabled:opacity-60 text-sm">
                    {submitting ? (
                      <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                    ) : (
                      <><FiCheck size={15} /> {editLog ? "Save Changes" : "Add Work Log"}</>
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