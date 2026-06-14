"use client";
import { create } from "zustand";
import { Incident, ChatMessage } from "@/types";
import { mockIncidents } from "@/lib/mock-data";

interface IncidentState {
  incidents: Incident[];
  selectedIncident: Incident | null;
  chatMessages: ChatMessage[];
  isAnalyzing: boolean;
  setSelectedIncident: (incident: Incident | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setIsAnalyzing: (v: boolean) => void;
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: mockIncidents,
  selectedIncident: mockIncidents[0],
  chatMessages: [
    {
      id: "welcome",
      role: "assistant",
      content: `# 👋 Welcome to IncidentIQ Copilot

I'm your AI-powered incident response partner, built on Claude Sonnet. I have access to your **organizational memory** — every past incident, runbook, and lesson learned.

**I can help you:**
- 🔍 Analyze active incidents and identify root causes
- 🧠 Search memory for similar past incidents  
- 📋 Generate investigation steps and runbooks
- 🛡️ Recommend immediate mitigation actions
- 📝 Create blameless postmortems

**Currently monitoring:** \`INC-1042\` — Production API Latency Spike (p99 >8s)

What would you like to investigate?`,
      timestamp: new Date(),
    },
  ],
  isAnalyzing: false,
  setSelectedIncident: (incident) => set({ selectedIncident: incident }),
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.chatMessages];
      const last = messages[messages.length - 1];
      if (last && last.role === "assistant") {
        messages[messages.length - 1] = { ...last, content, isStreaming: true };
      }
      return { chatMessages: messages };
    }),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  addIncident: (incident) =>
    set((state) => ({ incidents: [incident, ...state.incidents] })),
  updateIncident: (id, updates) =>
    set((state) => ({
      incidents: state.incidents.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
    })),
}));
