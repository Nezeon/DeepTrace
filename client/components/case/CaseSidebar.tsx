import { evidenceItems } from "@/data/cases";
import { EvidenceCategory } from "@shared/api";
import { FileText, MessageSquare, Phone, Image as ImageIcon, Folder, List } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const icons: Record<EvidenceCategory | "All", any> = {
  All: List,
  Chats: MessageSquare,
  Calls: Phone,
  Media: ImageIcon,
  Documents: FileText,
};

interface Props {
  caseId: string;
  onSelectThread?: (id: string) => void;
  activeThread?: string;
}

export default function CaseSidebar({ caseId }: Props) {
  const [category, setCategory] = useState<EvidenceCategory | "All">("All");
  const items = useMemo(() => evidenceItems[caseId] || [], [caseId]);
  const grouped = useMemo(() => {
    const byCat: Record<EvidenceCategory, number> = { Chats: 0, Calls: 0, Media: 0, Documents: 0 };
    for (const i of items) byCat[i.category]++;
    return byCat;
  }, [items]);
  const nav: (EvidenceCategory | "All")[] = ["All", "Chats", "Calls", "Media", "Documents"];
  const visible = category === "All" ? items : items.filter((i) => i.category === category);

  return (
    <aside className="flex h-full w-80 flex-col border-r bg-white" data-loc="components/case/CaseSidebar">
      <div className="px-4 pb-2 pt-4">
        <div className="text-xs font-medium text-muted-foreground">Evidence Files</div>
        <div className="mt-3 space-y-1">
          {nav.map((c) => {
            const Icon = icons[c];
            const count = c === "All" ? items.length : grouped[c as EvidenceCategory] ?? 0;
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm",
                  active ? "bg-accent text-foreground" : "text-foreground/80 hover:bg-accent",
                )}
              >
                <span className="flex items-center gap-2"><Icon className="h-4 w-4" /> {c === "All" ? "All Evidence" : c}</span>
                <span className="rounded-full bg-muted px-2 text-[10px] text-muted-foreground">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
      <ScrollArea className="h-full">
        <ul className="px-3 pb-6">
          {visible.map((e) => {
            const Icon = icons[e.category];
            return (
              <li key={e.id} className="mb-2">
                <div className="rounded-lg border bg-card p-3 hover:border-brand/30">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{e.title}</span>
                    <span className="ml-auto rounded-full bg-muted px-2 text-[10px] text-muted-foreground">{e.meta}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </aside>
  );
}
