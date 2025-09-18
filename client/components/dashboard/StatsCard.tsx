import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

export default function StatsCard({ title, value, icon }: Props) {
  return (
    <div className={cn("rounded-xl border bg-card p-4 shadow-sm")}> 
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
        </div>
        {icon ? (
          <div className="rounded-lg border bg-background p-2 text-muted-foreground">{icon}</div>
        ) : null}
      </div>
    </div>
  );
}
