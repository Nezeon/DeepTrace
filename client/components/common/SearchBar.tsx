import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Input> {}

export default function SearchBar({ className, ...props }: Props) {
  return (
    <div className={cn("relative", className)} data-loc="components/common/SearchBar">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search cases..."
        className="pl-9 h-11 rounded-lg bg-card shadow-sm ring-0 focus-visible:ring-brand/30"
        {...props}
      />
    </div>
  );
}
