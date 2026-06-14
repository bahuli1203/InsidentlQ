"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { analyticsData } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend } from "recharts";
import { BarChart3, TrendingDown, ShieldAlert, Cpu, Heart, CheckCircle2 } from "lucide-react";

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center">
        <BarChart3 className="w-8 h-8 text-gray-700 animate-pulse mb-2" />
        <div className="text-gray-500 text-sm">Loading charts...</div>
      </div>
    );
  }

  const COLORS = ["#3B82F6", "#8B5CF6", "#F59E0B", "#22C55E", "#EF4444", "#06B6D4"];

  const formatPercent = (val: number) => `${val}%`;
  const formatMins = (val: number) => `${val}m`;

  return (
    <div className="p-6 overflow-y-auto h-full space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl font-bold text-white">SRE Analytics</h1>
        </div>
        <p className="text-sm text-gray-500">
          Uptime, Mean Time To Resolution (MTTR), AI accuracy, and reliability trends.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Overall Uptime", value: "99.93%", change: "+0.04%", trend: "up", icon: Heart, color: "text-green-400" },
          { label: "Average MTTR", value: "58m", change: "-27%", trend: "down", icon: TrendingDown, color: "text-blue-400" },
          { label: "Memory Retrieval Rate", value: "83%", change: "+12%", trend: "up", icon: CheckCircle2, color: "text-purple-400" },
          { label: "AI Co-pilot Accuracy", value: "92%", change: "+6%", trend: "up", icon: Cpu, color: "text-emerald-400" },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#111827] border border-white/8 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs text-gray-500">{c.label}</span>
              <c.icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <div className="text-2xl font-bold text-white mb-0.5">{c.value}</div>
            <div className="text-[10px] text-gray-500">
              <span className={c.trend === "down" ? "text-green-400" : "text-green-400"}>
                {c.change}
              </span>{" "}
              from last month
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Incident Frequency */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] border border-white/8 rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" /> Incident Frequency by Month
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.incidentFrequency}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.08)" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="critical" name="Critical" stackId="a" fill="#ef4444" />
                <Bar dataKey="high" name="High" stackId="a" fill="#f97316" />
                <Bar dataKey="medium" name="Medium" stackId="a" fill="#eab308" />
                <Bar dataKey="low" name="Low" stackId="a" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 2: MTTR Trend */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] border border-white/8 rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-blue-400" /> Mean Time to Resolution (MTTR) Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.mttrTrend}>
                <defs>
                  <linearGradient id="colorMttr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} unit="m" />
                <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.08)" }} formatter={formatMins} />
                <Area type="monotone" dataKey="mttr" name="MTTR" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorMttr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 3: Service Uptime */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] border border-white/8 rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-400" /> Service Reliability (30d Uptime)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.serviceReliability} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" domain={[98.5, 100]} stroke="#6b7280" fontSize={10} tickLine={false} unit="%" />
                <YAxis type="category" dataKey="service" stroke="#6b7280" fontSize={10} tickLine={false} width={110} />
                <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.08)" }} formatter={formatPercent} />
                <Bar dataKey="uptime" name="Uptime" fill="#10b981" radius={[0, 4, 4, 0]}>
                  {analyticsData.serviceReliability.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.uptime >= 99.9 ? "#10b981" : entry.uptime >= 99.5 ? "#f59e0b" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 4: Root Cause Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] border border-white/8 rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" /> Root Cause Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-[60%] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.rootCauseDistribution}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="cause"
                  >
                    {analyticsData.rootCauseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.08)" }} formatter={formatPercent} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-[40%] text-xs space-y-2.5">
              {analyticsData.rootCauseDistribution.map((entry, index) => (
                <div key={entry.cause} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-gray-400 truncate flex-1">{entry.cause}</span>
                  <span className="font-semibold text-white">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chart 5: AI Copilot Accuracy */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] border border-white/8 rounded-xl p-5 lg:col-span-2"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" /> AI Recommendation Accuracy (Monthly)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.aiAccuracy}>
                <defs>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} domain={[60, 100]} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.08)" }} formatter={formatPercent} />
                <Area type="monotone" dataKey="accuracy" name="AI Suggestion Accuracy" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAccuracy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
