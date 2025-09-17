import TopNav from "@/components/layout/TopNav\";\nimport CaseSidebar from \"@/components/case/CaseSidebar";
import ChatPanel from "@/components/case/ChatPanel";
import RightInsights from "@/components/case/RightInsights";
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
  const [entities, setEntities] = useState<EntityExtraction>({ emails: [], phones: [], crypto: [], numbers: [] });

  if (!forensicCase) {
    nav("/");
    return null;
  }

  const onReport = () => openPrintableReport({ forensicCase, entities });

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <TopNav onReport={onReport} showReport />
      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-0 px-4">
        <CaseSidebar caseId={forensicCase.id} onSelectThread={setThreadId} activeThread={threadId} />
        <ChatPanel threadId={threadId} onEntities={setEntities} />
        <RightInsights caseId={forensicCase.id} entities={entities} />
      </main>
    </div>
  );
}
