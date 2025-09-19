import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface TopNavProps {
  onReport?: () => void;
  showReport?: boolean;
  isHome?: boolean;
}

export default function TopNav({ onReport, showReport, isHome = false }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b glass elev supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-primary hover-lift">
          <Shield className="h-5 w-5 text-primary" />
          <span>DeepTrace</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {!isHome && showReport ? (
            <Button size="sm" onClick={onReport} className="gap-2 btn-primary-grad hover-lift">
              <FileText className="h-4 w-4" /> Generate Report
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
