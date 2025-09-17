import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarDays, Hash } from "lucide-react";
import { ForensicCase } from "@shared/api";

const statusVariant: Record<ForensicCase["status"], { label: string; className: string }> = {
  Open: { label: "Open", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  "In Review": {
    label: "In Review",
    className: "bg-amber-50 text-amber-700 border-amber-100",
  },
  Closed: { label: "Closed", className: "bg-slate-100 text-slate-700 border-slate-200" },
  "On Hold": { label: "On Hold", className: "bg-indigo-50 text-indigo-700 border-indigo-100" },
};

interface Props {
  item: ForensicCase;
  active?: boolean;
}

export default function CaseCard({ item, active }: Props) {
  const status = statusVariant[item.status];
  const date = new Date(item.date).toLocaleDateString();
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 shadow-sm transition-colors hover:border-brand/30",
        active && "border-brand/40 ring-1 ring-brand/20",
      )}
      data-loc="components/case/CaseCard"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Hash className="h-4 w-4" />
          <span className="font-medium text-foreground">{item.id}</span>
        </div>
        <Badge className={cn("border", status.className)}>{status.label}</Badge>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        <span>{date}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{item.description}</p>
    </div>
  );
}
