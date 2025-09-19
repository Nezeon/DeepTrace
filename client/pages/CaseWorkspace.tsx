import TopNav from "@/components/layout/TopNav";
import CaseSidebar from "@/components/case/CaseSidebar";
import ChatPanel from "@/components/case/ChatPanel";
import RightInsights from "@/components/case/RightInsights";
import ReportModal from "@/components/modals/ReportModal";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cases } from "@/data/cases";
import { EntityExtraction, ForensicCase } from "@shared/api";
import { openPrintableReport } from "@/utils/report";

export default function CaseWorkspace() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const forensicCase: ForensicCase | undefined = useMemo(
    () => cases.find((c) => c.id === id),
    [id],
  );
  const [threadId, setThreadId] = useState<string>("t1");
  const [entities, setEntities] = useState<EntityExtraction>({
    emails: [],
    phones: [],
    crypto: [],
    numbers: [],
  });
  const [showReportModal, setShowReportModal] = useState(false);

  if (!forensicCase) {
    nav("/");
    return null;
  }

  const onReport = () => {
    setShowReportModal(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <TopNav onReport={onReport} showReport={true} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4">
        <div className="flex items-center justify-between py-3">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Dashboard
          </a>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              {forensicCase.description}
            </div>
            <h1 className="text-lg font-semibold">Case {forensicCase.id}</h1>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground"
              value={forensicCase.id}
              onChange={(e) => nav(`/case/${e.target.value}`)}
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>{c.id}</option>
              ))}
            </select>
            <button
              onClick={onReport}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>
        <div className="flex gap-6">
          <CaseSidebar
            caseId={forensicCase.id}
            onSelectThread={setThreadId}
            activeThread={threadId}
          />
          <ChatPanel threadId={threadId} onEntities={setEntities} />
          <RightInsights caseId={forensicCase.id} entities={entities} />
        </div>
      </main>
      
      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        data={{ forensicCase, entities }}
      />
    </div>
  );
}
