import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function streamIncidentAnalysis(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  onChunk: (text: string) => void
): Promise<void> {
  const systemPrompt = `You are IncidentIQ Copilot, an elite AI-powered Site Reliability Engineer embedded inside the IncidentIQ platform.

You have deep expertise in:
- Production incident response and triage
- Distributed systems, Kubernetes, microservices, cloud infrastructure (AWS/GCP/Azure)
- Database performance (PostgreSQL, MySQL, Redis, Cassandra, DynamoDB)
- Network diagnostics, CDN issues, DNS failures
- Application monitoring (Datadog, Grafana, Prometheus, PagerDuty)
- Log analysis, distributed tracing, metrics correlation
- Common failure patterns: cascading failures, thundering herds, memory leaks, connection pool exhaustion
- Incident runbooks, blameless postmortems, SRE best practices

When analyzing incidents:
- Be specific, actionable, and concise — every second in production counts
- Always provide ranked probable root causes with confidence percentages
- Include exact commands, queries, and tool-specific steps
- Use proper markdown: headers, bullets, code blocks with language tags
- Suggest immediate mitigation AND long-term fixes
- Reference similar failure patterns from organizational memory
- Estimate severity (Critical/High/Medium/Low) with clear reasoning
- Always end with "Next Steps" — what to do in the next 5 minutes

Format responses clearly with emojis for visual scanning during incidents.`;

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      ...history,
      { role: "user", content: message },
    ],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      onChunk(chunk.delta.text);
    }
  }
}

export async function analyzeIncident(
  incidentDescription: string,
  similarIncidents: string,
  context?: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are IncidentIQ, an elite AI-powered SRE platform. Analyze this production incident:

## Current Incident
${incidentDescription}

## Organizational Memory (Similar Past Incidents)
${similarIncidents}

${context ? `## Additional Context\n${context}` : ""}

Provide comprehensive analysis including:
1. **🔍 Incident Analysis** - What is happening
2. **🎯 Root Cause Assessment** - Ranked probable causes
3. **⚡ Immediate Actions** - Next 15 minutes
4. **🔧 Investigation Steps** - Diagnostic commands
5. **🛡️ Mitigation Plan** - Reduce impact now
6. **📊 Severity Assessment** - With reasoning
7. **👥 Escalation Recommendation** - Team to page
8. **🧠 Memory Insights** - Historical patterns
9. **📋 Resolution Checklist** - Step-by-step fix
10. **⏱️ Estimated Resolution Time**

Use markdown formatting with code blocks for commands.`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

export async function generatePostmortem(incident: {
  title: string;
  description: string;
  timeline: string;
  rootCause: string;
  resolution: string;
  impact: string;
  duration: number;
}): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 6000,
    messages: [
      {
        role: "user",
        content: `Generate a professional, blameless postmortem for this incident:

**Title:** ${incident.title}
**Duration:** ${incident.duration} minutes
**Impact:** ${incident.impact}
**Timeline:** ${incident.timeline}
**Root Cause:** ${incident.rootCause}
**Resolution:** ${incident.resolution}
**Description:** ${incident.description}

Write a complete postmortem document with:
# Incident Postmortem: ${incident.title}
## Executive Summary
## Impact Analysis
## Timeline
## Root Cause Analysis (5 Whys)
## Contributing Factors
## Resolution Steps
## Lessons Learned
## Action Items (table format)
## Prevention Measures
## SLA Impact

Make it professional-grade, suitable for engineering leadership review.`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}
