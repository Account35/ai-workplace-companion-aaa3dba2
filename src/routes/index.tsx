import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, MessageSquare, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | WorkFlow AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Generate professional emails, summarize meeting notes and chat with an AI workplace assistant — all in one clean dashboard.",
      },
      { property: "og:title", content: "WorkFlow AI Productivity Assistant" },
      {
        property: "og:description",
        content: "AI tools for workplace email, meeting summaries and everyday productivity.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a few key points into a polished, on-tone professional email.",
  },
  {
    to: "/summarizer" as const,
    icon: FileText,
    title: "Meeting Notes Summarizer",
    body: "Extract the summary, decisions, action items and deadlines from raw notes.",
  },
  {
    to: "/assistant" as const,
    icon: MessageSquare,
    title: "AI Workplace Assistant",
    body: "Ask anything about workplace writing, planning and prioritisation.",
  },
];

function Dashboard() {
  return (
    <AppLayout
      title="Dashboard"
      description="Three AI tools for everyday workplace productivity"
    >
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Work faster with AI you can review
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Every response is generated live from what you type — nothing is templated. Pick a tool to
          get started, then edit, copy or regenerate the output.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ to, icon: Icon, title, body }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="grid size-10 place-items-center rounded-lg bg-accent">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 text-sm font-semibold tracking-tight">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
              Open
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
