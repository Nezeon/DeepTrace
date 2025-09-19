import { caseThreads } from "@/data/cases";
import { CaseThread } from "@shared/api";
import { Plus, MessageSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  caseId: string;
  onSelectThread: (threadId: string) => void;
  activeThread?: string;
}

export default function CaseSidebar({
  caseId,
  onSelectThread,
  activeThread,
}: Props) {
  const initial = useMemo<CaseThread[]>(
    () => (caseThreads[caseId] || []).filter((t) => t.category === "Chats"),
    [caseId],
  );
  const [threads, setThreads] = useState<CaseThread[]>(initial);

  useEffect(() => {
    setThreads(initial);
  }, [initial]);

  const createNewChat = () => {
    const id = `chat-${Date.now()}`;
    const t: CaseThread = {
      id,
      title: "New Chat",
      category: "Chats",
      snippet: "Start asking questions",
    };
    setThreads((prev) => [...prev, t]);
    onSelectThread(id);
  };

  return (
    <aside
      className="flex h-full w-80 flex-col border-r border-border glass elev rounded-l-xl"
      data-loc="components/case/CaseSidebar"
    >
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <div className="text-sm font-medium">Chats</div>
        <button
          onClick={createNewChat}
          className="inline-flex items-center gap-1 rounded-md btn-glass px-2 py-1 text-xs hover-lift"
        >
          <Plus className="h-3.5 w-3.5" /> New Chat
        </button>
      </div>
      <ScrollArea className="h-full">
        <ul className="px-3 pb-6">
          {threads.map((t) => (
            <li key={t.id} className="mb-2">
              <button
                onClick={() => onSelectThread(t.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg surface p-3 text-left hover-lift",
                  activeThread === t.id &&
                    "ring-1 ring-brand/20 border-brand/40",
                )}
              >
                <span className="rounded-md border bg-background p-1 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{t.title}</div>
                  {t.snippet ? (
                    <div className="truncate text-xs text-muted-foreground">
                      {t.snippet}
                    </div>
                  ) : null}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </aside>
  );
}
