export type ChatTurn = { role: "user" | "assistant"; content: string };

export type AiRequest =
  | {
      mode: "email";
      email: { recipient: string; purpose: string; keyPoints: string; tone: string };
    }
  | { mode: "summary"; notes: string }
  | { mode: "chat"; messages: ChatTurn[] };

export async function streamAi(
  body: AiRequest,
  onDelta: (fullText: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: signal ?? null,
  });

  if (!response.ok || !response.body) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "The AI request failed. Please try again.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    onDelta(text);
  }

  if (!text.trim()) throw new Error("The AI returned an empty response. Try regenerating.");
  return text;
}
