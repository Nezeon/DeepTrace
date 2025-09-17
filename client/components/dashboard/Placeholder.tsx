import { FileSearch, Sparkles } from "lucide-react";

export default function DashboardPlaceholder() {
  return (
    <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border bg-card shadow-sm">
          <FileSearch className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Welcome to ForensiQ</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a case from the sidebar to open its workspace. Use the search to quickly filter cases.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> AI insights appear in the case workspace.
        </div>
      </div>
    </div>
  );
}
