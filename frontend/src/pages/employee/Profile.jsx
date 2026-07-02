import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import BackgroundEffects from "../../components/BackgroundEffects";
import FloatingParticles from "../../components/FloatingParticles";
import { FiUser, FiMail, FiBriefcase, FiEdit2, FiSave, FiX, FiLock, FiCalendar } from "react-icons/fi";

const API = "http://localhost:5000/api";

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/50 transition-all";

export default function Profile() {
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile]     = useState(null);
  const [editing, setEditing]     = useState(false);
  const [form, setForm]           = useState({ name: "", department: "", password: "" });
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState("");
  const [uploading, setUploading] = useState(false);
  const [dashStats, setDashStats] = useState({ attendanceCount: 0, hoursLogged: 0, tasksCompleted: 0, leavesCount: 0 });

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [profRes, statRes] = await Promise.all([
        axios.get(`${API}/user/profile`,    { headers }),
        axios.get(`${API}/dashboard/stats`, { headers }),
      ]);
      setProfile(profRes.data);
      setForm({ name: profRes.data.name, department: profRes.data.department || "", password: "" });
      setDashStats(statRes.data);

      if (profRes.data.profileImage) {
        localStorage.setItem("profileImage", profRes.data.profileImage);
      }
    } catch (e) { console.log(e); }
  };

  const uploadImage = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSaveMsg("⚠️ Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSaveMsg("⚠️ Image must be under 5MB.");
      return;
    }

    setUploading(true);
    setSaveMsg("");

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await axios.post(`${API}/user/upload-photo`, formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });

      const newImageUrl = res.data.profileImage;

      setProfile((p) => ({ ...p, profileImage: newImageUrl }));
      localStorage.setItem("profileImage", newImageUrl);
      window.dispatchEvent(new CustomEvent("profileImageUpdated", { detail: newImageUrl }));

      setSaveMsg("✅ Profile picture updated!");
    } catch (e) {
      console.log(e);
      setSaveMsg("⚠️ " + (e.response?.data?.message || "Image upload failed"));
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const payload = {};
      if (form.name.trim())       payload.name       = form.name.trim();
      if (form.department.trim()) payload.department = form.department.trim();
      if (form.password.trim())   payload.password   = form.password.trim();

      if (Object.keys(payload).length === 0) {
        setSaveMsg("⚠️ No changes to save.");
        setSaving(false);
        return;
      }

      await axios.put(`${API}/user/profile`, payload, { headers });
      setSaveMsg("✅ Profile updated successfully!");
      setEditing(false);
      setForm((f) => ({ ...f, password: "" }));
      fetchAll();
    } catch (e) {
      setSaveMsg("⚠️ " + (e.response?.data?.message || "Update failed"));
    }
    setSaving(false);
  };

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  const profileStats = [
    { label: "Days Present", value: dashStats.attendanceCount, icon: "✅", color: "text-emerald-400", border: "border-emerald-500/20" },
    { label: "Hours Logged", value: `${dashStats.hoursLogged}h`, icon: "⏱️", color: "text-pink-400",    border: "border-pink-500/20"    },
    { label: "Tasks Done",   value: dashStats.tasksCompleted,   icon: "🎯", color: "text-cyan-400",    border: "border-cyan-500/20"    },
    { label: "Leaves Used",  value: dashStats.leavesCount,      icon: "🌿", color: "text-yellow-400",  border: "border-yellow-500/20"  },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-x-hidden">
      <BackgroundEffects /><FloatingParticles />
      <div className="fixed top-20 right-20 w-72 h-72 bg-purple-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-40 w-72 h-72 bg-cyan-500/6 rounded-full blur-3xl pointer-events-none" />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="px-10 xl:px-16 py-10 relative z-10 min-h-screen overflow-y-auto transition-all duration-300" style={{ marginLeft: collapsed ? 80 : 240 }}>
        <Navbar />

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Avatar Card */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="glass-card shimmer-border rounded-3xl p-8 relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

              <div className="relative z-10">
                <div className="relative inline-block mb-5">
                  <label className="cursor-pointer relative inline-block">
                    <img
                      src={
                        profile?.profileImage ||
                        "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile?.name || "User")
                      }
                      alt="Profile"
                      className={`w-28 h-28 rounded-3xl object-cover border-2 border-cyan-500 shadow-xl shadow-cyan-500/20 transition-opacity ${uploading ? "opacity-50" : ""}`}
                    />

                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => uploadImage(e.target.files[0])}
                    />

                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold">
                      {uploading ? (
                        <motion.div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full"
                          animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                      ) : "📷"}
                    </div>
                  </label>

                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-emerald-400 rounded-full border-2 border-[#050816] shadow-lg shadow-emerald-400/50" />
                </div>

                <h2 className="text-2xl font-black">{profile?.name || "—"}</h2>
                <p className="text-cyan-400 text-sm font-semibold mt-1">{profile?.role || "Employee"}</p>
                {profile?.department && (
                  <p className="text-gray-400 text-xs mt-1">{profile.department}</p>
                )}

                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs font-bold">Active</span>
                </div>

                <div className="mt-5 space-y-2.5 text-left">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 border border-white/5">
                    <FiMail size={14} className="text-cyan-400 shrink-0" />
                    <span className="text-gray-300 text-xs truncate">{profile?.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 border border-white/5">
                    <FiCalendar size={14} className="text-purple-400 shrink-0" />
                    <span className="text-gray-300 text-xs">Member since {memberSince}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Details Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 glass-card shimmer-border rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black flex items-center gap-2">
                    <FiUser className="text-cyan-400" /> Personal Details
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">
                    {editing ? "Edit your information below" : "View your account information"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {editing && (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setEditing(false); setSaveMsg(""); }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm glass-card border border-white/10 text-gray-400 hover:text-white transition-all">
                      <FiX size={14} /> Cancel
                    </motion.button>
                  )}
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    onClick={() => editing ? handleSave() : setEditing(true)}
                    disabled={saving}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 ${
                      editing
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#050816] shadow-lg shadow-emerald-500/20"
                        : "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                    }`}>
                    {saving ? (
                      <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                    ) : editing ? (
                      <><FiSave size={14} /> Save Changes</>
                    ) : (
                      <><FiEdit2 size={14} /> Edit Profile</>
                    )}
                  </motion.button>
                </div>
              </div>

              {saveMsg && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`mb-5 px-4 py-3 rounded-xl text-sm font-semibold ${
                    saveMsg.startsWith("✅")
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}>
                  {saveMsg}
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Full Name",  field: "name",       icon: FiUser,      placeholder: "Your full name",   editable: true  },
                  { label: "Email",      field: "email",      icon: FiMail,      placeholder: "Email address",    editable: false },
                  { label: "Role",       field: "role",       icon: FiBriefcase, placeholder: "Your role",        editable: false },
                  { label: "Department", field: "department", icon: FiBriefcase, placeholder: "e.g. Engineering", editable: true  },
                ].map(({ label, field, icon: Icon, placeholder, editable }) => (
                  <div key={field}>
                    <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
                      <Icon size={11} className="text-cyan-400" /> {label}
                    </label>
                    {editing && editable ? (
                      <input className={inputCls} placeholder={placeholder}
                        value={form[field] || ""}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
                    ) : (
                      <div className="px-4 py-3 rounded-xl bg-white/3 border border-white/5 text-white text-sm font-medium">
                        {profile?.[field] || "—"}
                      </div>
                    )}
                  </div>
                ))}

                {editing && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    className="md:col-span-2">
                    <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
                      <FiLock size={11} className="text-cyan-400" /> New Password
                      <span className="text-gray-600 font-normal normal-case">(leave blank to keep current)</span>
                    </label>
                    <input type="password" className={inputCls} placeholder="Enter new password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {profileStats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }} whileHover={{ scale: 1.03, y: -4 }}
                className={`glass-card shimmer-border rounded-2xl p-6 text-center border ${s.border}`}>
                <div className="text-3xl mb-3">{s.icon}</div>
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-gray-400 text-xs mt-1.5 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="h-12" />
      </div>
    </div>
  );
}