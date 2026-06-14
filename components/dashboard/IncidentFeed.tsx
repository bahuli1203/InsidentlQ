"use client";
import { useIncidentStore } from "@/store/useIncidentStore";
import { formatRelativeTime } from "@/lib/utils";
import { Incident } from "@/types";
import { AlertTriangle, CheckCircle2, Clock, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const SEV_CONFIG = {
  critical: { dot: "bg-red-400", text: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", label: "CRIT" },
  high: { dot: "bg-orange-400", text: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", label: "HIGH" },
  medium: { dot: "bg-yellow-400", text: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", label: "MED" },
  low: { dot: "bg-blue-400", text: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", label: "LOW" },
};

const STATUS_CONFIG = {
  active: "text-red-400",
  investigating: "text-orange-400",
  mitigating: "text-yellow-400",
  resolved: "text-green-400",
  postmortem: "text-purple-400",
};

export function IncidentFeed() {
  const { incidents, selectedIncident, setSelectedIncident } = useIncidentStore();
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");

  const filtered = incidents.filter((i) => {
    if (filter === "active") return i.status !== "resolved" && i.status !== "postmortem";
    if (filter === "resolved") return i.status === "resolved" || i.status === "postmortem";
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-semibold">Incidents</h2>
          </div>
          <span className="text-[10px] text-gray-500 bg-[#1F2937] px-1.5 py-0.5 rounded-full">
            {incidents.filter(i => i.status !== "resolved" && i.status !== "postmortem").length} active
          </span>
        </div>
        {/* Filter tabs */}
        <div className="flex gap-1">
          {(["all", "active", "resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 text-[10px] py-1 rounded-md capitalize transition-all ${
                filter === f
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Incident list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((incident, i) => {
          const sev = SEV_CONFIG[incident.severity];
          const isSelected = selectedIncident?.id === incident.id;
          return (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedIncident(incident)}
              className={`px-4 py-3.5 border-b border-white/5 cursor-pointer transition-all hover:bg-white/4 ${
                isSelected ? "bg-blue-500/8 border-l-2 border-l-blue-500" : ""
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${sev.dot} ${
                  incident.status !== "resolved" ? "animate-pulse" : ""
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono text-gray-500">{incident.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${sev.bg} ${sev.text} ${sev.border}`}>
                      {sev.label}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-white leading-tight mb-1 truncate">
                    {incident.title}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-mono truncate">{incident.service}</span>
                    <span className="text-gray-700">·</span>
                    <span className={`text-[10px] ${STATUS_CONFIG[incident.status]} capitalize`}>
                      {incident.status}
                    </span>
                    <span className="text-gray-700">·</span>
                    <span className="text-[10px] text-gray-600">
                      {formatRelativeTime(incident.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
