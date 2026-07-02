import { useState } from "react";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundEffects from "../../components/BackgroundEffects";
import FloatingParticles from "../../components/FloatingParticles";
import AnimatedIllustration from "../../components/AnimatedIllustration";

const features = [
  { icon: "⏰", title: "Attendance", desc: "Smart check-in & check-out", color: "text-cyan-400", border: "hover:border-cyan-500/30" },
  { icon: "🤖", title: "AI Reports", desc: "Weekly team insights", color: "text-pink-400", border: "hover:border-pink-500/30" },
  { icon: "📊", title: "Analytics", desc: "Real-time dashboards", color: "text-purple-400", border: "hover:border-purple-500/30" },
  { icon: "✅", title: "Work Logs", desc: "Track every task", color: "text-emerald-400", border: "hover:border-emerald-500/30" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      console.log("LOGIN RESPONSE:", response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
  console.log(error);
  console.log(error.response);
  console.log(error.message);

  alert("Login failed");
}
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center relative overflow-hidden text-white">
      <BackgroundEffects />
      <FloatingParticles />

      <div className="relative z-10 max-w-7xl w-full px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center min-h-screen">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center pr-4 lg:pr-16"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-sm font-medium">Workforce Intelligence Platform</span>
            </motion.div>

            <h1 className="text-6xl xl:text-7xl font-black tracking-tight">
              Pulse<span className="gradient-text">X</span>
            </h1>

            <p className="mt-5 text-xl text-gray-300 leading-relaxed max-w-lg">
              Attendance Tracking, Work Logs, Leave Management, Team Insights and AI Powered Analytics — all in one futuristic workspace.
            </p>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="mt-12 grid grid-cols-2 gap-5"
            >
              {features.map((f) => (
                <motion.div
                  key={f.title}
                  variants={item}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className={`glass-card shimmer-border rounded-2xl p-5 cursor-default ${f.border}`}
                >
                  <span className="text-2xl">{f.icon}</span>
                  <h3 className={`${f.color} font-bold mt-2`}>{f.title}</h3>
                  <p className="text-gray-400 mt-1 text-sm">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Generous gap before the illustration */}
            <div className="mt-20">
              <AnimatedIllustration />
            </div>
          </motion.div>

          {/* RIGHT — Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card shimmer-border rounded-3xl px-12 py-16 relative max-w-xl mx-auto w-full min-h-[620px] flex flex-col justify-center"
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-cyan-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse-glow pointer-events-none" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 mb-5 text-3xl">
                🔐
              </div>
              <h2 className="text-4xl font-bold">Welcome Back</h2>
              <p className="text-gray-400 mt-2 text-base">Sign in to your PulseX account</p>
            </motion.div>

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
              <motion.div variants={item}>
                <label className="text-gray-300 text-sm font-semibold block mb-2">Email</label>
                <div className="flex items-center glass-card rounded-xl px-5 py-4 focus-within:border-cyan-500/50 transition-colors">
                  <FiMail className="text-cyan-400 shrink-0 text-lg" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent outline-none ml-3 w-full text-white placeholder:text-gray-500 text-sm"
                  />
                </div>
              </motion.div>

              <motion.div variants={item}>
                <label className="text-gray-300 text-sm font-semibold block mb-2">Password</label>
                <div className="flex items-center glass-card rounded-xl px-5 py-4 focus-within:border-cyan-500/50 transition-colors">
                  <FiLock className="text-cyan-400 shrink-0 text-lg" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent outline-none ml-3 w-full text-white placeholder:text-gray-500 text-sm"
                  />
                </div>
              </motion.div>

              <motion.div variants={item} className="text-right -mt-2">
                <span className="text-cyan-400 text-xs hover:text-cyan-300 cursor-pointer transition-colors">
                  Forgot password?
                </span>
              </motion.div>

              <motion.button
                variants={item}
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0,229,255,0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                className="glow-btn w-full mt-4 py-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#050816] flex items-center justify-center gap-2 text-base"
              >
                Login <FiArrowRight />
              </motion.button>

              <motion.div variants={item} className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-gray-500 text-xs">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </motion.div>

              <motion.p variants={item} className="text-center text-gray-400 text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Register here
                </Link>
              </motion.p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}