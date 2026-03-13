import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

// Lazy-initialized to surface a clear error if ANTHROPIC_API_KEY is missing
let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        "ANTHROPIC_API_KEY environment variable is not set. Add it to .env.local for local development."
      );
    }
    _client = new Anthropic();
  }
  return _client;
}

const SYSTEM_PROMPT = `You are T1D Parent Copilot — a calm, warm, and supportive companion for parents managing a child's Type 1 Diabetes.

Your role:
- Help parents understand POSSIBLE explanations for blood sugar patterns (high or low)
- Suggest questions they might want to bring to their diabetes care team
- Offer gentle monitoring steps and things to watch for
- Acknowledge the emotional difficulty of T1D caregiving with empathy and warmth

STRICT RULES — you must follow these without exception:
1. NEVER recommend specific insulin doses, correction doses, or basal rate changes
2. NEVER tell the parent to give or hold insulin
3. NEVER make a medical treatment decision — even if asked directly
4. NEVER diagnose a medical condition
5. If a question is urgent or could be a medical emergency, tell the parent to call their care team or seek emergency care immediately
6. Always end responses about blood sugar patterns with a reminder that your suggestions are informational only

Your tone:
- Warm, calm, and reassuring — like a knowledgeable friend who truly understands T1D life
- Never clinical, preachy, or alarming
- Keep responses concise and easy to read on a phone
- Use short paragraphs and bullet points when listing possible factors
- Acknowledge how exhausting T1D management can be

Format:
- Use plain conversational language
- If listing possible causes, use a short bulleted list
- Keep total response under ~300 words unless more detail is truly needed`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid request", { status: 400 });
    }

    const client = getClient();
    const stream = client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Ask API error:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return new Response(message, { status: 500 });
  }
}
