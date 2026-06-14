"use client";
import { motion } from "framer-motion";
import { mockSimilarIncidents, mockRunbooks, mockMemoryEntries } from "@/lib/mock-data";
import { useIncidentStore } from "@/store/useIncidentStore";
import { Database, BookOpen, FileText, Clock, ChevronRight, Brain, Percent } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

type Tab = "similar" | "runbooks" | "postmortems";

export function MemoryEngine() {
  const { selectedIncident } = useIncidentStore();
  const [activeTab, setActiveTab] = useState<Tab>("similar");

  const tabs = [
    { id: "similar" as Tab, label: "Similar", icon: Brain, count: mockSimilarIncidents.length },
    { id: "runbooks" as Tab, label: "Runbooks", icon: BookOpen, count: mockRunbooks.length },
    { id: "postmortems" as Tab, label: "History", icon: FileText, count: mockMemoryEntries.length },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/8 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold">Memory Engine</h2>
          <div className="ml-auto flex items-center gap-1 text-[10px] text-purple-400 bg-purple-400/10 border border-purple-400/20 px-1.5 py-0.5 rounded-full">
            <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
            1,284 entries
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 text-[10px] py-1.5 rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
              <span className="text-[9px] text-gray-600">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "similar" && (
          <div className="divide-y divide-white/5">
            {mockSimilarIncidents.map((inc, i) => (
              <motion.div
                key={inc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-4 hover:bg-white/4 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-mono text-gray-500">{inc.id}</span>
                  <div className={`flex items-center gap-1 text-sm font-bold ${
                    inc.similarity >= 85 ? "text-green-400" :
                    inc.similarity >= 70 ? "text-yellow-400" : "text-gray-400"
                  }`}>
                    <Percent className="w-3 h-3" />
                    {inc.similarity}
                  </div>
                </div>
                <div className="text-xs font-medium text-white mb-1 group-hover:text-blue-300 transition-colors">
                  {inc.title}
                </div>
                <div className="text-[10px] text-gray-500 mb-2">{inc.service}</div>
                <div className="text-[10px] text-gray-400 leading-relaxed">
                  <span className="text-gray-600">Root cause:</span> {inc.rootCause}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  <span className="text-gray-600">Fix:</span> {inc.resolution}
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {inc.resolutionTime}m resolved
                  </div>
                  <div>{formatDate(inc.date)}</div>
                </div>
                {/* Similarity bar */}
                <div className="mt-2 h-1 bg-[#1F2937] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${inc.similarity}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    className={`h-full rounded-full ${
                      inc.similarity >= 85 ? "bg-green-400" :
                      inc.similarity >= 70 ? "bg-yellow-400" : "bg-blue-400"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "runbooks" && (
          <div className="divide-y divide-white/5">
            {mockRunbooks.map((rb, i) => (
              <motion.div
                key={rb.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-4 hover:bg-white/4 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white group-hover:text-blue-300 transition-colors truncate">
                      {rb.title}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{rb.service} · {rb.owner}</div>
                  </div>
                  <div className="text-xs font-bold text-green-400 ml-2">{rb.confidenceScore}%</div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
                  <span>Used {rb.usageCount}x</span>
                  <span>{rb.steps.length} steps</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-green-400/10 text-green-400 border border-green-400/20 rounded">
                    {rb.confidenceScore >= 90 ? "High confidence" : "Medium"}
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {rb.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[9px] text-gray-600 bg-[#1F2937] px-1.5 py-0.5 rounded border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "postmortems" && (
          <div className="divide-y divide-white/5">
            {mockMemoryEntries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-4 hover:bg-white/4 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-gray-500">{entry.incidentId}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${
                    entry.severity === "critical" ? "text-red-400 bg-red-400/10 border-red-400/20" :
                    entry.severity === "high" ? "text-orange-400 bg-orange-400/10 border-orange-400/20" :
                    "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                  }`}>{entry.severity.toUpperCase()}</span>
                </div>
                <div className="text-[10px] text-gray-500 mb-1">{entry.service}</div>
                <div className="text-[10px] text-gray-400 mb-1">
                  <span className="text-gray-600">Root cause:</span> {entry.rootCause}
                </div>
                <div className="text-[10px] text-gray-400">
                  <span className="text-gray-600">Resolution:</span> {entry.resolution}
                </div>
                <div className="text-[10px] text-gray-600 mt-2">{formatDate(entry.date)}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
