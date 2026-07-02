import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Login            from "../pages/auth/Login";
import Register         from "../pages/auth/Register";
import AIChat           from "../pages/auth/AIChat";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import Attendance       from "../pages/employee/Attendance";
import WorkLogs         from "../pages/employee/WorkLogs";
import Leave            from "../pages/employee/Leave";
import Profile          from "../pages/employee/Profile";


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  // Allow preview in local development so designers/developers can view layout
  // without authenticating. In production this will redirect to login.
  if (token) return children;
  if (import.meta.env && import.meta.env.MODE && import.meta.env.MODE !== "production") {
    return children;
  }
  return <Navigate to="/login" replace />;
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/"          element={<Login />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
          <Route path="/worklogs"  element={<ProtectedRoute><WorkLogs /></ProtectedRoute>} />
          <Route path="/leave"     element={<ProtectedRoute><Leave /></ProtectedRoute>} />
          <Route path="/ai"        element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}