import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export function getGeminiModel(): GenerativeModel {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  });
}

export async function analyzeIncident(
  incidentDescription: string,
  similarIncidents: string,
  context?: string
): Promise<string> {
  const model = getGeminiModel();

  const prompt = `You are IncidentIQ, an elite AI-powered Site Reliability Engineer with deep expertise in production infrastructure, distributed systems, and incident management.

## Current Incident
${incidentDescription}

## Organizational Memory (Similar Past Incidents)
${similarIncidents}

${context ? `## Additional Context\n${context}` : ""}

## Your Task
Analyze this incident and provide a comprehensive response including:

1. **🔍 Incident Analysis** - What is happening and why
2. **🎯 Root Cause Assessment** - Most likely root causes (ranked by probability)
3. **⚡ Immediate Actions** - What to do RIGHT NOW (next 15 minutes)
4. **🔧 Investigation Steps** - How to diagnose further
5. **🛡️ Mitigation Plan** - How to reduce impact
6. **📊 Severity Assessment** - Critical/High/Medium/Low with reasoning
7. **👥 Escalation Recommendation** - Which team and on-call engineer to page
8. **🧠 Memory Insights** - Patterns from similar historical incidents
9. **📋 Resolution Checklist** - Step-by-step fix plan
10. **⏱️ Estimated Resolution Time** - Based on historical data

Format your response with clear headers, bullet points, and code blocks where relevant. Be specific, actionable, and concise. This is production — every second counts.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generatePostmortem(
  incident: {
    title: string;
    description: string;
    timeline: string;
    rootCause: string;
    resolution: string;
    impact: string;
    duration: number;
  }
): Promise<string> {
  const model = getGeminiModel();

  const prompt = `You are a senior SRE writing a professional postmortem for an engineering team at a top-tier tech company.

## Incident Details
**Title:** ${incident.title}
**Duration:** ${incident.duration} minutes
**Impact:** ${incident.impact}

## Timeline
${incident.timeline}

## Root Cause
${incident.rootCause}

## Resolution
${incident.resolution}

## Description
${incident.description}

Generate a complete, professional postmortem document following industry best practices. Include:

# Incident Postmortem: ${incident.title}

## Executive Summary
[2-3 sentence summary for leadership]

## Impact
[Quantified impact: users affected, revenue impact, SLA breach]

## Timeline
[Detailed chronological timeline]

## Root Cause Analysis
[5 Whys analysis and technical deep-dive]

## Contributing Factors
[What made this worse or possible]

## Resolution
[What was done to resolve the incident]

## Lessons Learned
[What we learned — both technical and process]

## Action Items
| Priority | Action | Owner | Due Date | Status |
|----------|--------|-------|----------|--------|

## Prevention Measures
[How to prevent this from happening again]

Make this sound professional, blameless, and actionable. Use specific technical details.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function streamIncidentAnalysis(
  message: string,
  history: Array<{ role: string; content: string }>,
  onChunk: (text: string) => void
): Promise<void> {
  const model = getGeminiModel();

  const systemContext = `You are IncidentIQ Copilot, an expert AI assistant for Site Reliability Engineers and DevOps teams. 
You have deep knowledge of:
- Distributed systems, microservices, Kubernetes, AWS/GCP/Azure
- Database performance, network issues, application monitoring
- Incident response, runbooks, postmortems
- Metrics, logs, traces (Datadog, Grafana, Prometheus)
- Common failure patterns and root causes

When analyzing incidents:
- Be specific and actionable
- Reference real tools and commands
- Use proper markdown formatting
- Include code blocks for commands
- Always suggest next steps
- Be concise but comprehensive

Current conversation context: You are actively helping resolve a production incident.`;

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: systemContext }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I'm IncidentIQ Copilot, ready to help resolve your production incident. I'll provide specific, actionable guidance. What's happening?" }],
      },
      ...history.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    ],
  });

  const result = await chat.sendMessageStream(message);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      onChunk(text);
    }
  }
}
