import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { streamAi, type ChatTurn } from "@/lib/ai-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Workplace Assistant | WorkFlow AI" },
      {
        name: "description",
        content:
          "Chat with an AI assistant about workplace writing, meeting agendas, task planning and message improvements.",
      },
      { property: "og:title", content: "AI Workplace Assistant | WorkFlow AI" },
      {
        property: "og:description",
        content: "Real-time AI answers for everyday workplace questions.",
      },
    ],
  }),
  component: AssistantPage,
});

const SUGGESTIONS = [
  "Draft a professional email",
  "Create a meeting agenda",
  "Organize my tasks",
  "Improve this message",
  "Summarize these notes",
];

function AssistantPage() {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: ChatTurn[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError(null);
    setStreaming("");
    setLoading(true);
    try {
      const reply = await streamAi({ mode: "chat", messages: next }, setStreaming);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setStreaming("");
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="AI Workplace Assistant"
      description="Ask workplace questions and get live AI answers"
    >
      <div className="flex h-[65vh] min-h-[420px] flex-col rounded-xl border border-border bg-card shadow-sm">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 && !streaming && (
            <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
              Start a conversation — try one of the suggested prompts below.
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-muted/50",
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          {streaming && (
            <div className="flex justify-start">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm leading-relaxed">
                {streaming}
              </div>
            </div>
          )}
          {loading && !streaming && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Thinking…
            </div>
          )}
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <div ref={endRef} />
        </div>

        <div className="space-y-3 border-t border-border p-4">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s + ": ")}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <Textarea
              rows={2}
              value={input}
              placeholder="Ask anything about workplace communication or productivity…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              className="resize-none"
            />
            <Button onClick={() => void send(input)} disabled={loading || !input.trim()}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setMessages([]);
                setError(null);
              }}
              disabled={loading || messages.length === 0}
              aria-label="Clear conversation"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
