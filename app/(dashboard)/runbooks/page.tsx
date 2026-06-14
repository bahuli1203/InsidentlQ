"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockRunbooks } from "@/lib/mock-data";
import { BookOpen, Search, User, Clipboard, Check, Calendar, Activity, ChevronRight, PlayCircle, Eye, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function RunbooksPage() {
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState<string>("all");
  const [selectedRunbook, setSelectedRunbook] = useState<typeof mockRunbooks[0] | null>(null);
  const [copiedStepId, setCopiedStepId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Unique services list
  const services = Array.from(new Set(mockRunbooks.map((rb) => rb.service)));

  const filteredRunbooks = mockRunbooks.filter((rb) => {
    const matchSearch =
      !search ||
      rb.title.toLowerCase().includes(search.toLowerCase()) ||
      rb.owner.toLowerCase().includes(search.toLowerCase()) ||
      rb.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchService =
      selectedService === "all" || rb.service === selectedService;

    return matchSearch && matchService;
  });

  const handleCopyCommand = (command: string, stepId: string) => {
    navigator.clipboard.writeText(command);
    setCopiedStepId(stepId);
    toast.success("Command copied to clipboard");
    setTimeout(() => setCopiedStepId(null), 2000);
  };

  const toggleStepCompleted = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleResetRunbook = () => {
    setCompletedSteps({});
    toast.info("Runbook progress reset");
  };

  return (
    <div className="p-6 h-full flex flex-col min-h-0 relative">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl font-bold text-white">SRE Runbooks</h1>
        </div>
        <p className="text-sm text-gray-500">
          Standard Operating Procedures (SOPs) and interactive runbooks for mitigation and repair.
        </p>
      </div>

      {/* Workspace */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        {/* Left pane - Runbook list */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#111827] border border-white/8 rounded-xl overflow-hidden">
          {/* Controls */}
          <div className="p-4 border-b border-white/8 flex gap-3 flex-shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search runbooks by title, owner, tag..."
                className="w-full bg-[#0A0F1E] border border-white/8 text-white placeholder-gray-500 text-sm pl-9 pr-4 py-2 rounded-lg outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="bg-[#0A0F1E] border border-white/8 text-gray-300 text-sm px-3 py-2 rounded-lg outline-none focus:border-blue-500/50"
            >
              <option value="all">All Services</option>
              {services.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          </div>

          {/* List content */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredRunbooks.length === 0 ? (
              <div className="py-20 text-center">
                <BookOpen className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <div className="text-gray-500 text-sm">No runbooks match your search filter</div>
              </div>
            ) : (
              filteredRunbooks.map((rb, i) => (
                <motion.div
                  key={rb.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => {
                    setSelectedRunbook(rb);
                    setCompletedSteps({});
                  }}
                  className={`p-4 hover:bg-white/4 cursor-pointer transition-all flex items-center justify-between ${
                    selectedRunbook?.id === rb.id ? "bg-blue-500/5 border-l-2 border-l-blue-500" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono text-gray-500">{rb.id}</span>
                      <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.2 rounded">
                        {rb.service}
                      </span>
                      <span className="text-[10px] text-green-400 ml-auto bg-green-500/10 border border-green-500/20 px-1.5 py-0.2 rounded font-semibold">
                        {rb.confidenceScore}% conf
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2 truncate">
                      {rb.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gray-600" />
                        {rb.owner}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-600" />
                        Updated {formatDate(rb.lastUpdated)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-gray-600" />
                        Used {rb.usageCount}x
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Right pane - Interactive details */}
        <AnimatePresence mode="wait">
          {selectedRunbook ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-[450px] flex-shrink-0 bg-[#111827] border border-white/8 rounded-xl p-5 flex flex-col min-h-0"
            >
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-3 border-b border-white/8 mb-4 flex-shrink-0">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-gray-500">{selectedRunbook.id}</span>
                    <span className="text-[10px] text-blue-400 font-mono">{selectedRunbook.service}</span>
                  </div>
                  <h2 className="text-sm font-bold text-white mt-1">{selectedRunbook.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedRunbook(null)}
                  className="text-xs text-gray-400 hover:text-white transition-colors bg-white/5 border border-white/8 hover:border-white/12 px-2.5 py-1 rounded"
                >
                  Close
                </button>
              </div>

              {/* Steps Area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {selectedRunbook.steps.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No structured steps provided for this runbook.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>Interactive Execution</span>
                      <button
                        onClick={handleResetRunbook}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Reset Progress
                      </button>
                    </div>

                    <div className="space-y-3">
                      {selectedRunbook.steps.map((step, idx) => {
                        const isCompleted = !!completedSteps[step.id];
                        return (
                          <div
                            key={step.id}
                            className={`p-3.5 border rounded-lg transition-all ${
                              isCompleted
                                ? "bg-green-500/5 border-green-500/30 opacity-70"
                                : "bg-[#0A0F1E] border-white/8"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Custom Checkbox */}
                              <button
                                onClick={() => toggleStepCompleted(step.id)}
                                className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center transition-all ${
                                  isCompleted
                                    ? "bg-green-500 border-green-600 text-white"
                                    : "border-white/20 hover:border-white/40 bg-[#111827]"
                                }`}
                              >
                                {isCompleted && <Check className="w-3 h-3" />}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="text-[10px] font-bold text-gray-600">STEP {step.order}</span>
                                  <span className={`text-xs font-semibold text-white ${isCompleted ? "line-through text-gray-500" : ""}`}>
                                    {step.title}
                                  </span>
                                </div>
                                <p className={`text-xs text-gray-400 leading-relaxed mb-3 ${isCompleted ? "text-gray-600" : ""}`}>
                                  {step.description}
                                </p>

                                {step.command && (
                                  <div className="relative group bg-[#111827] border border-white/5 rounded-md p-2 font-mono text-[10px] text-gray-300 overflow-x-auto flex items-center justify-between">
                                    <span className="whitespace-pre overflow-x-auto mr-6 pr-4">{step.command}</span>
                                    <button
                                      onClick={() => handleCopyCommand(step.command!, step.id)}
                                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-[#1F2937] hover:bg-white/5 border border-white/8 rounded text-gray-400 hover:text-white transition-colors"
                                      title="Copy command"
                                    >
                                      {copiedStepId === step.id ? (
                                        <Check className="w-3 h-3 text-green-400" />
                                      ) : (
                                        <Clipboard className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Additional Info */}
                <div className="pt-4 border-t border-white/8 space-y-3">
                  <div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Runbook Metadata</div>
                    <div className="text-xs text-gray-400 leading-relaxed">
                      This runbook is managed by <span className="text-white font-medium">{selectedRunbook.owner}</span>.
                      It has been executed <span className="text-white font-semibold">{selectedRunbook.usageCount} times</span> and
                      has a success confidence rating of <span className="text-green-400 font-bold">{selectedRunbook.confidenceScore}%</span>.
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">Related Incidents</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRunbook.relatedIncidents.map(incId => (
                        <span key={incId} className="text-[10px] font-mono bg-[#0A0F1E] border border-white/8 px-2 py-0.5 rounded text-gray-400">
                          {incId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="w-[450px] flex-shrink-0 bg-[#111827] border border-white/8 border-dashed rounded-xl flex items-center justify-center text-center p-6">
              <div>
                <BookOpen className="w-8 h-8 text-gray-700 mx-auto mb-2.5" />
                <div className="text-xs text-gray-500">Select a runbook from the catalogue to view steps and begin execution.</div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
