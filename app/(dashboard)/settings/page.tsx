"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Settings, Cpu, Bell, Sliders, ToggleLeft, ToggleRight, Save, Key, User, CloudLightning, Check, Globe } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [model, setModel] = useState("claude-sonnet-3.5");
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [datadogKey, setDatadogKey] = useState("••••••••••••••••••••••••••••");
  const [slackHook, setSlackHook] = useState("");
  
  // Toggles state
  const [pagerdutyActive, setPagerdutyActive] = useState(true);
  const [slackActive, setSlackActive] = useState(true);
  const [jiraActive, setJiraActive] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="p-6 overflow-y-auto h-full space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl font-bold text-white">System Settings</h1>
        </div>
        <p className="text-sm text-gray-500">
          Configure AI Copilot providers, monitoring integrations, notification preferences, and team settings.
        </p>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Tabs (Side) */}
        <div className="md:col-span-1 space-y-1">
          <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold px-3 py-2">Categories</div>
          {[
            { id: "ai", label: "AI Copilot Config", icon: Cpu },
            { id: "integrations", label: "Monitoring & Chats", icon: CloudLightning },
            { id: "notifications", label: "Notifications & SLA", icon: Bell },
            { id: "profile", label: "User Profile", icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold bg-[#111827] border border-white/5 hover:border-white/10 text-gray-300 hover:text-white transition-all text-left"
            >
              <tab.icon className="w-4 h-4 text-blue-400" />
              {tab.label}
            </button>
          ))}
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>

        {/* Configurations Fields */}
        <div className="md:col-span-2 space-y-6">
          {/* AI Settings */}
          <div className="bg-[#111827] border border-white/8 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-2.5 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" /> AI LLM Configuration
            </h3>
            
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase">Copilot Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#0A0F1E] border border-white/8 text-gray-300 text-xs px-3 py-2 rounded-lg outline-none focus:border-purple-500/50"
                >
                  <option value="claude-sonnet-3.5">Claude 3.5 Sonnet (Recommended)</option>
                  <option value="claude-opus-3.0">Claude 3.0 Opus (Legacy)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="gpt-4o">GPT-4o (OpenAI)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase">Temperature ({temperature})</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#0A0F1E] rounded-lg appearance-none cursor-pointer accent-purple-500 mt-2.5"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase">Max Tokens ({maxTokens})</label>
                  <input
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full bg-[#0A0F1E] border border-white/8 text-gray-300 text-xs px-3 py-1.5 rounded-lg outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Integrations settings */}
          <div className="bg-[#111827] border border-white/8 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-2.5 flex items-center gap-2">
              <CloudLightning className="w-4 h-4 text-orange-400" /> Infrastructure & Alert Integrations
            </h3>

            <div className="space-y-3">
              {/* PagerDuty */}
              <div className="flex items-center justify-between p-3 bg-[#0A0F1E] border border-white/5 rounded-lg">
                <div className="min-w-0 flex-1 pr-4">
                  <div className="text-xs font-bold text-white">PagerDuty Alerts</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Automatically import active incidents and synchronize on-call schedule.</div>
                </div>
                <button onClick={() => setPagerdutyActive(!pagerdutyActive)} className="text-gray-400 hover:text-white transition-colors">
                  {pagerdutyActive ? <ToggleRight className="w-8 h-8 text-blue-500" /> : <ToggleLeft className="w-8 h-8 text-gray-600" />}
                </button>
              </div>

              {/* Slack */}
              <div className="flex items-center justify-between p-3 bg-[#0A0F1E] border border-white/5 rounded-lg">
                <div className="min-w-0 flex-1 pr-4">
                  <div className="text-xs font-bold text-white">Slack Broadcast</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Push incident summaries, mitigation steps, and updates to Slack channel #incidents.</div>
                </div>
                <button onClick={() => setSlackActive(!slackActive)} className="text-gray-400 hover:text-white transition-colors">
                  {slackActive ? <ToggleRight className="w-8 h-8 text-blue-500" /> : <ToggleLeft className="w-8 h-8 text-gray-600" />}
                </button>
              </div>

              {/* Jira */}
              <div className="flex items-center justify-between p-3 bg-[#0A0F1E] border border-white/5 rounded-lg">
                <div className="min-w-0 flex-1 pr-4">
                  <div className="text-xs font-bold text-white">Jira Ticket Sync</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Auto-create Jira bug/task tickets whenever an incident is initiated.</div>
                </div>
                <button onClick={() => setJiraActive(!jiraActive)} className="text-gray-400 hover:text-white transition-colors">
                  {jiraActive ? <ToggleRight className="w-8 h-8 text-blue-500" /> : <ToggleLeft className="w-8 h-8 text-gray-600" />}
                </button>
              </div>

              {slackActive && (
                <div className="flex flex-col gap-1 bg-[#0A0F1E] p-3 rounded-lg border border-white/5">
                  <label className="text-[9px] text-gray-500 font-bold uppercase">Slack Webhook URL</label>
                  <input
                    type="text"
                    value={slackHook}
                    onChange={(e) => setSlackHook(e.target.value)}
                    className="w-full bg-[#111827] border border-white/8 text-gray-300 text-xs px-3 py-1.5 rounded-lg font-mono outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Notifications config */}
          <div className="bg-[#111827] border border-white/8 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-2.5 flex items-center gap-2">
              <Bell className="w-4 h-4 text-green-400" /> Notifications Alert Policies
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Email alerts for Critical incidents</span>
                <button onClick={() => setEmailAlerts(!emailAlerts)}>
                  {emailAlerts ? <ToggleRight className="w-7 h-7 text-blue-500" /> : <ToggleLeft className="w-7 h-7 text-gray-600" />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Siren and Browser Push notification</span>
                <button onClick={() => setPushAlerts(!pushAlerts)}>
                  {pushAlerts ? <ToggleRight className="w-7 h-7 text-blue-500" /> : <ToggleLeft className="w-7 h-7 text-gray-600" />}
                </button>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="bg-[#111827] border border-white/8 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-2.5 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" /> User Profile Info
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase">Name</label>
                <div className="bg-[#0A0F1E] border border-white/8 text-gray-400 text-xs px-3 py-2 rounded-lg font-medium select-none">
                  {user?.displayName ?? "Sarah Chen"}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase">Email</label>
                <div className="bg-[#0A0F1E] border border-white/8 text-gray-400 text-xs px-3 py-2 rounded-lg font-medium select-none">
                  {user?.email ?? "engineer@incidentiq.ai"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
