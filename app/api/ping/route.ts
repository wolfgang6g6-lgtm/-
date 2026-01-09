import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const apiBase = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

  if (!apiKey) {
    return new Response(
      JSON.stringify({ ok: false, reason: "missing_api_key" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const res = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "ping" }],
        stream: false,
        max_tokens: 8,
      }),
    });
    const text = await res.text();
    return new Response(
      JSON.stringify({ status: res.status, body: text.slice(0, 500) }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}

