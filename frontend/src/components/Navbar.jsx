import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import axios from "axios";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex items-center justify-end gap-4 mb-2">
      {/* Notification Bell */}
      <button className="relative w-10 h-10 rounded-xl glass-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-500/30 transition-all">
        <FiBell size={18} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
      </button>

      {/* User Avatar */}
      <div className="flex items-center gap-3 glass-card border border-white/10 rounded-xl px-4 py-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-sm font-black text-white shadow-lg">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="hidden md:block">
          <p className="text-white text-sm font-bold leading-none">
            {user?.name || "User"}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">
            {user?.role || "EMPLOYEE"}
          </p>
        </div>
      </div>
    </div>
  );
}