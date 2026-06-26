import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="text-2xl font-black tracking-widest gradient-text">NAAW</div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-white/50 text-sm hover:text-white transition">Sign In</Link>
          <Link href="/signup" className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-white/90 transition">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <div className="inline-block glass px-4 py-2 rounded-full text-xs text-[#ff6b35] font-semibold mb-8 tracking-widest uppercase">
          AI-Powered Design Studio
        </div>
        <h1 className="text-6xl md:text-8xl font-black leading-none mb-6">
          Design Any
          <br />
          <span className="gradient-text">Product You Want</span>
        </h1>
        <p className="text-white/50 text-lg max-w-md mb-12">
          T-shirts, sneakers, bags, hats — design everything with AI. No design skills needed.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/signup"
            className="bg-[#ff6b35] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#ff8555] transition-all glow-orange">
            Start Designing Free →
          </Link>
          <Link href="/login" className="glass text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
            Sign In
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[
          { icon: "🤖", title: "AI Design Generator", desc: "Describe your vision in words — AI picks the perfect colors, patterns, and style for any product." },
          { icon: "👕", title: "19 Product Types", desc: "T-shirts, hoodies, sneakers, bags, caps and more — all fully customizable with Indian textile patterns." },
          { icon: "📤", title: "Export Your Design", desc: "Download your design as SVG or PNG, ready to send to any manufacturer." },
        ].map(f => (
          <div key={f.title} className="glass rounded-2xl p-6">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="max-w-2xl mx-auto px-6 pb-24">
        <h2 className="text-center text-2xl font-black mb-8">Simple Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass border border-white/10 rounded-2xl p-6">
            <p className="text-lg font-black mb-1">Free</p>
            <p className="text-3xl font-black mb-4">$0</p>
            <ul className="text-white/50 text-sm space-y-2 mb-6">
              <li>✓ 5 product types</li>
              <li>✓ All color palettes</li>
              <li>✓ Indian textile patterns</li>
              <li className="text-white/20">✗ AI generator</li>
              <li className="text-white/20">✗ Custom text/logo</li>
              <li className="text-white/20">✗ Export</li>
            </ul>
            <Link href="/signup" className="block text-center bg-white/10 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-white/20 transition">
              Get Started
            </Link>
          </div>
          <div className="bg-white/5 border border-white rounded-2xl p-6">
            <p className="text-lg font-black mb-1">Pro <span className="text-yellow-400">★</span></p>
            <p className="text-3xl font-black mb-4">$9<span className="text-base font-normal text-white/40">/mo</span></p>
            <ul className="text-white/70 text-sm space-y-2 mb-6">
              <li>✓ All 19 products</li>
              <li>✓ AI design generator</li>
              <li>✓ Custom text & logo</li>
              <li>✓ Export SVG/PNG</li>
              <li>✓ Priority support</li>
            </ul>
            <Link href="/signup" className="block text-center bg-yellow-400 text-black py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-300 transition">
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center text-white/20 text-sm pb-8">
        © 2026 Naaw Studio — Design Your Brand
      </div>
    </div>
  );
}
