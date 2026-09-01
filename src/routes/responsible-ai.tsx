import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, EyeOff, AlertTriangle } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI | WorkFlow AI" },
      {
        name: "description",
        content:
          "How to use AI-generated workplace content responsibly: review outputs, protect confidential information and keep human judgement in the loop.",
      },
      { property: "og:title", content: "Responsible AI | WorkFlow AI" },
      {
        property: "og:description",
        content: "Guidance for reviewing AI output and protecting sensitive workplace information.",
      },
    ],
  }),
  component: ResponsibleAiPage,
});

const POINTS = [
  {
    icon: AlertTriangle,
    title: "Always review before you send",
    body: "AI-generated content may contain errors or inaccuracies. Always review AI-generated information before using it in professional communication or making decisions.",
  },
  {
    icon: EyeOff,
    title: "Keep confidential data out",
    body: "Do not enter confidential, personal or sensitive workplace information — including client data, credentials, salaries, legal matters or anything under NDA.",
  },
  {
    icon: ShieldCheck,
    title: "You stay accountable",
    body: "The assistant supports your judgement; it does not replace it. Verify facts, figures, names and deadlines against your own sources before acting.",
  },
];

function ResponsibleAiPage() {
  return (
    <AppLayout title="Responsible AI" description="Use AI output safely and accountably">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {POINTS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <span className="grid size-10 place-items-center rounded-lg bg-accent">
              <Icon className="size-5" />
            </span>
            <h2 className="mt-4 text-sm font-semibold tracking-tight">{title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground shadow-sm sm:p-6">
        <h2 className="mb-2 text-sm font-semibold tracking-tight text-foreground">
          How your data is handled
        </h2>
        <p>
          There are no accounts, no sign-in and no database in this application. Your inputs are
          sent to the AI model only to generate a response and are not stored by this app. Meeting
          summaries are limited to what appears in your own notes — the assistant is instructed not
          to invent people, decisions or deadlines.
        </p>
      </div>
    </AppLayout>
  );
}
