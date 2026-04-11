import { LucideIcon } from "lucide-react";

interface TelemetryCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status?: "normal" | "warning" | "critical";
}

const statusColors = {
  normal: "text-success",
  warning: "text-warning",
  critical: "text-destructive",
};

export function TelemetryCard({ label, value, unit, icon: Icon, status = "normal" }: TelemetryCardProps) {
  return (
    <div className="bg-card rounded-lg p-4 card-shadow">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${statusColors[status]}`} />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-xl font-bold font-heading ${statusColors[status]}`}>
        {value}{unit && <span className="text-sm font-normal ml-1">{unit}</span>}
      </p>
    </div>
  );
}
