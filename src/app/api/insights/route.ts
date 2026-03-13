import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are T1D Parent Copilot — a warm, supportive assistant for parents managing a child's Type 1 Diabetes.

You will receive a list of logged events from the past 7 days. Analyze the events and produce a brief, helpful weekly pattern summary.

Format your response as JSON with this exact structure:
{
  "summary": "One warm, encouraging sentence summarizing the week",
  "patterns": [
    {
      "title": "Short pattern title (4-6 words)",
      "detail": "1-2 sentence plain-language explanation of the pattern noticed",
      "category": "meal|exercise|illness|stress|high_bg|low_bg|general"
    }
  ],
  "questions": [
    "A question the parent might want to bring to their care team"
  ],
  "encouragement": "A brief warm closing message acknowledging their hard work"
}

Rules:
- Identify 2-4 meaningful patterns from the data
- Generate 1-3 questions for their care team
- NEVER suggest insulin doses or medical treatment changes
- Be warm, not clinical
- If data is sparse, acknowledge that and offer general observations
- All content is informational only`;

export async function POST(req: NextRequest) {
  try {
    const { events } = await req.json();

    const eventsText =
      Array.isArray(events) && events.length > 0
        ? events
            .map(
              (e: { timestamp: string; category: string; note: string; bloodSugar?: number }) =>
                `[${new Date(e.timestamp).toLocaleDateString()} ${new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}] ${e.category.toUpperCase()}${e.bloodSugar ? ` (${e.bloodSugar} mg/dL)` : ""}: ${e.note}`
            )
            .join("\n")
        : "No events logged this week.";

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Here are the events logged over the past 7 days:\n\n${eventsText}\n\nPlease analyze these and provide a weekly pattern summary in the specified JSON format.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "Failed to parse insights" }, { status: 500 });
    }

    const insights = JSON.parse(jsonMatch[0]);
    return Response.json(insights);
  } catch (err) {
    console.error("Insights API error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
