import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { streamAi } from "@/lib/ai-client";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | WorkFlow AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get a summary, key decisions, action items and deadlines extracted only from your notes.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | WorkFlow AI" },
      {
        property: "og:description",
        content: "Turn long meeting notes into decisions, actions and deadlines.",
      },
    ],
  }),
  component: SummarizerPage,
});

function SummarizerPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!notes.trim()) {
      setError("Paste your meeting notes first.");
      return;
    }
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      await streamAi({ mode: "summary", notes }, setOutput);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Meeting Notes Summarizer"
      description="Only what's in your notes — no invented people, decisions or dates"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="notes">Meeting notes</Label>
            <Textarea
              id="notes"
              rows={18}
              placeholder="Paste the full meeting notes or transcript here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{notes.length} characters</p>
          </div>
          <Button className="w-full" onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Summarizing…" : "Summarize notes"}
          </Button>
        </div>

        <OutputPanel
          value={output}
          onChange={setOutput}
          onRegenerate={generate}
          onClear={() => {
            setOutput("");
            setError(null);
          }}
          loading={loading}
          error={error}
          rows={20}
          emptyHint="Summary, key decisions, action items and deadlines will appear here, ready to edit."
        />
      </div>
    </AppLayout>
  );
}
