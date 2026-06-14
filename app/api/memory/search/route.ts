import { NextRequest } from "next/server";
import { recallIncidentMemories, recallRunbookMemories, recallPostmortemMemories } from "@/lib/hindsight";

export async function POST(req: NextRequest) {
  try {
    const { query, type = "all" } = await req.json();

    if (!query) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    let results: any = {};

    if (type === "incident" || type === "all") {
      results.incidents = await recallIncidentMemories(query);
    }
    if (type === "runbook" || type === "all") {
      results.runbooks = await recallRunbookMemories(query);
    }
    if (type === "postmortem" || type === "all") {
      results.postmortems = await recallPostmortemMemories(query);
    }

    return Response.json({ success: true, results });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to search memory" }, { status: 500 });
  }
}
