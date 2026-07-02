import { useState, useRef, useEffect } from "react";
import { FiSend, FiTrash2, FiZap } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import BackgroundEffects from "../../components/BackgroundEffects";
import FloatingParticles from "../../components/FloatingParticles";

const suggestions = [
  "📊 Analyze my attendance",
  "📝 Summarize my work logs",
  "📅 Show leave insights",
  "🚀 Give productivity tips",
];

// AI bot avatar — glowing robot face
const BotAvatar = () => (
  <div className="relative shrink-0">
    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-cyan-500/40 text-lg">
      🤖
    </div>
    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#050816] animate-pulse" />
  </div>
);

// User avatar
const UserAvatar = () => (
  <div className="shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-400 flex items-center justify-center shadow-lg shadow-pink-500/40 text-lg">
    👤
  </div>
);

export default function AIChat() {
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "Hey there! 👋 I'm your PulseX AI assistant. Ask me anything about your work, productivity, or schedule — I'm here to help! ⚡",
    },
  ]);
  const [input, setInput]         = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef             = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/ai/chat",
        { message: msg },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, { role: "ai", content: res.data.reply }]);
    } catch (err) {
      const backendError = err.response?.data?.error || err.message || "Unable to connect to AI service.";
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: `⚠️ ${backendError}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const clearChat = () => {
    setMessages([
      {
        role: "ai",
        content: "Chat cleared! 🧹 Ready for a fresh conversation. How can I help you?",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-x-hidden">
      <BackgroundEffects />
      <FloatingParticles />

      {/* Extra neon glow orbs for atmosphere */}
      <div className="fixed top-20 right-40 w-80 h-80 bg-pink-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-60 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex flex-col px-6 xl:px-10 py-8 relative z-10 min-h-screen transition-all duration-300" style={{ marginLeft: collapsed ? 80 : 240 }}>
        <Navbar />

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mt-6 mb-5"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-xl shadow-cyan-500/30">
                🤖
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#050816] animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black">
                PulseX{" "}
                <span className="gradient-text">AI Assistant</span>
              </h1>
              <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online & Ready
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all text-sm font-medium"
          >
            <FiTrash2 size={14} /> Clear Chat
          </motion.button>
        </motion.div>

        {/* ── Suggestion Pills ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-4"
        >
          {suggestions.map((s, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => sendMessage(s)}
              className="text-xs px-4 py-2 rounded-full glass-card border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-cyan-300 transition-all duration-200"
            >
              {s}
            </motion.button>
          ))}
        </motion.div>

        {/* ── Chat Window ── */}
        <div
        className="flex-1 glass-card shimmer-border rounded-3xl flex flex-col overflow-hidden backdrop-blur-xl relative min-h-0"
        >
          {/* Neon top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent mt-px" />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto min-h-0 px-6 py-6 space-y-5 custom-scrollbar">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  {msg.role === "ai" ? <BotAvatar /> : <UserAvatar />}

                  {/* Bubble */}
                  <div
                    className={`relative max-w-[72%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-sm text-white"
                        : "rounded-bl-sm text-gray-100"
                    }`}
                    style={
                      msg.role === "user"
                        ? {
                            background: "linear-gradient(135deg, #ec4899, #f97316)",
                            boxShadow: "0 4px 24px rgba(236,72,153,0.35)",
                          }
                        : {
                            background: "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(168,85,247,0.12))",
                            border: "1px solid rgba(6,182,212,0.25)",
                            boxShadow: "0 4px 24px rgba(6,182,212,0.08)",
                          }
                    }
                  >
                    {/* Neon glow dot for AI messages */}
                    {msg.role === "ai" && (
                      <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80" />
                    )}
                    {msg.role === "user" && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-400 shadow-lg shadow-pink-400/80" />
                    )}
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-3"
              >
                <BotAvatar />
                <div
                  className="px-5 py-4 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
                  style={{
                    background: "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(168,85,247,0.12))",
                    border: "1px solid rgba(6,182,212,0.25)",
                  }}
                >
                  {[0, 1, 2].map((dot) => (
                    <motion.div
                      key={dot}
                      className="w-2 h-2 rounded-full bg-cyan-400"
                      animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Bar ── */}
          <div className="shrink-0 px-6 pb-6 pt-3 border-t border-white/5 bg-[#050816]">
            <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your work..."
                  disabled={isLoading}
                  className="w-full rounded-2xl py-4 pl-5 pr-5 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid rgba(6,182,212,0.5)";
                    e.target.style.boxShadow = "0 0 20px rgba(6,182,212,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1px solid rgba(255,255,255,0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || !input.trim()}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{
                  background: "linear-gradient(135deg, #06b6d4, #ec4899)",
                  boxShadow: input.trim() ? "0 0 20px rgba(6,182,212,0.5)" : "none",
                }}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <FiZap size={18} className="text-white" />
                )}
              </motion.button>
            </form>

            <p className="text-center text-gray-600 text-xs mt-3">
              Powered by <span className="text-cyan-500 font-medium">PulseX AI</span> · Gemini 1.5 Flash
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(6,182,212,0.4), rgba(236,72,153,0.4));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(6,182,212,0.7), rgba(236,72,153,0.7));
        }
      `}</style>
    </div>
  );
}