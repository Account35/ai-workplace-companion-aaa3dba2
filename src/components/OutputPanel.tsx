import { Copy, RefreshCw, Trash2, Loader2, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function OutputPanel({
  value,
  onChange,
  onRegenerate,
  onClear,
  loading,
  error,
  emptyHint,
  rows = 16,
}: {
  value: string;
  onChange: (v: string) => void;
  onRegenerate: () => void;
  onClear: () => void;
  loading: boolean;
  error: string | null;
  emptyHint: string;
  rows?: number;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-tight">Result</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copy} disabled={!value || loading}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={onRegenerate} disabled={loading}>
            <RefreshCw className="size-4" />
            Regenerate
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear} disabled={loading || !value}>
            <Trash2 className="size-4" />
            Clear
          </Button>
        </div>
      </div>

      {error && (
        <p className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading && !value && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Generating with AI…
        </div>
      )}

      {!loading && !value && !error && (
        <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          {emptyHint}
        </div>
      )}

      {value && (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="resize-y font-mono text-sm leading-relaxed"
        />
      )}
    </div>
  );
}
