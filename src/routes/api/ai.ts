import { createFileRoute } from "@tanstack/react-router";

type ChatTurn = { role: "user" | "assistant"; content: string };

type AiRequest = {
  mode?: "email" | "summary" | "chat";
  email?: {
    recipient?: string;
    purpose?: string;
    keyPoints?: string;
    tone?: string;
  };
  notes?: string;
  messages?: ChatTurn[];
};

const BASE_RULES =
  "You are an AI workplace productivity assistant for professionals. Be accurate, concise and practical. Never invent facts, names, dates or commitments that the user did not provide. Use clean markdown formatting.";

function buildInput(body: AiRequest): { instructions: string; input: unknown } | null {
  if (body.mode === "email") {
    const e = body.email ?? {};
    if (!e.purpose?.trim() && !e.keyPoints?.trim()) return null;
    return {
      instructions: `${BASE_RULES}\nYou write professional workplace emails. Output exactly this format:\nSubject: <one line subject>\n\n<email body with greeting, well-structured paragraphs and a sign-off>\nDo not add commentary, options or explanations. Only use information the user supplied; use neutral placeholders like [Your Name] when something is unknown.`,
      input: [
        {
          role: "user" as const,
          content: [
            {
              type: "input_text" as const,
              text: [
                `Recipient / audience: ${e.recipient?.trim() || "not specified"}`,
                `Purpose of the email: ${e.purpose?.trim() || "not specified"}`,
                `Key points to include:\n${e.keyPoints?.trim() || "not specified"}`,
                `Tone: ${e.tone || "Formal"}`,
              ].join("\n\n"),
            },
          ],
        },
      ],
    };
  }

  if (body.mode === "summary") {
    if (!body.notes?.trim()) return null;
    return {
      instructions: `${BASE_RULES}\nYou summarize meeting notes. Analyse ONLY the notes given. Never invent people, decisions, action items or deadlines. If a section has nothing in the notes, write "None mentioned".\nOutput exactly these markdown sections in this order:\n## Meeting Summary\n## Key Decisions\n## Action Items\n## Deadlines`,
      input: [
        {
          role: "user" as const,
          content: [
            { type: "input_text" as const, text: `Meeting notes:\n\n${body.notes.trim()}` },
          ],
        },
      ],
    };
  }

  const turns = (body.messages ?? []).filter((m) => m.content?.trim());
  if (turns.length === 0) return null;
  return {
    instructions: `${BASE_RULES}\nYou help with workplace communication, planning, prioritisation, writing and meeting preparation. Ask a short clarifying question when the request is ambiguous. Keep answers focused and actionable.`,
    input: turns.map((m) => ({
      role: m.role,
      content: [
        m.role === "assistant"
          ? { type: "output_text" as const, text: m.content }
          : { type: "input_text" as const, text: m.content },
      ],
    })),
  };
}

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("AI is not configured.", { status: 500 });

        let body: AiRequest;
        try {
          body = (await request.json()) as AiRequest;
        } catch {
          return new Response("Invalid request body.", { status: 400 });
        }

        const built = buildInput(body);
        if (!built) return new Response("Please provide some input first.", { status: 400 });

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
            "X-Lovable-AIG-SDK": "fetch",
          },
          body: JSON.stringify({
            model: "openai/gpt-5.6-sol",
            instructions: built.instructions,
            input: built.input,
            stream: true,
            store: false,
            reasoning: { effort: "low", summary: "auto" },
          }),
          signal: request.signal,
        });

        if (!upstream.ok || !upstream.body) {
          const detail = await upstream.text().catch(() => "");
          const message =
            upstream.status === 429
              ? "Too many requests right now. Please wait a moment and try again."
              : upstream.status === 402
                ? "AI credits are exhausted for this workspace. Please add credits to continue."
                : `The AI service returned an error (${upstream.status}). ${detail.slice(0, 200)}`;
          return new Response(message, { status: upstream.status || 500 });
        }

        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        const reader = upstream.body.getReader();

        const stream = new ReadableStream<Uint8Array>({
          async pull(controller) {
            let buffer = "";
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) {
                  controller.close();
                  return;
                }
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";
                for (const line of lines) {
                  if (!line.startsWith("data:")) continue;
                  const payload = line.slice(5).trim();
                  if (!payload || payload === "[DONE]") continue;
                  try {
                    const event = JSON.parse(payload) as { type?: string; delta?: string };
                    if (event.type === "response.output_text.delta" && event.delta) {
                      controller.enqueue(encoder.encode(event.delta));
                    }
                  } catch {
                    /* ignore partial/unknown events */
                  }
                }
              }
            } catch (error) {
              controller.error(error);
            }
          },
          cancel(reason) {
            return reader.cancel(reason);
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
