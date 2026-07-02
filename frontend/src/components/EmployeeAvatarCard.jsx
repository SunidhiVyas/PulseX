import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function EmployeeAvatarCard() {
  const [user, setUser] = useState({
    name: "",
    role: "",
    profileImage: localStorage.getItem("profileImage") || "",
  });

  useEffect(() => {
    fetchProfile();

    const handler = (e) => {
      setUser((u) => ({ ...u, profileImage: e.detail }));
    };
    window.addEventListener("profileImageUpdated", handler);
    return () => window.removeEventListener("profileImageUpdated", handler);
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({
        name: res.data.name,
        role: res.data.role || "Employee",
        profileImage: res.data.profileImage || "",
      });
      if (res.data.profileImage) {
        localStorage.setItem("profileImage", res.data.profileImage);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fallbackImg =
    "https://ui-avatars.com/api/?background=0891b2&color=fff&size=150&name=" +
    encodeURIComponent(user.name || "User");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.55 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="glass-card shimmer-border rounded-3xl p-10 text-center h-full relative overflow-hidden backdrop-blur-xl transition-all duration-300"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-pink-500/5"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative">
        <motion.div
          className="relative inline-block"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 blur-md opacity-40"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <img
            src={user.profileImage || fallbackImg}
            alt={user.name || "Employee"}
            className="relative w-24 h-24 rounded-full object-cover border-2 border-cyan-500/50 mx-auto"
          />
        </motion.div>

        <motion.h2
          className="text-2xl font-bold mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {user.name || "—"}
        </motion.h2>
        <p className="text-gray-400 mt-1 text-sm">{user.role}</p>

        <motion.div
          className="mt-5 inline-block"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="bg-gradient-to-r from-cyan-500/20 to-pink-500/20 text-cyan-400 rounded-xl py-2 px-4 text-sm font-semibold border border-cyan-500/20">
            ⭐ Top Performer
          </span>
        </motion.div>

        <div className="mt-5 flex justify-center gap-3">
          {["🎯", "💪", "🔥"].map((emoji, i) => (
            <motion.span
              key={i}
              className="text-xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}