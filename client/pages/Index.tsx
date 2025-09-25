import { useMemo, useState, useEffect } from "react";
import SearchBar from "@/components/common/SearchBar";
import TopNav from "@/components/layout/TopNav";
import CaseList from "@/components/case/CaseList";
import { cases as initialCases, evidenceItems } from "@/data/cases";
import { CaseStatus, ForensicCase } from "@shared/api";
import DashboardPlaceholder from "@/components/dashboard/Placeholder";
import StatsCard from "@/components/dashboard/StatsCard";
import { Calendar, FileStack, Info, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import NewCasePanel from "@/components/case/NewCasePanel";
import { Toaster, toast } from 'sonner';

export default function Index() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | CaseStatus>("All");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [cases, setCases] = useState<ForensicCase[]>(() => {
    const savedCases = localStorage.getItem('forensicCases');
    return savedCases ? JSON.parse(savedCases) : initialCases;
  });

  useEffect(() => {
    localStorage.setItem('forensicCases', JSON.stringify(cases));
  }, [cases]);

  const handleCaseCreate = (newCase: ForensicCase) => {
    setCases([newCase, ...cases]);
    toast.success("Case created (demo) — using dummy files");
  };

  const filtered: ForensicCase[] = useMemo(() => {
    const q = query.toLowerCase().trim();
    return cases.filter((c) => {
      const matchesQ = !q || [c.id, c.status, c.description, new Date(c.createdAt).toLocaleDateString()].some((v) =>
        String(v).toLowerCase().includes(q),
      );
      const matchesS = status === "All" || c.status === status;
      return matchesQ && matchesS;
    });
  }, [query, status, cases]);

  const activeCount = useMemo(() => cases.filter((c) => c.status === "Open").length, []);
  const reviewCount = useMemo(() => cases.filter((c) => c.status === "In Review").length, []);
  const totalEvidence = useMemo(
    () => Object.values(evidenceItems).reduce((acc, list) => acc + list.length, 0),
    [],
  );
  const closedThisMonth = useMemo(() => {
    const now = new Date();
    return cases.filter((c) => c.status === "Closed" && new Date(c.createdAt).getMonth() === now.getMonth() && new Date(c.createdAt).getFullYear() === now.getFullYear()).length;
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav isHome />
      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-6 anim-in">
        <aside className="w-full shrink-0 md:w-80">
          <div className="flex items-center justify-between surface p-3 rounded-xl">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Cases</h1>
              <p className="text-sm text-muted-foreground">Search and filter your cases.</p>
            </div>
            <Button size="sm" className="ml-2 btn-primary-grad hover-lift" onClick={() => setIsPanelOpen(true)}>New Case</Button>
          </div>
          <div className="mt-3 input-glass rounded-xl p-1">
            <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="mt-2">
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger className="h-9 rounded-lg input-glass">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 surface rounded-xl p-2 anim-in">
            <CaseList items={filtered} />
          </div>
          <NewCasePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} onCaseCreate={handleCaseCreate} />
          <Toaster />
        </aside>
        <section className="hidden flex-1 md:block">
          <div className="mb-4 surface p-4 rounded-xl anim-in">
            <h2 className="text-xl font-semibold">Forensic Investigation Dashboard</h2>
            <p className="text-sm text-muted-foreground">Manage and monitor ongoing digital forensic investigations</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Active Cases" value={activeCount} icon={<FileStack className="h-5 w-5" />} />
            <StatsCard title="Pending Review" value={reviewCount} icon={<Info className="h-5 w-5" />} />
            <StatsCard title="Total Evidence" value={totalEvidence} icon={<Users className="h-5 w-5" />} />
            <StatsCard title="Closed This Month" value={closedThisMonth} icon={<Calendar className="h-5 w-5" />} />
          </div>
          <div className="mt-4 surface rounded-xl p-8 text-center anim-in">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl border bg-background">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 15l3-3 4 4 5-5" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="text-sm font-medium">Dashboard Content Area</div>
            <p className="mx-auto mt-1 max-w-xl text-sm text-muted-foreground">This is a placeholder for additional dashboard content. You can add analytics, charts, recent activity feeds, or other overview components here.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
