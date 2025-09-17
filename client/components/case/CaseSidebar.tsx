import { caseThreads, evidenceItems } from "@/data/cases";
import { EvidenceCategory } from "@shared/api";
import { FileText, MessageSquare, Phone, Image as ImageIcon, Folder } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const icons: Record<EvidenceCategory, any> = {
  Chats: MessageSquare,
  Calls: Phone,
  Media: ImageIcon,
  Documents: FileText,
};

interface Props {
  caseId: string;
  onSelectThread: (threadId: string) => void;
  activeThread?: string;
}

export default function CaseSidebar({ caseId, onSelectThread, activeThread }: Props) {
  const [category, setCategory] = useState<EvidenceCategory>("Chats");
  const threads = useMemo(() => (caseThreads[caseId] || []).filter((t) => t.category === category), [caseId, category]);
  const grouped = useMemo(() => {
    const items = evidenceItems[caseId] || [];
    const byCat: Record<EvidenceCategory, number> = { Chats: 0, Calls: 0, Media: 0, Documents: 0 };
    for (const i of items) byCat[i.category]++;
    return byCat;
  }, [caseId]);

  const categories: EvidenceCategory[] = ["Chats", "Calls", "Media", "Documents"];

  return (
    <aside className="flex h-full w-72 flex-col border-r bg-white" data-loc="components/case/CaseSidebar">
      <div className="px-3 py-3">
        <div className="text-xs font-medium text-muted-foreground">Evidence</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((c) => {
            const Icon = icons[c];
            const count = grouped[c] ?? 0;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs shadow-sm transition-colors hover:border-brand/30",
                  category === c ? "border-brand/40 bg-brand/5 text-brand" : "bg-white text-foreground/80",
                )}
              >
                <Icon className="h-3.5 w-3.5" /> {c}
                <span className="ml-1 rounded-full bg-muted px-1.5 text-[10px] text-muted-foreground">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="px-3 text-xs font-medium text-muted-foreground">Threads</div>
      <ScrollArea className="h-full">
        <ul className="px-2 py-2">
          {threads.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => onSelectThread(t.id)}
                className={cn(
                  "w-full rounded-md px-3 py-2 text-left hover:bg-accent",
                  activeThread === t.id && "bg-accent",
                )}
              >
                <div className="text-sm font-medium text-foreground">{t.title}</div>
                {t.snippet ? (
                  <div className="line-clamp-1 text-xs text-muted-foreground">{t.snippet}</div>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </aside>
  );
}
