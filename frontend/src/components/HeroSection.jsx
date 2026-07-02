export default function HeroSection() {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
  
        <h1 className="text-8xl font-black">
          Pulse
          <span className="text-cyan-400">X</span>
        </h1>
  
        <p className="mt-6 text-xl text-gray-400">
          AI Powered Workforce Intelligence Platform
        </p>
  
        <div className="mt-10 backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-10 w-[800px]">
  
          <h2 className="text-3xl font-bold">
            Track. Manage. Analyze.
          </h2>
  
          <p className="mt-4 text-gray-400">
            Attendance • Work Logs • Leave Management • AI Insights
          </p>
  
        </div>
  
      </div>
    );
  }