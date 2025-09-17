import { CaseInsights, EntityExtraction } from "@shared/api";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Link2, Mail, Network, Phone, Shapes } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  caseId: string;
  entities: EntityExtraction;
}

export default function RightInsights({ caseId, entities }: Props) {
  const [insights, setInsights] = useState<CaseInsights | null>(null);

  useEffect(() => {
    const timeline = [
      { label: "Case opened", date: "2025-01-11" },
      { label: "First BTC mention", date: "2025-03-05" },
      { label: "Invoice uploaded", date: "2025-06-21" },
    ];
    const summary = `Live insights for ${caseId}. Entities update as you chat. Use Generate Report to export.`;
    setInsights({ summary, entities, timeline });
  }, [caseId, entities]);

  const counts = useMemo(
    () => ({
      emails: entities.emails.length,
      phones: entities.phones.length,
      crypto: entities.crypto.length,
      numbers: entities.numbers.length,
    }),
    [entities],
  );

  if (!insights) return null;

  return (
    <aside className="hidden w-80 border-l bg-white md:flex md:flex-col" data-loc="components/case/RightInsights">
      <ScrollArea className="h-[calc(100vh-7rem)]">
        <div className="space-y-4 p-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Quick Insights</div>
            <p className="mt-1 text-sm leading-relaxed text-foreground/80">{insights.summary}</p>
          </div>
          <Separator />
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Entities</div>
            <ul className="grid grid-cols-2 gap-2">
              <li className="rounded-lg border bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-4 w-4"/> Emails</div>
                <div className="mt-1 text-2xl font-semibold">{counts.emails}</div>
              </li>
              <li className="rounded-lg border bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="h-4 w-4"/> Phones</div>
                <div className="mt-1 text-2xl font-semibold">{counts.phones}</div>
              </li>
              <li className="rounded-lg border bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Link2 className="h-4 w-4"/> Crypto</div>
                <div className="mt-1 text-2xl font-semibold">{counts.crypto}</div>
              </li>
              <li className="rounded-lg border bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Shapes className="h-4 w-4"/> Numbers</div>
                <div className="mt-1 text-2xl font-semibold">{counts.numbers}</div>
              </li>
            </ul>
            {entities.emails.length + entities.crypto.length + entities.phones.length > 0 ? (
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                {[...entities.emails, ...entities.crypto, ...entities.phones].slice(0, 6).map((e) => (
                  <li key={e} className="truncate">{e}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <Separator />
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground"><Calendar className="h-4 w-4"/> Timeline</div>
            <ol className="relative ms-3 border-s ps-3">
              {insights.timeline.map((t) => (
                <li key={t.label} className="mb-3">
                  <div className="absolute -ms-1.5 mt-1.5 h-3 w-3 rounded-full border bg-brand/80" />
                  <div className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()}</div>
                  <div className="text-sm font-medium">{t.label}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
