"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email, password, redirect: false });
    router.push("/studio");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-black tracking-widest text-white">NAAW</a>
          <p className="text-white/40 text-sm mt-2">Create your free account</p>
        </div>

        {/* Plan comparison */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <p className="text-white text-xs font-bold mb-2">Free</p>
            <ul className="text-white/40 text-[10px] space-y-1">
              <li>✓ 5 product types</li>
              <li>✓ Basic patterns</li>
              <li>✓ Color customization</li>
              <li className="text-white/20">✗ AI generator</li>
              <li className="text-white/20">✗ Custom text/logo</li>
              <li className="text-white/20">✗ Export</li>
            </ul>
          </div>
          <div className="bg-white/8 border border-white rounded-xl p-3">
            <p className="text-white text-xs font-bold mb-1">Pro <span className="text-yellow-400">★</span></p>
            <p className="text-yellow-400 text-[10px] font-bold mb-2">$9/mo</p>
            <ul className="text-white/60 text-[10px] space-y-1">
              <li>✓ All 19 products</li>
              <li>✓ All patterns</li>
              <li>✓ AI design generator</li>
              <li>✓ Custom text/logo</li>
              <li>✓ Export SVG/PNG</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 disabled:opacity-50 transition text-sm"
          >
            {loading ? "Creating account..." : "Create Free Account"}
          </button>
        </form>
        <p className="text-center text-white/40 text-xs mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
