"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, AlertTriangle, LayoutDashboard, Database, BookOpen, BarChart3, Network, Settings, Zap, Brain } from "lucide-react";
import { useIncidentStore } from "@/store/useIncidentStore";

const COMMANDS = [
  { icon: LayoutDashboard, label: "Go to Dashboard", href: "/dashboard", shortcut: "D", group: "Navigation" },
  { icon: AlertTriangle, label: "View Incidents", href: "/incidents", shortcut: "I", group: "Navigation" },
  { icon: Database, label: "Memory Vault", href: "/memory", shortcut: "M", group: "Navigation" },
  { icon: BookOpen, label: "Runbooks", href: "/runbooks", shortcut: "R", group: "Navigation" },
  { icon: BarChart3, label: "Analytics", href: "/analytics", shortcut: "A", group: "Navigation" },
  { icon: Network, label: "Knowledge Graph", href: "/knowledge-graph", shortcut: "G", group: "Navigation" },
  { icon: Settings, label: "Settings", href: "/settings", shortcut: "S", group: "Navigation" },
  { icon: Zap, label: "New Incident", href: "/incidents/new", group: "Actions" },
  { icon: Brain, label: "AI Analysis", href: "/dashboard", group: "Actions" },
];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { incidents } = useIncidentStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                autoFocus
                placeholder="Search incidents, runbooks, commands..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm outline-none"
              />
              <kbd className="text-[10px] text-gray-500 bg-[#1F2937] px-1.5 py-0.5 rounded border border-white/8">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {/* Recent incidents */}
              <div className="text-[10px] uppercase tracking-wider text-gray-600 px-2 py-1.5 font-medium">
                Active Incidents
              </div>
              {incidents.filter(i => i.status !== "resolved" && i.status !== "postmortem").slice(0, 3).map((incident) => (
                <button
                  key={incident.id}
                  onClick={() => handleSelect(`/incidents/${incident.id}`)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${
                    incident.severity === "critical" ? "text-red-400" :
                    incident.severity === "high" ? "text-orange-400" : "text-yellow-400"
                  }`} />
                  <div>
                    <div className="text-sm text-white">{incident.title}</div>
                    <div className="text-[11px] text-gray-500">{incident.id} · {incident.service}</div>
                  </div>
                  <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded border ${
                    incident.severity === "critical" ? "text-red-400 bg-red-400/10 border-red-400/20" :
                    "text-orange-400 bg-orange-400/10 border-orange-400/20"
                  }`}>{incident.severity.toUpperCase()}</span>
                </button>
              ))}

              {/* Navigation */}
              <div className="text-[10px] uppercase tracking-wider text-gray-600 px-2 py-1.5 font-medium mt-2">
                Navigation
              </div>
              {COMMANDS.filter(c => c.group === "Navigation").map((cmd) => (
                <button
                  key={cmd.href}
                  onClick={() => handleSelect(cmd.href)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <cmd.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-200">{cmd.label}</span>
                  {cmd.shortcut && (
                    <kbd className="ml-auto text-[10px] text-gray-500 bg-[#1F2937] px-1.5 py-0.5 rounded border border-white/8">
                      ⌘{cmd.shortcut}
                    </kbd>
                  )}
                </button>
              ))}
            </div>

            <div className="px-4 py-2.5 border-t border-white/8 flex items-center gap-4 text-[10px] text-gray-600">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>ESC close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
