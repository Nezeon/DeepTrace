import { CaseInsights, EntityExtraction } from "@shared/api";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BarChart2, CalendarDays, Link2, Mail, Phone, User, Wallet } from "lucide-react";
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
      { label: "Large BTC transfer", date: "2025-03-15" },
      { label: "Encrypted chat session", date: "2025-03-14" },
      { label: "Phone call cluster", date: "2025-03-13" },
      { label: "Document upload", date: "2025-03-12" },
      { label: "Suspicious login", date: "2025-03-11" },
    ];
    const summary = `Summary for ${caseId}.`;
    setInsights({ summary, entities, timeline });
  }, [caseId, entities]);

  const counts = useMemo(
    () => ({ emails: entities.emails.length, phones: entities.phones.length, crypto: entities.crypto.length, numbers: entities.numbers.length }),
    [entities],
  );

  if (!insights) return null;

  const Meter = ({ value }: { value: number }) => (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full bg-brand" style={{ width: `${value}%` }} />
    </div>
  );

  return (
    <aside className="hidden w-96 glass elev xl:flex xl:flex-col rounded-r-xl" data-loc="components/case/RightInsights">
      <ScrollArea className="h-[calc(100vh-7rem)]">
        <div className="space-y-4 p-4">
          <div className="surface p-4 rounded-xl anim-in">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium">Case Summary</div>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-2xl font-semibold">{47}</div>
                <div className="text-xs text-muted-foreground">Evidence Items</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-emerald-600">{42}</div>
                <div className="text-xs text-muted-foreground">Analyzed</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">{89}%</div>
                <div className="text-xs text-muted-foreground">Progress</div>
              </div>
            </div>
          </div>

          <div className="surface p-4 rounded-xl anim-in">
            <div className="mb-2 text-sm font-medium">Entity Types</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4"/> Email <span className="ml-auto text-muted-foreground">{counts.emails}</span></li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4"/> Phone <span className="ml-auto text-muted-foreground">{counts.phones}</span></li>
              <li className="flex items-center gap-2"><Wallet className="h-4 w-4"/> Crypto Wallets <span className="ml-auto text-muted-foreground">{counts.crypto}</span></li>
              <li className="flex items-center gap-2"><User className="h-4 w-4"/> People <span className="ml-auto text-muted-foreground">{Math.max(1, Math.round((counts.emails+counts.phones)/2))}</span></li>
            </ul>
          </div>

          <div className="surface p-4 rounded-xl anim-in">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium"><CalendarDays className="h-4 w-4"/> Recent Activity</div>
            <ul className="space-y-2 text-sm">
              {insights.timeline.map((t) => (
                <li key={t.label} className="flex items-center justify-between hover-lift rounded-lg px-2 py-1">
                  <span>{t.label}</span>
                  <span className="rounded-full bg-muted px-2 text-[10px] text-muted-foreground">{new Date(t.date).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface p-4 rounded-xl anim-in">
            <div className="mb-2 text-sm font-medium">Key Connections</div>
            <div className="space-y-3 text-sm">
              <div>
                <div className="mb-1 flex items-center justify-between"><span>John Doe</span><span className="text-muted-foreground">95%</span></div>
                <Meter value={95} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between"><span>Crypto Exchange</span><span className="text-muted-foreground">87%</span></div>
                <Meter value={87} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between"><span>Phone +1-555-0123</span><span className="text-muted-foreground">76%</span></div>
                <Meter value={76} />
              </div>
            </div>
          </div>

          <div className="surface p-4 rounded-xl anim-in">
            <div className="mb-2 text-sm font-medium">Active Alerts</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between"><span className="flex items-center gap-2 text-rose-600"><AlertTriangle className="h-4 w-4"/> High Risk</span><span className="text-muted-foreground">Large transfers</span></li>
              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600"/> Pattern Match</span><span className="text-muted-foreground">Spike before transfers</span></li>
              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-sky-600"/> Anomaly</span><span className="text-muted-foreground">Login location</span></li>
            </ul>
          </div>

          <div className="surface p-4 rounded-xl anim-in">
            <div className="mb-2 text-sm font-medium">Financial Summary</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Total Value</div>
                <div className="text-lg font-semibold">$2.3M</div>
              </div>
              <div>
                <div className="text-muted-foreground">Suspicious</div>
                <div className="text-lg font-semibold text-rose-600">$850K</div>
              </div>
              <div>
                <div className="text-muted-foreground">Crypto Addresses</div>
                <div className="text-lg font-semibold">{Math.max(1, counts.crypto)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Bank Accounts</div>
                <div className="text-lg font-semibold">3 linked</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
