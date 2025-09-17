import { useMemo, useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import TopNav from "@/components/layout/TopNav";
import CaseList from "@/components/case/CaseList";
import { cases } from "@/data/cases";
import { ForensicCase } from "@shared/api";
import DashboardPlaceholder from "@/components/dashboard/Placeholder";

export default function Index() {
  const [query, setQuery] = useState("");

  const filtered: ForensicCase[] = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return cases;
    return cases.filter((c) =>
      [c.id, c.status, c.description, new Date(c.date).toLocaleDateString()].some((v) =>
        String(v).toLowerCase().includes(q),
      ),
    );
  }, [query]);

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <TopNav />
      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-6">
        <aside className="w-full shrink-0 md:w-80">
          <h1 className="text-2xl font-semibold tracking-tight">Cases</h1>
          <p className="text-sm text-muted-foreground">Search and open a case to start investigating.</p>
          <div className="mt-3">
            <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="mt-4 rounded-lg border bg-card p-2">
            <CaseList items={filtered} />
          </div>
        </aside>
        <section className="hidden flex-1 rounded-lg border bg-card md:block">
          <DashboardPlaceholder />
        </section>
      </main>
    </div>
  );
}
