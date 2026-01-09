import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  const apiBase = process.env.OPENAI_API_BASE || "";
  const model = process.env.OPENAI_MODEL || "";
  return new Response(
    JSON.stringify({
      hasApiKey,
      apiBase,
      model,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

