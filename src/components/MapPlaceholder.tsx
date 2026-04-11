import { MapPin } from "lucide-react";

export function MapPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-muted/50 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center ${className}`}>
      <div className="bg-primary/10 p-4 rounded-full mb-3">
        <MapPin className="h-8 w-8 text-primary" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">Map View</p>
      <p className="text-xs text-muted-foreground mt-1">Map integration placeholder — connect Mapbox or Leaflet</p>
    </div>
  );
}
