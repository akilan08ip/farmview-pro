import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { Alert } from "@/data/mock";

const severityConfig = {
  info: { icon: Info, className: "border-l-primary bg-primary/5" },
  warning: { icon: AlertTriangle, className: "border-l-warning bg-warning/5" },
  critical: { icon: AlertCircle, className: "border-l-destructive bg-destructive/5" },
};

export function AlertCard({ alert }: { alert: Alert }) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;
  return (
    <div className={`border-l-4 rounded-r-md p-3 ${config.className}`}>
      <div className="flex items-start gap-2">
        <Icon className="h-4 w-4 mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium">{alert.type}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
          <p className="text-xs text-muted-foreground mt-1">{alert.droneName} · {new Date(alert.timestamp).toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
