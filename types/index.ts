export type Severity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "active" | "investigating" | "mitigating" | "resolved" | "postmortem";

export interface Incident {
  id: string;
  title: string;
  description: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  mttr?: number; // in minutes
  affectedUsers?: number;
  affectedRegions?: string[];
  rootCause?: string;
  resolution?: string;
  tags: string[];
  assignee?: string;
  team?: string;
  timeline: TimelineEvent[];
  aiAnalysis?: AIAnalysis;
  similarIncidents?: SimilarIncident[];
  postmortem?: Postmortem;
}

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: "detection" | "investigation" | "escalation" | "mitigation" | "resolution" | "postmortem" | "note" | "ai_insight";
  title: string;
  description: string;
  author?: string;
  automated?: boolean;
}

export interface AIAnalysis {
  rootCauses: string[];
  investigationSteps: string[];
  resolutionPlan: string[];
  predictedSeverity: Severity;
  confidenceScore: number;
  suggestedTeam: string;
  estimatedResolutionTime: number; // minutes
  memoryMatches: number;
}

export interface SimilarIncident {
  id: string;
  title: string;
  service: string;
  similarity: number; // 0-100
  rootCause: string;
  resolution: string;
  date: Date;
  resolutionTime: number; // minutes
}

export interface Runbook {
  id: string;
  title: string;
  service: string;
  owner: string;
  usageCount: number;
  lastUpdated: Date;
  confidenceScore: number;
  tags: string[];
  content: string;
  steps: RunbookStep[];
  relatedIncidents: string[];
}

export interface RunbookStep {
  id: string;
  order: number;
  title: string;
  description: string;
  command?: string;
  expectedOutput?: string;
}

export interface Postmortem {
  id: string;
  incidentId: string;
  executiveSummary: string;
  timeline: TimelineEvent[];
  rootCause: string;
  impact: string;
  resolution: string;
  lessonsLearned: string[];
  actionItems: ActionItem[];
  generatedAt: Date;
  approvedBy?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  owner: string;
  dueDate: Date;
  status: "open" | "in_progress" | "done";
  priority: "critical" | "high" | "medium" | "low";
}

export interface MemoryEntry {
  id: string;
  incidentId: string;
  service: string;
  date: Date;
  rootCause: string;
  resolution: string;
  similarityScore?: number;
  severity: Severity;
  tags: string[];
  embedding?: number[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  metadata?: {
    memoryMatches?: number;
    confidence?: number;
    sources?: string[];
  };
}

export interface Stats {
  activeIncidents: number;
  criticalAlerts: number;
  mttr: number;
  memoryMatches: number;
  aiAccuracy: number;
  resolvedToday: number;
}

export interface KnowledgeNode {
  id: string;
  type: "incident" | "service" | "team" | "rootcause" | "runbook";
  label: string;
  data: Record<string, unknown>;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  weight?: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "admin" | "engineer" | "viewer";
  team?: string;
}
