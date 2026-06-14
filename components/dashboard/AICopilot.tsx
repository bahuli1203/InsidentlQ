"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIncidentStore } from "@/store/useIncidentStore";
import { ChatMessage } from "@/types";
import { Brain, Send, Zap, Copy, Check, Terminal, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

const SUGGESTED_PROMPTS = [
  "Analyze the current incident and find similar past cases",
  "What are the top 3 probable root causes?",
  "Generate investigation steps for this incident",
  "What immediate mitigation can we apply right now?",
  "Generate a postmortem for the resolved incident",
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded bg-[#1F2937] border border-white/10 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
    >
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function MessageContent({ content, isStreaming }: { content: string; isStreaming?: boolean }) {
  return (
    <div className={`prose-incident text-sm ${isStreaming ? "typing-cursor" : ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;
            const codeString = String(children).replace(/\n$/, "");
            if (!isInline && match) {
              return (
                <div className="relative group my-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0f172a] border-b border-white/8 rounded-t-lg">
                    <Terminal className="w-3 h-3 text-gray-500" />
                    <span className="text-[10px] text-gray-500 font-mono">{match[1]}</span>
                    <CopyButton text={codeString} />
                  </div>
                  <SyntaxHighlighter
                    style={oneDark as Record<string, React.CSSProperties>}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: "0 0 8px 8px",
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderTop: "none",
                      fontSize: "0.78rem",
                    }}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function AICopilot() {
  const { selectedIncident, chatMessages, addChatMessage, updateLastMessage, setIsAnalyzing, isAnalyzing } = useIncidentStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = async (text?: string) => {
    const message = text || input.trim();
    if (!message || isAnalyzing) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    addChatMessage(userMsg);
    setIsAnalyzing(true);

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };
    addChatMessage(assistantMsg);

    try {
      // Build context from selected incident
      const incidentContext = selectedIncident
        ? `Active Incident: ${selectedIncident.title} (${selectedIncident.id})
Service: ${selectedIncident.service}
Severity: ${selectedIncident.severity}
Status: ${selectedIncident.status}
Description: ${selectedIncident.description}
Affected Users: ${selectedIncident.affectedUsers?.toLocaleString() ?? "Unknown"}`
        : "No specific incident selected";

      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          incidentContext,
          history: chatMessages
            .filter((m) => m.id !== "welcome")
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error("API error");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulated += parsed.text;
                updateLastMessage(accumulated);
              }
            } catch {}
          }
        }
      }

      // Mark streaming done
      updateLastMessage(accumulated);
    } catch (err) {
      updateLastMessage("⚠️ Failed to connect to AI. Please check your API key and try again.");
      toast.error("AI connection failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0F1E]">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-sm font-semibold">AI Incident Copilot</div>
            <div className="text-[10px] text-gray-500">Powered by Claude Sonnet</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAnalyzing && (
            <div className="flex items-center gap-1.5 text-xs text-blue-400">
              <div className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-blue-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <span>Analyzing...</span>
            </div>
          )}
          {selectedIncident && (
            <span className="text-[10px] font-mono text-gray-500 bg-[#111827] px-2 py-1 rounded border border-white/8">
              {selectedIncident.id}
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {chatMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              msg.role === "assistant"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-[#1F2937] text-gray-400"
            }`}>
              {msg.role === "assistant" ? <Brain className="w-3.5 h-3.5" /> : "U"}
            </div>

            {/* Content */}
            <div className={`flex-1 max-w-[85%] ${msg.role === "user" ? "items-end" : ""} flex flex-col`}>
              {msg.role === "user" ? (
                <div className="bg-blue-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm self-end">
                  {msg.content}
                </div>
              ) : (
                <div className="bg-[#111827] border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
                  <MessageContent content={msg.content || "▋"} isStreaming={msg.isStreaming && !msg.content} />
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      {chatMessages.length <= 1 && (
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.slice(0, 3).map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="text-xs text-gray-400 bg-[#111827] border border-white/8 hover:border-blue-500/40 hover:text-blue-400 px-3 py-1.5 rounded-lg transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-5 py-3 border-t border-white/8 flex-shrink-0">
        <div className="flex items-end gap-2 bg-[#111827] border border-white/10 focus-within:border-blue-500/50 rounded-xl px-4 py-2.5 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder="Describe the incident or ask for analysis..."
            disabled={isAnalyzing}
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none resize-none max-h-28 disabled:opacity-50"
            style={{ lineHeight: "1.5" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isAnalyzing}
            className="flex-shrink-0 w-8 h-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <div className="flex items-center gap-4 mt-2 px-1">
          <span className="text-[10px] text-gray-600">↵ Send · Shift+↵ New line</span>
          {SUGGESTED_PROMPTS.slice(3).map((p) => (
            <button key={p} onClick={() => sendMessage(p)} className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />{p.slice(0, 30)}...
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
