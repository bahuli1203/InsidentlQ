import { HindsightClient } from "@vectorize-io/hindsight-client";

const apiKey = process.env.HINDSIGHT_API_KEY || "";
const baseUrl = "https://api.hindsight.vectorize.io";
const bankId = process.env.HINDSIGHT_BANK_ID || "incidentiq-global-bank";

export const hindsightClient = new HindsightClient({
  baseUrl,
  apiKey,
});

// Helper to initialize bank on first demand
let isBankInitialized = false;
export async function ensureBank() {
  if (isBankInitialized) return;
  if (!apiKey) {
    console.warn("HINDSIGHT_API_KEY not found. Operations will degrade gracefully.");
    return;
  }
  try {
    await hindsightClient.createBank(bankId, {
      name: "IncidentIQ Organizational Memory Bank",
      reflectMission: "You are IncidentIQ, an elite AI-powered SRE memory layer. Help retrieve relevant context about past production outages, runbooks, logs, and postmortems.",
      retainMission: "Extract all relevant details about system crashes, database locks, API latency, root causes, mitigations, resolved dates, and runbook steps.",
      enableObservations: true,
    });
    isBankInitialized = true;
  } catch (error) {
    console.error("Failed to initialize Hindsight Bank:", error);
  }
}

export async function retainIncidentMemory(incident: {
  id: string;
  title: string;
  description: string;
  service: string;
  severity: string;
  rootCause?: string;
  resolution?: string;
}) {
  await ensureBank();
  if (!apiKey) return null;
  const content = `Incident ID: ${incident.id}
Title: ${incident.title}
Service: ${incident.service}
Severity: ${incident.severity}
Description: ${incident.description}
${incident.rootCause ? `Root Cause: ${incident.rootCause}` : ""}
${incident.resolution ? `Resolution: ${incident.resolution}` : ""}`;

  return hindsightClient.retain(bankId, content, {
    documentId: incident.id,
    tags: [incident.service, incident.severity, "incident"],
    updateMode: "replace",
  });
}

export async function retainRunbookMemory(runbook: {
  id: string;
  title: string;
  service: string;
  owner: string;
  content: string;
  tags: string[];
}) {
  await ensureBank();
  if (!apiKey) return null;
  const content = `Runbook ID: ${runbook.id}
Title: ${runbook.title}
Service: ${runbook.service}
Owner: ${runbook.owner}
Tags: ${runbook.tags.join(", ")}
Content:
${runbook.content}`;

  return hindsightClient.retain(bankId, content, {
    documentId: runbook.id,
    tags: [runbook.service, ...runbook.tags, "runbook"],
    updateMode: "replace",
  });
}

export async function retainPostmortemMemory(postmortem: string, incidentId: string, service: string) {
  await ensureBank();
  if (!apiKey) return null;
  return hindsightClient.retain(bankId, postmortem, {
    documentId: `pm-${incidentId}`,
    tags: [service, incidentId, "postmortem"],
    updateMode: "replace",
  });
}

export async function recallIncidentMemories(query: string) {
  await ensureBank();
  if (!apiKey) return [];
  try {
    const response = await hindsightClient.recall(bankId, query, {
      tags: ["incident"],
      tagsMatch: "any",
    });
    return response.results;
  } catch (error) {
    console.error("Hindsight recall error:", error);
    return [];
  }
}

export async function recallRunbookMemories(query: string) {
  await ensureBank();
  if (!apiKey) return [];
  try {
    const response = await hindsightClient.recall(bankId, query, {
      tags: ["runbook"],
      tagsMatch: "any",
    });
    return response.results;
  } catch (error) {
    console.error("Hindsight recall error:", error);
    return [];
  }
}

export async function recallPostmortemMemories(query: string) {
  await ensureBank();
  if (!apiKey) return [];
  try {
    const response = await hindsightClient.recall(bankId, query, {
      tags: ["postmortem"],
      tagsMatch: "any",
    });
    return response.results;
  } catch (error) {
    console.error("Hindsight recall error:", error);
    return [];
  }
}
