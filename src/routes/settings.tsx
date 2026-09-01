import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | WorkFlow AI" },
      {
        name: "description",
        content:
          "Set your default email tone and workspace preferences for the AI productivity assistant.",
      },
      { property: "og:title", content: "Settings | WorkFlow AI" },
      {
        property: "og:description",
        content: "Local preferences for the AI workplace productivity assistant.",
      },
    ],
  }),
  component: SettingsPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"];

function SettingsPage() {
  const [tone, setTone] = useState("Formal");
  const [streamOutput, setStreamOutput] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("wf-default-tone");
    if (stored) setTone(stored);
  }, []);

  const save = () => {
    localStorage.setItem("wf-default-tone", tone);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <AppLayout title="Settings" description="Preferences stored only in this browser">
      <div className="space-y-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="space-y-2">
          <Label>Default email tone</Label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <Button
                key={t}
                variant={tone === t ? "default" : "outline"}
                size="sm"
                onClick={() => setTone(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium">Stream responses live</p>
            <p className="text-xs text-muted-foreground">
              Show AI output as it is written instead of waiting for the full response.
            </p>
          </div>
          <Switch checked={streamOutput} onCheckedChange={setStreamOutput} />
        </div>

        <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          This app has no accounts, no sign-in and no database. Nothing you type is stored on a
          server — content is sent to the AI model only to produce your response.
        </div>

        <Button onClick={save}>{saved ? "Saved" : "Save preferences"}</Button>
      </div>
    </AppLayout>
  );
}
