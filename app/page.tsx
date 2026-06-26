import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="text-2xl font-black tracking-widest gradient-text">NAAW</div>
        <div className="flex items-center gap-6">
          <span className="text-white/50 text-sm">Studio</span>
          <Link
            href="/studio"
            className="bg-[#ff6b35] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#ff8555] transition-colors"
          >
            Start Designing
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <div className="inline-block glass px-4 py-2 rounded-full text-xs text-[#ff6b35] font-semibold mb-8 tracking-widest uppercase">
          AI-Powered Design Studio
        </div>
        <h1 className="text-6xl md:text-8xl font-black leading-none mb-6">
          Design Your
          <br />
          <span className="gradient-text">Dream Sneaker</span>
        </h1>
        <p className="text-white/50 text-lg max-w-md mb-12">
          Koi design skills nahi chahiye. Bas bol kya chahiye — AI baaki sab sambhal lega.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/studio"
            className="bg-[#ff6b35] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#ff8555] transition-all glow-orange"
          >
            Open Studio →
          </Link>
          <button className="glass text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
            Watch Demo
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {[
          {
            icon: "🤖",
            title: "AI Design Assistant",
            desc: "Bol 'streetwear vibes chahiye' — AI khud color, pattern suggest karega",
          },
          {
            icon: "👟",
            title: "Sneaker Canvas",
            desc: "2D/3D sneaker template pe directly customize karo — sole, upper, laces sab alag",
          },
          {
            icon: "📤",
            title: "Export & Order",
            desc: "Design ready? PNG, SVG export karo ya directly manufacturer ko bhejo",
          },
        ].map((f) => (
          <div key={f.title} className="glass rounded-2xl p-6">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-white/20 text-sm pb-8">
        © 2026 Naaw Studio — Designed by AI, Born from Street
      </div>
    </div>
  );
}
