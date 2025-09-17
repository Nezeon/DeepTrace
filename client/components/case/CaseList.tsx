import CaseCard from "./CaseCard";
import { ForensicCase } from "@shared/api";
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  items: ForensicCase[];
}

export default function CaseList({ items }: Props) {
  const location = useLocation();
  const activeId = new URLSearchParams(location.search).get("case");
  return (
    <ScrollArea className="h-[calc(100vh-10rem)] pr-2" data-loc="components/case/CaseList">
      <div className="grid grid-cols-1 gap-3">
        {items.map((c) => (
          <Link key={c.id} to={`/case/${encodeURIComponent(c.id)}`} className="block">
            <CaseCard item={c} active={activeId === c.id} />
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
}
