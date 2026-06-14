"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Brain, ArrowRight, Chrome, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome back, Sarah Chen!");
      router.push("/dashboard");
    } catch {
      toast.error("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success("Welcome to IncidentIQ!");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex">
      {/* Left — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-[#111827] border-r border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />

        {/* Logo */}
        <div className="relative flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">IncidentIQ</span>
        </div>

        {/* Center content */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Your AI Co-Pilot
              <br />
              <span className="text-blue-400">for Every Incident</span>
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Powered by Claude AI and organizational memory. Resolve production incidents 4x faster.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Brain, text: "AI analyzes root causes in seconds", color: "blue" },
              { icon: Zap, text: "Memory retrieves proven solutions instantly", color: "purple" },
              { icon: Shield, text: "Auto-generated postmortems & runbooks", color: "green" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.color === "blue" ? "bg-blue-500/20 text-blue-400" :
                  item.color === "purple" ? "bg-purple-500/20 text-purple-400" :
                  "bg-green-500/20 text-green-400"
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative grid grid-cols-3 gap-4">
          {[
            { value: "92%", label: "AI Accuracy" },
            { value: "58min", label: "Avg MTTR" },
            { value: "4x", label: "Faster Resolution" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-xl bg-[#0A0F1E]/50 border border-white/8">
              <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Shield className="w-7 h-7 text-blue-400" />
            <span className="text-xl font-bold">IncidentIQ</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-gray-400 text-sm">
              {mode === "login"
                ? "Sign in to your IncidentIQ workspace"
                : "Start resolving incidents smarter"}
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-[#111827] border border-white/10 hover:border-white/20 text-white font-medium py-3 rounded-xl transition-all hover:bg-[#1F2937] mb-6 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-500 bg-[#0A0F1E] px-2">
              or continue with email
            </div>
          </div>

          <form onSubmit={handleEmail} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="engineer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111827] border border-white/10 focus:border-blue-500 text-white placeholder-gray-500 rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111827] border border-white/10 focus:border-blue-500 text-white placeholder-gray-500 rounded-xl py-3 pl-10 pr-12 text-sm outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign in" : "Create account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>

          <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-400 font-medium mb-1">🚀 Demo Mode</p>
            <p className="text-xs text-gray-400">Click &ldquo;Continue with Google&rdquo; or enter any email/password to explore with realistic demo data.</p>
          </div>

          <p className="text-center text-xs text-gray-600 mt-6">
            By continuing, you agree to our{" "}
            <Link href="#" className="text-gray-500 hover:text-gray-300">Terms</Link> and{" "}
            <Link href="#" className="text-gray-500 hover:text-gray-300">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
