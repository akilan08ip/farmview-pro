import { Badge } from "@/components/ui/badge";
import type { MissionStatus } from "@/data/mock";

const statusConfig: Record<MissionStatus, { className: string }> = {
  Planned: { className: "bg-muted text-muted-foreground border-border" },
  Active: { className: "bg-primary/15 text-primary border-primary/30" },
  Completed: { className: "bg-success/15 text-success border-success/30" },
  Suspicious: { className: "bg-warning/15 text-warning border-warning/30" },
  Dangerous: { className: "bg-destructive/15 text-destructive border-destructive/30" },
};

export function MissionStatusBadge({ status }: { status: MissionStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={`${config.className} font-medium`}>
      {status}
    </Badge>
  );
}
