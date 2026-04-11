import { Badge } from "@/components/ui/badge";
import type { ZoneType } from "@/data/mock";

const zoneConfig: Record<ZoneType, { label: string; className: string }> = {
  restricted: { label: "Restricted", className: "bg-destructive/15 text-destructive border-destructive/30" },
  warning: { label: "Warning", className: "bg-warning/15 text-warning border-warning/30" },
  "no-spray": { label: "No-Spray", className: "bg-primary/15 text-primary border-primary/30" },
};

export function ZoneBadge({ type }: { type: ZoneType }) {
  const config = zoneConfig[type];
  return <Badge variant="outline" className={`${config.className} font-medium`}>{config.label}</Badge>;
}
