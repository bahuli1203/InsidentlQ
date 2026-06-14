"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, AlertTriangle, Database, BookOpen, BarChart3,
  Network, Settings, Shield, Zap, ChevronLeft, ChevronRight,
  Bell, Search, User, LogOut, Sun, Moon, Terminal, Brain
} from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useAuth } from "@/context/AuthContext";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { toast } from "sonner";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/incidents", icon: AlertTriangle, label: "Incidents", badge: 3 },
  { href: "/memory", icon: Database, label: "Memory Vault" },
  { href: "/runbooks", icon: BookOpen, label: "Runbooks" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/knowledge-graph", icon: Network, label: "Knowledge Graph" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { sidebarCollapsed, commandPaletteOpen, toggleSidebar, setCommandPaletteOpen, theme, toggleTheme } = useUIStore();
  const [notifOpen, setNotifOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandPaletteOpen]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    toast.success("Signed out successfully");
  };

  return (
    <div className="flex h-screen bg-[#0A0F1E] overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 64 : 220 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex-shrink-0 bg-[#111827] border-r border-white/8 flex flex-col relative z-10"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/8 overflow-hidden">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-bold text-sm whitespace-nowrap overflow-hidden"
                >
                  IncidentIQ
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative group ${
                  active
                    ? "bg-blue-500/15 text-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className={`w-4.5 h-4.5 flex-shrink-0 w-[18px] h-[18px] ${active ? "text-blue-400" : ""}`} />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap overflow-hidden flex-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge && !sidebarCollapsed && (
                  <span className="text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute right-0 top-1 bottom-1 w-0.5 bg-blue-400 rounded-l-full"
                  />
                )}
                {/* Tooltip when collapsed */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#1F2937] text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-white/10">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-2 border-t border-white/8">
          <div className={`flex items-center gap-2.5 p-2 rounded-lg ${sidebarCollapsed ? "justify-center" : ""}`}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {user?.displayName?.[0] ?? "S"}
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <div className="text-xs font-medium text-white truncate">{user?.displayName ?? "Sarah Chen"}</div>
                  <div className="text-[10px] text-gray-500 truncate">{user?.email ?? "sr-sre@company.com"}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={handleSignOut}
            className={`sidebar-item flex items-center gap-2 w-full px-2 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-all mt-1 ${sidebarCollapsed ? "justify-center" : ""}`}
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Sign out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#1F2937] border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors z-20"
        >
          {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top nav */}
        <header className="h-16 bg-[#111827]/80 backdrop-blur-sm border-b border-white/8 flex items-center px-6 gap-4 flex-shrink-0">
          {/* Search */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 bg-[#1F2937] border border-white/8 hover:border-white/15 text-gray-400 text-sm px-4 py-2 rounded-lg transition-all flex-1 max-w-sm"
          >
            <Search className="w-4 h-4" />
            <span>Search incidents...</span>
            <span className="ml-auto text-[10px] bg-[#374151] px-1.5 py-0.5 rounded text-gray-500 font-mono">⌘K</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg bg-[#1F2937] border border-white/8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="w-9 h-9 rounded-lg bg-[#1F2937] border border-white/8 flex items-center justify-center text-gray-400 hover:text-white transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-[#111827] border border-white/8 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-white/8 flex items-center justify-between">
                      <span className="text-sm font-medium">Notifications</span>
                      <span className="text-[10px] text-blue-400 cursor-pointer">Mark all read</span>
                    </div>
                    {[
                      { icon: AlertTriangle, text: "INC-1042 escalated to Critical", time: "2m ago", color: "text-red-400" },
                      { icon: Brain, text: "AI found 94% match for INC-1042", time: "5m ago", color: "text-blue-400" },
                      { icon: Zap, text: "INC-1041 mitigated — latency recovering", time: "20m ago", color: "text-green-400" },
                    ].map((n, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 hover:bg-white/5 cursor-pointer border-b border-white/8 last:border-0">
                        <n.icon className={`w-4 h-4 ${n.color} flex-shrink-0 mt-0.5`} />
                        <div>
                          <div className="text-xs text-gray-200">{n.text}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User avatar */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold cursor-pointer">
              {user?.displayName?.[0] ?? "S"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
}
