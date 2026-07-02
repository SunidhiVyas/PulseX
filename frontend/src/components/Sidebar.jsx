import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiGrid, FiClock, FiFileText, FiCalendar,
  FiUser, FiLogOut, FiChevronLeft, FiChevronRight, FiCpu,
} from "react-icons/fi";

const navItems = [
  { label: "Dashboard",  icon: FiGrid,     path: "/dashboard" },
  { label: "Attendance", icon: FiClock,    path: "/attendance" },
  { label: "Work Logs",  icon: FiFileText, path: "/worklogs" },
  { label: "Leave",      icon: FiCalendar, path: "/leave" },
  { label: "AI Chat",    icon: FiCpu,      path: "/ai" },
  { label: "Profile",    icon: FiUser,     path: "/profile" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 flex flex-col glass-card border-r border-white/8 h-screen z-20 overflow-hidden shrink-0"
    >
      {/* Collapse toggle */}
      <motion.button
        onClick={() => setCollapsed(!collapsed)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute -right-3 top-8 z-30 w-6 h-6 rounded-full bg-cyan-500 text-[#050816] flex items-center justify-center shadow-lg shadow-cyan-500/30"
      >
        {collapsed ? <FiChevronRight size={12} /> : <FiChevronLeft size={12} />}
      </motion.button>

      {/* Logo */}
      <div className="px-6 py-8 border-b border-white/5">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-2xl font-black">
                Pulse<span className="gradient-text">X</span>
              </h1>
              <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">
                Employee Portal
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-2xl font-black gradient-text text-center"
            >
              P
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon   = item.icon;
          const active = location.pathname === item.path;

          return (
            <motion.button
              key={item.label}
              onClick={() => navigate(item.path)}
              whileHover={{ x: collapsed ? 0 : 4 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                active
                  ? "bg-cyan-500/15 border border-cyan-500/25 text-cyan-400"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full"
                />
              )}
              <Icon
                size={18}
                className={`shrink-0 ${active ? "text-cyan-400" : "text-gray-400 group-hover:text-white"}`}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800 border border-white/10 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-6 border-t border-white/5">
        <motion.button
          onClick={handleLogout}
          whileHover={{ x: collapsed ? 0 : 4 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group relative"
        >
          <FiLogOut size={18} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-semibold whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800 border border-white/10 rounded-lg text-xs font-medium text-red-400 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
              Logout
            </div>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}