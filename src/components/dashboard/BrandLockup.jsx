import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export function BrandMark({ size = 20, className }) {
  return (
    <Shield
      className={cn("text-go-text shrink-0", className)}
      width={size}
      height={size}
      strokeWidth={1.75}
      aria-hidden
    />
  );
}

export function BrandLockup({ className, onNavigate, collapsed = false }) {
  return (
    <Link
      to={createPageUrl("SSNLookup")}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2.5 min-w-0 rounded-[10px] go-transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary",
        collapsed && "justify-center",
        className
      )}
      aria-label="Gray Ocean home"
    >
      <BrandMark size={20} />
      {!collapsed && (
        <span className="truncate text-[15px] font-semibold tracking-tight text-go-text">
          Gray Ocean
        </span>
      )}
    </Link>
  );
}
