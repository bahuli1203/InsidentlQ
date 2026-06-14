"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useIncidentStore } from "@/store/useIncidentStore";
import { mockStats } from "@/lib/mock-data";
import { AICopilot } from "@/components/dashboard/AICopilot";
import { MemoryEngine } from "@/components/dashboard/MemoryEngine";
import { IncidentFeed } from "@/components/dashboard/IncidentFeed";
import {
  AlertTriangle, Clock, Brain, Database, Zap, CheckCircle2,
  TrendingDown, TrendingUp
} from "lucide-react";

const STAT_CARDS = [
  {
    label: "Active Incidents",
    value: mockStats.activeIncidents,
    icon: AlertTriangle,
    color: "red",
    trend: "+1",
    trendDir: "up",
    detail: "1 critical",
  },
  {
    label: "Critical Alerts",
    value: mockStats.criticalAlerts,
    icon: Zap,
    color: "orange",
    trend: "same",
    trendDir: "neutral",
    detail: "payments-api",
  },
  {
    label: "Avg MTTR",
    value: `${mockStats.mttr}m`,
    icon: Clock,
    color: "blue",
    trend: "-14%",
    trendDir: "down",
    detail: "vs last month",
  },
  {
    label: "Memory Matches",
    value: mockStats.memoryMatches.toLocaleString(),
    icon: Database,
    color: "purple",
    trend: "+127",
    trendDir: "up",
    detail: "this week",
  },
  {
    label: "AI Accuracy",
    value: `${mockStats.aiAccuracy}%`,
    icon: Brain,
    color: "green",
    trend: "+4%",
    trendDir: "up",
    detail: "vs last month",
  },
  {
    label: "Resolved Today",
    value: mockStats.resolvedToday,
    icon: CheckCircle2,
    color: "teal",
    trend: "+3",
    trendDir: "up",
    detail: "avg 52m each",
  },
];

export default function DashboardPage() {
  const { selectedIncident } = useIncidentStore();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-xl font-bold text-white">Operations Center</h1>
            <p className="text-sm text-gray-500 mt-0.5">Real-time incident monitoring & AI response</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              All systems monitored
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {STAT_CARDS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#111827] border border-white/8 rounded-xl p-4 hover:border-white/15 transition-all cursor-default"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  stat.color === "red" ? "bg-red-500/15 text-red-400" :
                  stat.color === "orange" ? "bg-orange-500/15 text-orange-400" :
                  stat.color === "blue" ? "bg-blue-500/15 text-blue-400" :
                  stat.color === "purple" ? "bg-purple-500/15 text-purple-400" :
                  stat.color === "green" ? "bg-green-500/15 text-green-400" :
                  "bg-teal-500/15 text-teal-400"
                }`}>
                  <stat.icon className="w-3.5 h-3.5" />
                </div>
                <div className={`flex items-center gap-0.5 text-[10px] font-medium ${
                  stat.trendDir === "down" ? "text-green-400" :
                  stat.trendDir === "up" && (stat.color === "red" || stat.color === "orange") ? "text-red-400" :
                  stat.trendDir === "up" ? "text-green-400" : "text-gray-500"
                }`}>
                  {stat.trendDir === "down" && <TrendingDown className="w-3 h-3" />}
                  {stat.trendDir === "up" && <TrendingUp className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <div className={`text-2xl font-bold mb-0.5 ${
                stat.color === "red" ? "text-red-400" :
                stat.color === "orange" ? "text-orange-400" :
                stat.color === "blue" ? "text-blue-400" :
                stat.color === "purple" ? "text-purple-400" :
                stat.color === "green" ? "text-green-400" :
                "text-teal-400"
              }`}>{stat.value}</div>
              <div className="text-[10px] text-gray-500 leading-tight">{stat.label}</div>
              <div className="text-[10px] text-gray-600 mt-0.5">{stat.detail}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Three-panel workspace */}
      <div className="flex-1 flex gap-0 min-h-0 border-t border-white/8">
        {/* Left — Incident Feed */}
        <div className="w-72 flex-shrink-0 border-r border-white/8 flex flex-col">
          <IncidentFeed />
        </div>

        {/* Center — AI Copilot */}
        <div className="flex-1 min-w-0 border-r border-white/8 flex flex-col">
          <AICopilot />
        </div>

        {/* Right — Memory Engine */}
        <div className="w-80 flex-shrink-0 flex flex-col">
          <MemoryEngine />
        </div>
      </div>
    </div>
  );
}
