"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useIncidentStore } from "@/store/useIncidentStore";
import { formatRelativeTime } from "@/lib/utils";
import { AlertTriangle, Plus, Search, Filter, ChevronRight, Clock, Users } from "lucide-react";
import Link from "next/link";
import { Incident } from "@/types";

const SEV = {
  critical: "text-red-400 bg-red-400/10 border-red-400/30",
  high: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  low: "text-blue-400 bg-blue-400/10 border-blue-400/30",
};
const STATUS = {
  active: "text-red-400 bg-red-400/8",
  investigating: "text-orange-400 bg-orange-400/8",
  mitigating: "text-yellow-400 bg-yellow-400/8",
  resolved: "text-green-400 bg-green-400/8",
  postmortem: "text-purple-400 bg-purple-400/8",
};

export default function IncidentsPage() {
  const { incidents } = useIncidentStore();
  const [search, setSearch] = useState("");
  const [sevFilter, setSevFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = incidents.filter((inc) => {
    const matchSearch =
      !search ||
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.service.toLowerCase().includes(search.toLowerCase());
    const matchSev = sevFilter === "all" || inc.severity === sevFilter;
    const matchStatus = statusFilter === "all" || inc.status === statusFilter;
    return matchSearch && matchSev && matchStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Incidents</h1>
          <p className="text-sm text-gray-500 mt-0.5">{incidents.length} total · {incidents.filter(i => i.status !== "resolved" && i.status !== "postmortem").length} active</p>
        </div>
        <Link href="/incidents/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all">
          <Plus className="w-4 h-4" /> New Incident
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incidents..."
            className="w-full bg-[#111827] border border-white/8 text-white placeholder-gray-500 text-sm pl-9 pr-4 py-2 rounded-lg outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        <select
          value={sevFilter}
          onChange={(e) => setSevFilter(e.target.value)}
          className="bg-[#111827] border border-white/8 text-gray-300 text-sm px-3 py-2 rounded-lg outline-none focus:border-blue-500/50"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#111827] border border-white/8 text-gray-300 text-sm px-3 py-2 rounded-lg outline-none focus:border-blue-500/50"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="investigating">Investigating</option>
          <option value="mitigating">Mitigating</option>
          <option value="resolved">Resolved</option>
          <option value="postmortem">Postmortem</option>
        </select>
      </div>

      {/* Incident Table */}
      <div className="bg-[#111827] border border-white/8 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-0 border-b border-white/8 px-4 py-2.5 text-[10px] uppercase tracking-wider text-gray-600 font-medium">
          <div className="w-24">ID</div>
          <div>Title</div>
          <div className="w-32 text-center">Severity</div>
          <div className="w-32 text-center">Status</div>
          <div className="w-36">Service</div>
          <div className="w-28 text-right">Time</div>
          <div className="w-10" />
        </div>
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <AlertTriangle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <div className="text-gray-500 text-sm">No incidents found</div>
          </div>
        ) : (
          filtered.map((inc, i) => (
            <motion.div
              key={inc.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={`/incidents/${inc.id}`}
                className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-0 items-center px-4 py-3.5 border-b border-white/5 hover:bg-white/4 transition-colors group"
              >
                <div className="w-24 font-mono text-xs text-gray-500">{inc.id}</div>
                <div className="min-w-0 pr-4">
                  <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors truncate">{inc.title}</div>
                  {inc.affectedUsers && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-600 mt-0.5">
                      <Users className="w-2.5 h-2.5" />{inc.affectedUsers.toLocaleString()} affected
                    </div>
                  )}
                </div>
                <div className="w-32 flex justify-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${SEV[inc.severity]}`}>
                    {inc.severity}
                  </span>
                </div>
                <div className="w-32 flex justify-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded capitalize ${STATUS[inc.status]}`}>
                    {inc.status}
                  </span>
                </div>
                <div className="w-36 font-mono text-xs text-gray-500 truncate">{inc.service}</div>
                <div className="w-28 flex items-center gap-1 justify-end text-[11px] text-gray-500">
                  <Clock className="w-3 h-3" />{formatRelativeTime(inc.createdAt)}
                </div>
                <div className="w-10 flex justify-end">
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
