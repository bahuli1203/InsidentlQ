"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockMemoryEntries } from "@/lib/mock-data";
import { Database, Search, Filter, Clock, Tag, ShieldAlert, CheckCircle2, ChevronRight, X } from "lucide-react";
import { formatDate, severityColor } from "@/lib/utils";

export default function MemoryVaultPage() {
  const [search, setSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedEntry, setSelectedEntry] = useState<typeof mockMemoryEntries[0] | null>(null);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(mockMemoryEntries.flatMap((entry) => entry.tags))
  );

  const filteredEntries = mockMemoryEntries.filter((entry) => {
    const matchSearch =
      !search ||
      entry.incidentId.toLowerCase().includes(search.toLowerCase()) ||
      entry.service.toLowerCase().includes(search.toLowerCase()) ||
      entry.rootCause.toLowerCase().includes(search.toLowerCase()) ||
      entry.resolution.toLowerCase().includes(search.toLowerCase()) ||
      entry.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchSeverity =
      selectedSeverity === "all" || entry.severity === selectedSeverity;

    const matchTag =
      selectedTag === "all" || entry.tags.includes(selectedTag);

    return matchSearch && matchSeverity && matchTag;
  });

  return (
    <div className="p-6 h-full flex flex-col min-h-0 relative">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Database className="w-5 h-5 text-purple-400" />
          <h1 className="text-xl font-bold text-white">Memory Vault</h1>
        </div>
        <p className="text-sm text-gray-500">
          Search and query organizational memory of past production incidents, root causes, and fixes.
        </p>
      </div>

      {/* Workspace */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        {/* Left pane - search and list */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#111827] border border-white/8 rounded-xl overflow-hidden">
          {/* Controls */}
          <div className="p-4 border-b border-white/8 space-y-3 flex-shrink-0">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search root causes, resolutions, tags, incidents..."
                  className="w-full bg-[#0A0F1E] border border-white/8 text-white placeholder-gray-500 text-sm pl-9 pr-4 py-2 rounded-lg outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-[#0A0F1E] border border-white/8 text-gray-300 text-sm px-3 py-2 rounded-lg outline-none focus:border-purple-500/50"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Quick tags filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-thin">
              <span className="text-[10px] text-gray-500 uppercase font-medium flex-shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter Tag:
              </span>
              <button
                onClick={() => setSelectedTag("all")}
                className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all flex-shrink-0 ${
                  selectedTag === "all"
                    ? "bg-purple-500/20 text-purple-400 border-purple-500/30 font-medium"
                    : "bg-[#0A0F1E] text-gray-500 border-white/5 hover:border-white/10"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all flex-shrink-0 ${
                    selectedTag === tag
                      ? "bg-purple-500/20 text-purple-400 border-purple-500/30 font-medium"
                      : "bg-[#0A0F1E] text-gray-500 border-white/5 hover:border-white/10"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* List of memory entries */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredEntries.length === 0 ? (
              <div className="py-20 text-center">
                <Database className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <div className="text-gray-500 text-sm">No memories match your filter criteria</div>
              </div>
            ) : (
              filteredEntries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedEntry(entry)}
                  className={`p-4 hover:bg-white/4 cursor-pointer transition-all flex items-start gap-4 ${
                    selectedEntry?.id === entry.id ? "bg-purple-500/5 border-l-2 border-l-purple-500" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-gray-500">{entry.incidentId}</span>
                      <span className="text-[10px] text-gray-600 font-mono">{entry.service}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ml-auto ${severityColor(entry.severity)}`}>
                        {entry.severity}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2 line-clamp-1">
                      {entry.rootCause}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                      <span className="text-purple-400/80 font-medium">Fix: </span>
                      {entry.resolution}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <div className="flex items-center gap-1 text-[10px] text-gray-600 mr-2">
                        <Clock className="w-3 h-3" />
                        {formatDate(entry.date)}
                      </div>
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] text-gray-500 bg-[#0A0F1E] px-1.5 py-0.5 rounded border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0 group-hover:text-gray-400" />
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Right pane - entry details */}
        <AnimatePresence mode="wait">
          {selectedEntry ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-96 flex-shrink-0 bg-[#111827] border border-white/8 rounded-xl p-5 flex flex-col min-h-0 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-4">
                <div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase">Memory Entry Details</div>
                  <div className="text-sm font-bold text-white mt-0.5">{selectedEntry.id}</div>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5 flex-1">
                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Incident Reference</div>
                  <div className="text-sm font-mono text-purple-400 font-semibold">{selectedEntry.incidentId}</div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Affected Service</div>
                  <div className="text-sm font-mono text-white">{selectedEntry.service}</div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Severity</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase inline-block mt-1 ${severityColor(selectedEntry.severity)}`}>
                    {selectedEntry.severity}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Recorded Date</div>
                  <div className="text-xs text-gray-300 flex items-center gap-1.5 mt-1">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    {formatDate(selectedEntry.date)}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Root Cause Description
                  </div>
                  <div className="bg-[#0A0F1E] border border-white/8 rounded-lg p-3 text-xs text-gray-300 leading-relaxed font-sans">
                    {selectedEntry.rootCause}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Resolution & Mitigation
                  </div>
                  <div className="bg-[#0A0F1E] border border-white/8 rounded-lg p-3 text-xs text-gray-300 leading-relaxed font-sans">
                    {selectedEntry.resolution}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-blue-400" /> Associated Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEntry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-gray-400 bg-[#0A0F1E] border border-white/8 px-2.5 py-1 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="w-96 flex-shrink-0 bg-[#111827] border border-white/8 border-dashed rounded-xl flex items-center justify-center text-center p-6">
              <div>
                <Database className="w-8 h-8 text-gray-700 mx-auto mb-2.5" />
                <div className="text-xs text-gray-500">Select a memory entry from the list to view its full details.</div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
