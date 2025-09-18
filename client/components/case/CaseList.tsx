import CaseCard from "./CaseCard";
import { ForensicCase } from "@shared/api";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  items: ForensicCase[];
}

export default function CaseList({ items }: Props) {
  const activeId = typeof window !== "undefined" ? decodeURIComponent(window.location.pathname.split("/").pop() || "") : "";
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
