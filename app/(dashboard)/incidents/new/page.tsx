"use client";
import { useState } from "react";
import { useIncidentStore } from "@/store/useIncidentStore";
import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronLeft, Plus, Zap, Shield, HelpCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Incident } from "@/types";

export default function NewIncidentPage() {
  const router = useRouter();
  const { addIncident } = useIncidentStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [service, setService] = useState("payments-api");
  const [severity, setSeverity] = useState("high");
  const [affectedUsers, setAffectedUsers] = useState(1000);
  const [regions, setRegions] = useState("us-east-1");
  const [tagsInput, setTagsInput] = useState("latency, payments");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in the incident title and description");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const affectedRegions = regions
      .split(",")
      .map((reg) => reg.trim())
      .filter((reg) => reg.length > 0);

    const generatedId = `INC-${Math.floor(1043 + Math.random() * 8900)}`;

    const newIncident: Incident = {
      id: generatedId,
      title,
      description,
      service,
      severity: severity as any,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      affectedUsers: Number(affectedUsers),
      affectedRegions,
      tags,
      assignee: "Sarah Chen",
      team: "Platform Engineering",
      timeline: [
        {
          id: Math.random().toString(36).substring(2, 9).toUpperCase(),
          timestamp: new Date(),
          type: "detection",
          title: "Incident Manual Declaration",
          description: `Incident manually declared by Sarah Chen. Primary symptoms: ${title}`,
          author: "Sarah Chen",
        },
      ],
    };

    addIncident(newIncident);
    toast.success(`Incident ${generatedId} declared successfully!`);
    router.push("/incidents");
  };

  return (
    <div className="p-6 overflow-y-auto h-full space-y-6 max-w-2xl">
      {/* Back to incidents */}
      <Link href="/incidents" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Incidents
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h1 className="text-xl font-bold text-white">Declare New Incident</h1>
        </div>
        <p className="text-sm text-gray-500">
          Declare a new system incident. This will broadcast notifications to connected teams and SRE on-call engineers.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-[#111827] border border-white/8 rounded-xl p-6 space-y-5">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Incident Summary Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. PostgreSQL connection pool exhaustion on checkoutDB"
            className="w-full bg-[#0A0F1E] border border-white/8 text-white placeholder-gray-600 text-xs px-3.5 py-2.5 rounded-lg outline-none focus:border-red-500/50 transition-colors"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Detailed Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe the failure mode, business impact, error logs, and any metrics observed..."
            className="w-full bg-[#0A0F1E] border border-white/8 text-white placeholder-gray-600 text-xs px-3.5 py-2.5 rounded-lg outline-none focus:border-red-500/50 transition-colors resize-none"
          />
        </div>

        {/* Service & Severity */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Target Service</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="bg-[#0A0F1E] border border-white/8 text-gray-300 text-xs px-3 py-2.5 rounded-lg outline-none focus:border-red-500/50"
            >
              <option value="payments-api">payments-api</option>
              <option value="session-store">session-store</option>
              <option value="ml-inference">ml-inference</option>
              <option value="cdn-cloudflare">cdn-cloudflare</option>
              <option value="user-service">user-service</option>
              <option value="api-gateway">api-gateway</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Initial Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="bg-[#0A0F1E] border border-white/8 text-gray-300 text-xs px-3 py-2.5 rounded-lg outline-none focus:border-red-500/50"
            >
              <option value="critical">Critical (P1)</option>
              <option value="high">High (P2)</option>
              <option value="medium">Medium (P3)</option>
              <option value="low">Low (P4)</option>
            </select>
          </div>
        </div>

        {/* Affected Users & Regions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Affected Users Estimate</label>
            <input
              type="number"
              value={affectedUsers}
              onChange={(e) => setAffectedUsers(Number(e.target.value))}
              className="w-full bg-[#0A0F1E] border border-white/8 text-white text-xs px-3.5 py-2.5 rounded-lg outline-none focus:border-red-500/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Affected Regions</label>
            <input
              value={regions}
              onChange={(e) => setRegions(e.target.value)}
              placeholder="e.g. us-east-1, eu-west-1"
              className="w-full bg-[#0A0F1E] border border-white/8 text-white placeholder-gray-600 text-xs px-3.5 py-2.5 rounded-lg outline-none focus:border-red-500/50"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Associated Tags (comma separated)</label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. database, locking, postgres"
            className="w-full bg-[#0A0F1E] border border-white/8 text-white placeholder-gray-600 text-xs px-3.5 py-2.5 rounded-lg outline-none focus:border-red-500/50"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
          <Link
            href="/incidents"
            className="px-4 py-2 border border-white/8 hover:border-white/12 hover:bg-white/5 text-gray-400 hover:text-white text-xs font-bold rounded-lg transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Declare Incident
          </button>
        </div>
      </form>
    </div>
  );
}
