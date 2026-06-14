"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Link from "next/link";
import {
  Shield, Brain, Zap, Network, Database, Clock, ChevronRight,
  Activity, AlertTriangle, CheckCircle, TrendingDown, BarChart3,
  BookOpen, Search, FileText, Users, Star, ArrowRight, Terminal,
  Cpu, Globe, Lock
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI Incident Analysis",
    description: "Claude AI analyzes incidents and identifies probable causes in seconds, not hours.",
    color: "blue",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  {
    icon: Database,
    title: "Memory-Powered Search",
    description: "Retrieve proven solutions from similar historical incidents across your organization.",
    color: "purple",
    gradient: "from-purple-500/20 to-purple-600/5",
  },
  {
    icon: Network,
    title: "Root Cause Intelligence",
    description: "Discover recurring infrastructure patterns before they cause the next outage.",
    color: "cyan",
    gradient: "from-cyan-500/20 to-cyan-600/5",
  },
  {
    icon: BookOpen,
    title: "Runbook Recommendations",
    description: "Surface the most relevant runbooks automatically based on incident context.",
    color: "green",
    gradient: "from-green-500/20 to-green-600/5",
  },
  {
    icon: FileText,
    title: "One-Click Postmortems",
    description: "Generate complete, blameless incident reports instantly with AI.",
    color: "orange",
    gradient: "from-orange-500/20 to-orange-600/5",
  },
  {
    icon: Shield,
    title: "Knowledge Preservation",
    description: "Never lose operational knowledge when team members leave.",
    color: "red",
    gradient: "from-red-500/20 to-red-600/5",
  },
];

const STATS = [
  { value: "92%", label: "AI Accuracy", icon: Brain },
  { value: "58min", label: "Avg MTTR", icon: Clock },
  { value: "1,284", label: "Memory Entries", icon: Database },
  { value: "99.9%", label: "Uptime", icon: Activity },
];

const TESTIMONIALS = [
  {
    name: "Elena Vasquez",
    role: "Sr. SRE @ Stripe",
    quote: "IncidentIQ cut our MTTR by 67%. The AI remembered an incident we had 8 months ago and immediately surfaced the exact same root cause.",
    avatar: "EV",
  },
  {
    name: "James Park",
    role: "Platform Engineering Lead @ Netflix",
    quote: "The knowledge graph is insane. We can visualize every relationship between our services, incidents, and root causes in real-time.",
    avatar: "JP",
  },
  {
    name: "Aisha Okonkwo",
    role: "DevOps Director @ Cloudflare",
    quote: "Onboarding new engineers used to take 3 months to get production context. With IncidentIQ, they're contributing in week one.",
    avatar: "AO",
  },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function LiveIncidentMockup() {
  const incidents = [
    { id: "INC-1042", name: "API Latency Spike", sev: "CRITICAL", status: "INVESTIGATING", time: "2m ago", color: "red" },
    { id: "INC-1041", name: "Redis Cluster Failover", sev: "HIGH", status: "MITIGATING", time: "47m ago", color: "orange" },
    { id: "INC-1040", name: "K8s Pod CrashLoop", sev: "HIGH", status: "ACTIVE", time: "1h ago", color: "orange" },
    { id: "INC-1039", name: "CDN Cache Issue", sev: "MEDIUM", status: "RESOLVED", time: "1d ago", color: "green" },
  ];

  return (
    <div className="relative bg-[#111827] rounded-2xl border border-white/8 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-[#0A0F1E]/50">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-gray-500 font-mono">incidentiq.ai — dashboard</span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-0 border-b border-white/8">
        {[
          { label: "Active", value: "3", color: "text-red-400" },
          { label: "MTTR", value: "58m", color: "text-blue-400" },
          { label: "Memory", value: "1.2k", color: "text-purple-400" },
          { label: "Accuracy", value: "92%", color: "text-green-400" },
        ].map((s, i) => (
          <div key={i} className="px-4 py-2 border-r border-white/8 last:border-0">
            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Incident list */}
      <div className="p-3 space-y-2">
        {incidents.map((inc, i) => (
          <motion.div
            key={inc.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0A0F1E]/50 border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              inc.color === "red" ? "bg-red-400" :
              inc.color === "orange" ? "bg-orange-400" :
              inc.color === "green" ? "bg-green-400" : "bg-blue-400"
            } ${inc.status !== "RESOLVED" ? "animate-pulse" : ""}`} />
            <span className="text-xs font-mono text-gray-500 w-16 flex-shrink-0">{inc.id}</span>
            <span className="text-xs text-gray-200 flex-1 truncate">{inc.name}</span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border flex-shrink-0 ${
              inc.sev === "CRITICAL" ? "text-red-400 bg-red-400/10 border-red-400/20" :
              inc.sev === "HIGH" ? "text-orange-400 bg-orange-400/10 border-orange-400/20" :
              "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
            }`}>{inc.sev}</span>
            <span className="text-[10px] text-gray-500 w-16 text-right">{inc.time}</span>
          </motion.div>
        ))}
      </div>

      {/* AI analysis strip */}
      <div className="px-3 pb-3">
        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-blue-400 mb-1">AI Memory Match Found</div>
              <div className="text-[11px] text-gray-400">
                INC-891 (3mo ago): 94% similar — PostgreSQL connection pool exhaustion.
                <span className="text-blue-400 ml-1">Resolution: Increase max_connections + PgBouncer →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  return (
    <div className="min-h-screen bg-[#0A0F1E] overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-blue-500 rounded-lg rotate-12 opacity-30" />
              <div className="relative flex items-center justify-center w-8 h-8">
                <Shield className="w-5 h-5 text-blue-400" />
                <Zap className="w-2.5 h-2.5 text-yellow-400 absolute -top-0.5 -right-0.5" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight">IncidentIQ</span>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full border border-white/8 ml-1">Beta</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            {["Features", "Documentation", "Pricing", "Security"].map(item => (
              <Link key={item} href="#" className="hover:text-white transition-colors">{item}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              Start Free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg" />
        {/* Glow orbs */}
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-60 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-6">
              <Zap className="w-3.5 h-3.5" />
              Powered by Claude AI + Organizational Memory
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-6">
              Resolve Incidents
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Before the Panic Starts.
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              IncidentIQ remembers every outage, every root cause, every fix, and every lesson learned.
              Powered by Claude AI and organizational memory.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105"
              >
                <Terminal className="w-4 h-4" />
                Start Investigation
              </Link>
              <Link
                href="#demo"
                className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-medium px-8 py-3.5 rounded-xl transition-all"
              >
                Watch Demo <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-500">
              <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> SOC 2 Type II</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> GDPR Compliant</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 99.9% Uptime SLA</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Enterprise SSO</div>
            </div>
          </motion.div>

          {/* Hero mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto"
            id="demo"
          >
            <LiveIncidentMockup />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything your team needs
              <br />
              <span className="text-gray-500">when it matters most</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Built by SREs, for SREs. Every feature designed for the chaos of production incidents.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`relative p-6 rounded-2xl border border-white/8 bg-gradient-to-br ${feature.gradient} bg-[#111827] cursor-pointer group`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  feature.color === "blue" ? "bg-blue-500/20 text-blue-400" :
                  feature.color === "purple" ? "bg-purple-500/20 text-purple-400" :
                  feature.color === "cyan" ? "bg-cyan-500/20 text-cyan-400" :
                  feature.color === "green" ? "bg-green-500/20 text-green-400" :
                  feature.color === "orange" ? "bg-orange-500/20 text-orange-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-white/8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Incident Workflow</h2>
            <p className="text-gray-400">From detection to resolution in minutes, not hours.</p>
          </motion.div>

          <div className="space-y-4">
            {[
              { step: "01", icon: AlertTriangle, title: "Incident Detected", desc: "Alert fires in Datadog/PagerDuty. IncidentIQ auto-creates incident with context.", color: "red" },
              { step: "02", icon: Brain, title: "AI Analyzes & Searches Memory", desc: "Claude AI analyzes symptoms. Memory engine searches 1,284+ historical incidents.", color: "blue" },
              { step: "03", icon: Search, title: "Similar Incidents Retrieved", desc: "Past incidents with same patterns surfaced with similarity scores and resolutions.", color: "purple" },
              { step: "04", icon: Zap, title: "Root Cause Predicted", desc: "AI ranks probable causes by confidence. Investigation steps auto-generated.", color: "yellow" },
              { step: "05", icon: CheckCircle, title: "Resolution + Postmortem", desc: "Team resolves with AI guidance. Postmortem auto-generated. Memory updated.", color: "green" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-6 p-5 rounded-xl border border-white/8 bg-[#111827] hover:border-white/15 transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center font-mono text-sm font-bold text-gray-500">
                  {item.step}
                </div>
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  item.color === "red" ? "bg-red-500/15 text-red-400" :
                  item.color === "blue" ? "bg-blue-500/15 text-blue-400" :
                  item.color === "purple" ? "bg-purple-500/15 text-purple-400" :
                  item.color === "yellow" ? "bg-yellow-500/15 text-yellow-400" :
                  "bg-green-500/15 text-green-400"
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="text-sm text-gray-400">{item.desc}</div>
                </div>
                {i < 4 && (
                  <div className="ml-auto text-gray-700">
                    <TrendingDown className="w-5 h-5 rotate-[-90deg]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-white/8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Trusted by elite engineering teams</h2>
            <div className="flex items-center justify-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              <span className="ml-2 text-gray-400 text-sm">4.9 / 5.0</span>
            </div>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl border border-white/8 bg-[#111827]"
              >
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
          >
            <div className="absolute inset-0 rounded-3xl bg-[#0A0F1E]/50" />
            <div className="relative">
              <Cpu className="w-12 h-12 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to transform your incident response?
              </h2>
              <p className="text-gray-400 mb-8">
                Join SRE teams that resolve incidents 4x faster with AI-powered organizational memory.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-2xl hover:shadow-blue-500/30"
                >
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-xs text-gray-600 mt-4">No credit card required · Setup in 5 minutes</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="font-bold">IncidentIQ</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Smarter Incident Resolution. AI-powered platform for elite engineering teams.
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Dashboard", "Analytics", "Knowledge Graph"] },
              { title: "Documentation", links: ["Getting Started", "API Docs", "Runbooks", "Webhooks"] },
              { title: "Security", links: ["SOC 2", "GDPR", "Encryption", "SSO"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
            ].map((col) => (
              <div key={col.title}>
                <div className="font-medium text-sm text-gray-300 mb-3">{col.title}</div>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/8 pt-8 text-xs text-gray-600">
            <div>IncidentIQ — Smarter Incident Resolution. © 2026 All rights reserved.</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> SOC 2 Type II</div>
              <div className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> GDPR</div>
              <div className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Enterprise Ready</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
