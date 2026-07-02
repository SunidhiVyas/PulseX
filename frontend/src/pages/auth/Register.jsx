import { useState } from "react";
import { FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundEffects from "../../components/BackgroundEffects";
import FloatingParticles from "../../components/FloatingParticles";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Register() {
  const navigate = useNavigate();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name, email, password, role: "EMPLOYEE",
      });
      console.log("REGISTER RESPONSE:", response.data);
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center relative overflow-hidden text-white px-4">
      <BackgroundEffects />
      <FloatingParticles />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">

        {/* Floating emoji above card */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl"
          >
            🚀
          </motion.div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="glass-card shimmer-border rounded-3xl px-10 py-10 relative"
        >
          {/* Glow blobs inside card */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-cyan-500/25 to-purple-500/25 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-tr from-pink-500/20 to-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-4xl font-black">
              Join <span className="gradient-text">PulseX</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Create your account and get started</p>
          </div>

          {/* Form */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-5 relative z-10"
          >
            {/* Name */}
            <motion.div variants={item}>
              <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider block mb-2">
                Full Name
              </label>
              <div className="flex items-center glass-card rounded-xl px-5 py-4 focus-within:border-cyan-500/50 transition-colors">
                <FiUser className="text-cyan-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent outline-none ml-3 w-full text-white placeholder:text-gray-500 text-sm"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={item}>
              <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider block mb-2">
                Email
              </label>
              <div className="flex items-center glass-card rounded-xl px-5 py-4 focus-within:border-cyan-500/50 transition-colors">
                <FiMail className="text-cyan-400 shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent outline-none ml-3 w-full text-white placeholder:text-gray-500 text-sm"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={item}>
              <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider block mb-2">
                Password
              </label>
              <div className="flex items-center glass-card rounded-xl px-5 py-4 focus-within:border-cyan-500/50 transition-colors">
                <FiLock className="text-cyan-400 shrink-0" />
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent outline-none ml-3 w-full text-white placeholder:text-gray-500 text-sm"
                />
              </div>
            </motion.div>

            {/* Button */}
            <motion.button
              variants={item}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0,229,255,0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegister}
              className="glow-btn w-full py-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#050816] flex items-center justify-center gap-2 mt-2"
            >
              Create Account <FiArrowRight />
            </motion.button>

            {/* Divider */}
            <motion.div variants={item} className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </motion.div>

            {/* Login link */}
            <motion.p variants={item} className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Login here
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}