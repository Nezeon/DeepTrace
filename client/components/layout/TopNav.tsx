import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, Shield, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

interface TopNavProps {
  onReport?: () => void;
  showReport?: boolean;
}

export default function TopNav({ onReport, showReport }: TopNavProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
          <Shield className="h-5 w-5 text-primary" />
          <span>ForensiQ</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {!isHome && showReport ? (
            <Button size="sm" onClick={onReport} className="gap-2">
              <FileText className="h-4 w-4" /> Generate Report
            </Button>
          ) : null}
          <a
            href="/"
            className={cn(
              "hidden items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground md:flex",
            )}
            aria-label="Go to dashboard"
          >
            <Sparkles className="h-4 w-4" />
            Dashboard
          </a>
          <div className="pl-1">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
