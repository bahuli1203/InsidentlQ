import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { message, incidentContext, history = [] } = await req.json();

    const systemPrompt = `You are IncidentIQ Copilot, an elite AI-powered Site Reliability Engineer built into the IncidentIQ platform.

You have deep expertise in:
- Production incident response, triage, and root cause analysis
- Distributed systems, Kubernetes, microservices, cloud infrastructure (AWS/GCP/Azure)
- Database performance (PostgreSQL, MySQL, Redis, Cassandra, DynamoDB)
- Network diagnostics, CDN issues, DNS failures, load balancers
- Application monitoring (Datadog, Grafana, Prometheus, PagerDuty, New Relic)
- Log analysis, distributed tracing (Jaeger, Zipkin), metrics correlation
- Common failure patterns: cascading failures, thundering herds, memory leaks, connection pool exhaustion, split-brain scenarios
- Incident runbooks, blameless postmortems, SRE best practices (Google SRE Book)

${incidentContext ? `## Current Incident Context\n${incidentContext}\n` : ""}

When analyzing incidents:
- Be specific and actionable — engineers need to act NOW
- Always provide ranked probable root causes with confidence % estimates
- Include exact commands, queries, and tool-specific steps (kubectl, psql, redis-cli, curl, etc.)
- Use proper markdown: headers with emojis, bullets, code blocks with language tags
- Suggest immediate mitigation AND long-term prevention
- Reference similar failure patterns from organizational memory
- Estimate severity (Critical/High/Medium/Low) with clear business impact reasoning
- Always end responses with **🚀 Next 5 Minutes** — concrete immediate actions

Format responses for visual scanning during high-stress incidents. Be the calmest, most expert voice in the room.`;

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const anthropicStream = anthropic.messages.stream({
            model: "claude-sonnet-4-5",
            max_tokens: 4096,
            system: systemPrompt,
            messages: [
              ...history.slice(-12).map((m: { role: string; content: string }) => ({
                role: m.role as "user" | "assistant",
                content: m.content,
              })),
              { role: "user", content: message },
            ],
          });

          for await (const chunk of anthropicStream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              const data = JSON.stringify({ text: chunk.delta.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const error = err instanceof Error ? err.message : "Unknown error";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return Response.json({ error: "Failed to process request" }, { status: 500 });
  }
}
