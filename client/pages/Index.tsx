import { useMemo, useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import TopNav from "@/components/layout/TopNav";
import CaseList from "@/components/case/CaseList";
import { cases } from "@/data/cases";
import { ForensicCase } from "@shared/api";

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
      <main className="mx-auto w-full max-w-7xl flex-1 px-4">
        <section className="py-6">
          <h1 className="text-2xl font-semibold tracking-tight">Forensic Cases</h1>
          <p className="text-sm text-muted-foreground">Search and open a case to start investigating.</p>
          <div className="mt-4 grid grid-cols-1 items-center gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <CaseList items={filtered} />
          </div>
        </section>
      </main>
    </div>
  );
}
