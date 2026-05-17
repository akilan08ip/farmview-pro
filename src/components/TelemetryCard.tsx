import { memo } from "react";
import { LucideIcon } from "lucide-react";

interface TelemetryCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status?: "normal" | "warning" | "critical";
}

const statusStyles = {
  normal: {
    text: "text-success",
    ring: "ring-success/20",
    iconBg: "bg-success/10",
  },
  warning: {
    text: "text-warning",
    ring: "ring-warning/30",
    iconBg: "bg-warning/10",
  },
  critical: {
    text: "text-destructive",
    ring: "ring-destructive/40",
    iconBg: "bg-destructive/10",
  },
} as const;

function TelemetryCardImpl({ label, value, unit, icon: Icon, status = "normal" }: TelemetryCardProps) {
  const s = statusStyles[status];
  return (
    <div
      className={`bg-card rounded-lg p-3 card-shadow ring-1 ${s.ring} transition-colors hover:bg-muted/30 contain-layout`}
      style={{ contain: "layout paint" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${s.iconBg}`}>
          <Icon className={`h-3.5 w-3.5 ${s.text}`} />
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">{label}</span>
      </div>
      <p className={`text-xl font-bold font-heading leading-none ${s.text}`}>
        {value}
        {unit && <span className="text-xs font-normal ml-1 text-muted-foreground">{unit}</span>}
      </p>
    </div>
  );
}

export const TelemetryCard = memo(TelemetryCardImpl);
