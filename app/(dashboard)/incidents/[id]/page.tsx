"use client";
import React, { use, useState, useEffect } from "react";
import { useIncidentStore } from "@/store/useIncidentStore";
import { severityColor, statusColor, formatDate, formatRelativeTime } from "@/lib/utils";
import { AlertTriangle, Clock, Users, Globe, User, Shield, Zap, ChevronLeft, Plus, CheckCircle, Brain, RefreshCw, Copy, Check, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Params {
  id: string;
}

export default function IncidentDetailsPage({ params }: { params: Promise<Params> }) {
  const router = useRouter();
  const { id } = use(params);
  const { incidents, updateIncident } = useIncidentStore();

  const incident = incidents.find((i) => i.id === id);

  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");
  const [assignee, setAssignee] = useState("");
  const [timelineDesc, setTimelineDesc] = useState("");
  
  // Postmortem Modal
  const [showPMModal, setShowPMModal] = useState(false);
  const [generatingPM, setGeneratingPM] = useState(false);
  const [postmortemContent, setPostmortemContent] = useState("");
  const [pmCopied, setPmCopied] = useState(false);

  useEffect(() => {
    if (incident) {
      setStatus(incident.status);
      setSeverity(incident.severity);
      setAssignee(incident.assignee || "");
    }
  }, [incident]);

  if (!incident) {
    return (
      <div className="p-6 text-center py-20 bg-[#0A0F1E] h-full flex flex-col justify-center items-center">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
        <h2 className="text-lg font-bold text-white mb-1">Incident Not Found</h2>
        <p className="text-gray-500 text-sm mb-4">The incident reference ID {id} does not exist.</p>
        <Link href="/incidents" className="text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Incidents
        </Link>
      </div>
    );
  }

  const handleUpdateStatus = (newStatus: string) => {
    setStatus(newStatus);
    updateIncident(incident.id, { status: newStatus as any });
    
    // Add timeline event
    const newTimelineEvent = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date(),
      type: newStatus === "resolved" ? "resolution" : "note" as any,
      title: `Status updated to ${newStatus}`,
      description: `Incident status changed to ${newStatus} by on-call engineer.`,
      author: "Sarah Chen",
    };
    updateIncident(incident.id, {
      timeline: [...incident.timeline, newTimelineEvent],
      updatedAt: new Date(),
      resolvedAt: newStatus === "resolved" ? new Date() : undefined,
    });

    toast.success(`Status updated to ${newStatus}`);
  };

  const handleUpdateSeverity = (newSeverity: string) => {
    setSeverity(newSeverity);
    updateIncident(incident.id, { severity: newSeverity as any });
    
    const newTimelineEvent = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date(),
      type: "escalation" as any,
      title: `Severity changed to ${newSeverity}`,
      description: `Incident severity was updated to ${newSeverity} due to business impact evaluation.`,
      author: "Sarah Chen",
    };
    updateIncident(incident.id, {
      timeline: [...incident.timeline, newTimelineEvent],
      updatedAt: new Date(),
    });

    toast.success(`Severity set to ${newSeverity}`);
  };

  const handleUpdateAssignee = (newAssignee: string) => {
    setAssignee(newAssignee);
    updateIncident(incident.id, { assignee: newAssignee });
    toast.success(`Assigned to ${newAssignee}`);
  };

  const handleAddTimelineEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timelineDesc.trim()) return;

    const newEvent = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date(),
      type: "note" as any,
      title: "Manual log entry",
      description: timelineDesc,
      author: "Sarah Chen",
    };

    updateIncident(incident.id, {
      timeline: [...incident.timeline, newEvent],
      updatedAt: new Date(),
    });

    setTimelineDesc("");
    toast.success("Timeline entry added");
  };

  // Generate Postmortem from AI API
  const handleGeneratePostmortem = async () => {
    setGeneratingPM(true);
    setShowPMModal(true);
    try {
      const durationMins = incident.resolvedAt
        ? Math.floor((incident.resolvedAt.getTime() - incident.createdAt.getTime()) / 60000)
        : incident.mttr || 45;

      const response = await fetch("/api/ai/postmortem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incident: {
            title: incident.title,
            duration: durationMins,
            service: incident.service,
            severity: incident.severity,
            impact: `Affecting ${incident.affectedUsers?.toLocaleString() ?? "100k+"} users.`,
            rootCause: incident.rootCause || "Database connection pool capacity exhaustion.",
            resolution: incident.resolution || "Increased max_connections capacity and added connection pooler.",
            description: incident.description,
          },
        }),
      });

      if (!response.ok) throw new Error("API failed");
      const data = await response.json();
      setPostmortemContent(data.postmortem);
    } catch (err) {
      toast.error("Failed to generate postmortem");
      setPostmortemContent("⚠️ AI failed to generate postmortem. Check Anthropic API key in environment config.");
    } finally {
      setGeneratingPM(false);
    }
  };

  const copyPMToClipboard = () => {
    navigator.clipboard.writeText(postmortemContent);
    setPmCopied(true);
    toast.success("Postmortem Markdown copied");
    setTimeout(() => setPmCopied(false), 2000);
  };

  return (
    <div className="p-6 overflow-y-auto h-full space-y-6">
      {/* Back button */}
      <Link href="/incidents" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Incidents
      </Link>

      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/8 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-gray-500">{incident.id}</span>
            <span className="text-[10px] text-gray-500 font-mono bg-[#111827] px-2 py-0.5 rounded border border-white/8">
              {incident.service}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white">{incident.title}</h1>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2.5">
          {incident.status === "resolved" && (
            <button
              onClick={handleGeneratePostmortem}
              className="flex items-center gap-1.5 px-3 py-1.8 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-all"
            >
              <FileText className="w-3.5 h-3.5" /> Postmortem Report
            </button>
          )}

          <select
            value={status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            className={`text-xs px-2.5 py-1.8 rounded-lg border outline-none font-bold capitalize bg-[#111827] ${statusColor(status)}`}
          >
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="mitigating">Mitigating</option>
            <option value="resolved">Resolved</option>
            <option value="postmortem">Postmortem</option>
          </select>

          <select
            value={severity}
            onChange={(e) => handleUpdateSeverity(e.target.value)}
            className={`text-xs px-2.5 py-1.8 rounded-lg border outline-none font-bold capitalize bg-[#111827] ${severityColor(severity)}`}
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Main Details Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Center pane (Timeline, logs, analysis) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-[#111827] border border-white/8 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Incident Description</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">{incident.description}</p>
          </div>

          {/* Timeline events */}
          <div className="bg-[#111827] border border-white/8 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Incident Timeline</h3>
            <div className="relative border-l border-white/8 ml-2.5 pl-5 space-y-5">
              {incident.timeline.map((event) => (
                <div key={event.id} className="relative">
                  {/* Circle dot on line */}
                  <div className={`absolute -left-[27px] top-0.5 w-3 h-3 rounded-full border border-black flex items-center justify-center ${
                    event.type === "detection" ? "bg-red-500" :
                    event.type === "escalation" ? "bg-orange-500" :
                    event.type === "mitigation" ? "bg-yellow-500" :
                    event.type === "resolution" ? "bg-green-500" :
                    event.type === "ai_insight" ? "bg-purple-500" : "bg-blue-500"
                  }`} />
                  
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {event.title}
                        {event.automated && (
                          <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.2 rounded font-mono">
                            Auto
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">{formatDate(new Date(event.timestamp))}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">{event.description}</p>
                    {event.author && (
                      <span className="text-[9px] text-gray-600 font-semibold block mt-1">Logged by: {event.author}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline event form */}
            <form onSubmit={handleAddTimelineEvent} className="mt-6 pt-5 border-t border-white/8 flex gap-3">
              <input
                value={timelineDesc}
                onChange={(e) => setTimelineDesc(e.target.value)}
                placeholder="Log a manual observation or step taken..."
                className="flex-1 bg-[#0A0F1E] border border-white/8 text-white placeholder-gray-500 text-xs px-3 py-2 rounded-lg outline-none focus:border-blue-500/50"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Log Entry
              </button>
            </form>
          </div>
        </div>

        {/* Right pane (Meta, assignees, actions) */}
        <div className="space-y-6">
          {/* Metadata details */}
          <div className="bg-[#111827] border border-white/8 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-2">Operational Context</h3>
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Service</span>
                <span className="text-xs font-mono text-white bg-[#0A0F1E] border border-white/8 px-2 py-0.5 rounded">{incident.service}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Team Ownership</span>
                <span className="text-xs text-white font-medium">{incident.team || "Platform Engineering"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Assignee</span>
                <select
                  value={assignee}
                  onChange={(e) => handleUpdateAssignee(e.target.value)}
                  className="bg-[#0A0F1E] border border-white/8 text-gray-300 text-xs px-2 py-1 rounded outline-none"
                >
                  <option value="">Unassigned</option>
                  <option value="Sarah Chen">Sarah Chen</option>
                  <option value="Alex Kumar">Alex Kumar</option>
                  <option value="Priya Sharma">Priya Sharma</option>
                  <option value="Mark Torres">Mark Torres</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Affected Users</span>
                <span className="text-xs text-white font-medium font-mono flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-gray-500" />
                  {incident.affectedUsers?.toLocaleString() ?? "Unknown"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Affected Regions</span>
                <div className="flex gap-1">
                  {incident.affectedRegions?.map(r => (
                    <span key={r} className="text-[10px] font-mono text-gray-400 bg-[#0A0F1E] border border-white/5 px-1.5 py-0.2 rounded">
                      {r}
                    </span>
                  )) ?? <span className="text-xs text-gray-500">Global</span>}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Incident Created</span>
                <span className="text-[11px] text-gray-400 font-mono">{formatDate(new Date(incident.createdAt))}</span>
              </div>
            </div>
          </div>

          {/* Root cause and resolution matched */}
          {(incident.rootCause || incident.resolution) && (
            <div className="bg-[#111827] border border-white/8 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-2">Analysis Results</h3>

              {incident.rootCause && (
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Identified Root Cause</div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">{incident.rootCause}</p>
                </div>
              )}

              {incident.resolution && (
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Applied Resolution</div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">{incident.resolution}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Postmortem Modal */}
      {showPMModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">AI Incident Postmortem Generator</h3>
              </div>
              <button
                onClick={() => setShowPMModal(false)}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 border border-white/8 px-2 py-0.8 rounded text-xs"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {generatingPM ? (
                <div className="text-center py-20 flex flex-col items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mb-3" />
                  <p className="text-sm text-gray-300 font-semibold">Analyzing timeline and details...</p>
                  <p className="text-xs text-gray-500 mt-1">SRE AI is generating blameless postmortem report.</p>
                </div>
              ) : (
                <div className="prose-incident border border-white/8 rounded-lg p-4 bg-[#0A0F1E] overflow-x-auto text-xs font-mono">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{postmortemContent}</ReactMarkdown>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-white/8 flex items-center justify-between flex-shrink-0 bg-[#0A0F1E]/50">
              <span className="text-[10px] text-gray-500">Auto-generated according to Google SRE best practices.</span>
              <button
                onClick={copyPMToClipboard}
                disabled={generatingPM || !postmortemContent}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all"
              >
                {pmCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Report Markdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
