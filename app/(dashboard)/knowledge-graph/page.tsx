"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Server, Database, Globe, Play, Info, AlertTriangle, ShieldCheck, X } from "lucide-react";

interface NodeData {
  id: string;
  label: string;
  type: "gateway" | "service" | "database" | "cdn";
  status: "healthy" | "degraded" | "critical";
  x: number;
  y: number;
  metrics: {
    latency: string;
    throughput: string;
    errorRate: string;
  };
  details: string;
  runbook: string;
  incidents: string[];
}

const NODES: NodeData[] = [
  {
    id: "cdn",
    label: "CDN (Cloudflare)",
    type: "cdn",
    status: "healthy",
    x: 100,
    y: 200,
    metrics: { latency: "14ms", throughput: "12.4k rps", errorRate: "0.01%" },
    details: "Global edge CDN and caching layer. Configured with DDoS protection and static asset caching rules.",
    runbook: "RB-004 (CDN Cache Purge)",
    incidents: ["INC-1039"],
  },
  {
    id: "gateway",
    label: "API Gateway",
    type: "gateway",
    status: "healthy",
    x: 280,
    y: 200,
    metrics: { latency: "38ms", throughput: "8.2k rps", errorRate: "0.04%" },
    details: "Reverse proxy and rate limiting gateway. Handles routing to payments-api, session-store, and ml-inference.",
    runbook: "RB-001 (Gateway Connection Tuning)",
    incidents: [],
  },
  {
    id: "payments-api",
    label: "Payments API",
    type: "service",
    status: "critical",
    x: 480,
    y: 100,
    metrics: { latency: "8.2s", throughput: "1.4k rps", errorRate: "12.0%" },
    details: "Core checkout and transaction service. Currently experiencing p99 latency spike and connection exhaustion.",
    runbook: "RB-001 (Database Connection Pool Exhaustion)",
    incidents: ["INC-1042", "INC-1036"],
  },
  {
    id: "session-store",
    label: "Session Store (Redis)",
    type: "service",
    status: "degraded",
    x: 480,
    y: 200,
    metrics: { latency: "145ms", throughput: "4.5k rps", errorRate: "1.8%" },
    details: "User session cache and rate limits. Triggered failover recently; cache size is near memory limit.",
    runbook: "RB-002 (Redis OOM Recovery)",
    incidents: ["INC-1041"],
  },
  {
    id: "ml-inference",
    label: "ML Inference Engine",
    type: "service",
    status: "healthy",
    x: 480,
    y: 300,
    metrics: { latency: "85ms", throughput: "320 rps", errorRate: "0.1%" },
    details: "Kubernetes microservice hosting recommendations model inference. Restored stability after CrashLoop fix.",
    runbook: "RB-003 (Kubernetes Pod CrashLoop Investigation)",
    incidents: ["INC-1040"],
  },
  {
    id: "payments-db",
    label: "Payments DB (Postgres)",
    type: "database",
    status: "critical",
    x: 680,
    y: 100,
    metrics: { latency: "4.8s", throughput: "920 tps", errorRate: "14.5%" },
    details: "PostgreSQL master cluster. Connections are saturated (100% capacity). Locking detected on migrations.",
    runbook: "RB-001 (Database Connection Pool Exhaustion)",
    incidents: ["INC-1042", "INC-1038"],
  },
];

const EDGES = [
  { source: "cdn", target: "gateway" },
  { source: "gateway", target: "payments-api" },
  { source: "gateway", target: "session-store" },
  { source: "gateway", target: "ml-inference" },
  { source: "payments-api", target: "payments-db" },
];

export default function KnowledgeGraphPage() {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(NODES.find(n => n.id === "payments-api") || null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getStatusColor = (status: NodeData["status"]) => {
    if (status === "critical") return "text-red-400 border-red-500 bg-red-950/20";
    if (status === "degraded") return "text-orange-400 border-orange-500 bg-orange-950/20";
    return "text-green-400 border-green-500 bg-green-950/20";
  };

  const getNodeIcon = (type: NodeData["type"]) => {
    if (type === "cdn") return Globe;
    if (type === "database") return Database;
    return Server;
  };

  return (
    <div className="p-6 h-full flex flex-col min-h-0 relative">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Network className="w-5 h-5 text-purple-400" />
          <h1 className="text-xl font-bold text-white">Knowledge Graph</h1>
        </div>
        <p className="text-sm text-gray-500">
          System topology and service dependency mapping. Hover or click nodes to inspect metrics, active incidents, and recommended runbooks.
        </p>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        {/* Map canvas */}
        <div className="flex-1 bg-[#111827] border border-white/8 rounded-xl relative overflow-hidden flex items-center justify-center">
          {/* Grid Background */}
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

          {/* SVG Canvas for Links/Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {EDGES.map((edge, i) => {
              const srcNode = NODES.find((n) => n.id === edge.source);
              const tgtNode = NODES.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              // Color of the line based on parent state
              const isAlert = srcNode.status === "critical" || tgtNode.status === "critical";
              const strokeColor = isAlert ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.15)";
              const isHovered = hoveredNode === edge.source || hoveredNode === edge.target;

              return (
                <g key={i}>
                  {/* Outer glow line if hovered */}
                  {isHovered && (
                    <line
                      x1={srcNode.x + 80}
                      y1={srcNode.y + 24}
                      x2={tgtNode.x}
                      y2={tgtNode.y + 24}
                      stroke={isAlert ? "#ef4444" : "#3b82f6"}
                      strokeWidth={4}
                      opacity={0.3}
                      className="blur-[2px]"
                    />
                  )}
                  <line
                    x1={srcNode.x + 80}
                    y1={srcNode.y + 24}
                    x2={tgtNode.x}
                    y2={tgtNode.y + 24}
                    stroke={strokeColor}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    strokeDasharray={isAlert ? "4 4" : "none"}
                    className={isAlert ? "animate-[dash_2s_linear_infinite]" : ""}
                  />
                  {/* Dynamic pulse along the line */}
                  {isAlert && (
                    <circle r={3} fill="#ef4444" className="animate-[ping_1.5s_infinite]">
                      <animateMotion
                        path={`M ${srcNode.x + 80} ${srcNode.y + 24} L ${tgtNode.x} ${tgtNode.y + 24}`}
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render Nodes */}
          <div className="absolute inset-0 pointer-events-none">
            {NODES.map((node) => {
              const Icon = getNodeIcon(node.type);
              const statusColors = getStatusColor(node.status);
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode === node.id;

              return (
                <div
                  key={node.id}
                  style={{ left: node.x, top: node.y }}
                  className="absolute pointer-events-auto cursor-pointer"
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg border shadow-lg transition-all ${
                      isSelected
                        ? "border-purple-500 shadow-purple-500/10 bg-[#1F2937]"
                        : "bg-[#0A0F1E] border-white/8 hover:border-white/20"
                    }`}
                  >
                    {/* Node status dot */}
                    <div className={`w-2 h-2 rounded-full relative flex-shrink-0 ${
                      node.status === "critical" ? "bg-red-500 animate-pulse" :
                      node.status === "degraded" ? "bg-orange-500 animate-pulse" : "bg-green-500"
                    }`}>
                      {(node.status === "critical" || node.status === "degraded") && (
                        <span className="absolute -inset-1.5 rounded-full bg-current opacity-30 animate-ping" />
                      )}
                    </div>

                    <Icon className={`w-4 h-4 ${
                      node.status === "critical" ? "text-red-400" :
                      node.status === "degraded" ? "text-orange-400" : "text-gray-400"
                    }`} />

                    <div className="text-left">
                      <div className="text-[11px] font-bold text-white whitespace-nowrap">{node.label}</div>
                      <div className="text-[9px] text-gray-500 font-mono mt-0.5">{node.metrics.latency}</div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Sidebar panel */}
        <AnimatePresence mode="wait">
          {selectedNode ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-96 flex-shrink-0 bg-[#111827] border border-white/8 rounded-xl p-5 flex flex-col min-h-0 overflow-y-auto"
            >
              <div className="flex items-start justify-between pb-3 border-b border-white/8 mb-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{selectedNode.type} node</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      selectedNode.status === "critical" ? "bg-red-500 animate-pulse" :
                      selectedNode.status === "degraded" ? "bg-orange-500 animate-pulse" : "bg-green-500"
                    }`} />
                  </div>
                  <h2 className="text-sm font-bold text-white mt-1">{selectedNode.label}</h2>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Node Metrics */}
              <div className="grid grid-cols-3 gap-2 border-b border-white/8 pb-4 mb-4">
                {[
                  { label: "P99 Latency", value: selectedNode.metrics.latency, color: selectedNode.status === "critical" ? "text-red-400" : "text-white" },
                  { label: "Throughput", value: selectedNode.metrics.throughput },
                  { label: "Error Rate", value: selectedNode.metrics.errorRate, color: selectedNode.status === "critical" ? "text-red-400" : "text-white" },
                ].map((m) => (
                  <div key={m.label} className="bg-[#0A0F1E] border border-white/5 p-2 rounded text-center">
                    <div className="text-[8px] text-gray-500 uppercase tracking-wider mb-0.5">{m.label}</div>
                    <div className={`text-xs font-bold ${m.color ?? "text-white"} font-mono`}>{m.value}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Service Description
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans bg-[#0A0F1E] p-3 rounded-lg border border-white/5">
                    {selectedNode.details}
                  </p>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Play className="w-3.5 h-3.5 text-blue-400" /> Recommended Runbook
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-500/5 border border-blue-500/15 rounded-lg">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <div className="text-xs font-mono font-medium text-white truncate">{selectedNode.runbook}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-400" /> Active Incidents
                  </div>
                  {selectedNode.incidents.length === 0 ? (
                    <div className="flex items-center gap-2 p-3 bg-green-500/5 border border-green-500/15 rounded-lg text-green-400 text-xs font-semibold">
                      <ShieldCheck className="w-4 h-4" /> No active incidents
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedNode.incidents.map((inc) => (
                        <div key={inc} className="flex items-center gap-2.5 p-2.5 bg-red-500/5 border border-red-500/15 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                          <span className="text-xs font-mono font-bold text-red-400">{inc}</span>
                          <span className="text-[10px] text-gray-500">Service Degraded</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="w-96 flex-shrink-0 bg-[#111827] border border-white/8 border-dashed rounded-xl flex items-center justify-center text-center p-6">
              <div>
                <Network className="w-8 h-8 text-gray-700 mx-auto mb-2.5" />
                <div className="text-xs text-gray-500">Select a system node from the map to view detailed health metrics.</div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
