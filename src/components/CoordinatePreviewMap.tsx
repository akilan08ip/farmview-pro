import { useEffect, useRef } from "react";
import L from "leaflet";
import { AlertTriangle, MapPin } from "lucide-react";

// Fix default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface CoordinatePreviewMapProps {
  latitude: string;
  longitude: string;
  className?: string;
}

export function CoordinatePreviewMap({ latitude, longitude, className = "" }: CoordinatePreviewMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const latNum = latitude === "" ? NaN : Number(latitude);
  const lngNum = longitude === "" ? NaN : Number(longitude);
  const isValid = !isNaN(latNum) && !isNaN(lngNum) && latNum >= -90 && latNum <= 90 && lngNum >= -180 && lngNum <= 180;
  const hasValue = latitude !== "" || longitude !== "";
  const outOfRange = !isValid && hasValue && !isNaN(latNum) && !isNaN(lngNum);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
      maxZoom: 19,
      updateWhenIdle: true,
      updateWhenZooming: false,
      keepBuffer: 2,
      crossOrigin: true,
    }).addTo(map);

    mapInstance.current = map;

    const t = setTimeout(() => map.invalidateSize(), 150);
    return () => {
      clearTimeout(t);
      map.remove();
      mapInstance.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    if (isValid) {
      if (markerRef.current) {
        markerRef.current.setLatLng([latNum, lngNum]);
      } else {
        const icon = L.divIcon({
          html: `<div style="background:#16a34a;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 8px rgba(22,163,74,0.6);"></div>`,
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        markerRef.current = L.marker([latNum, lngNum], { icon }).addTo(map);
      }
      map.setView([latNum, lngNum], 14, { animate: true });
    } else {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    }
  }, [latNum, lngNum, isValid]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="rounded-lg overflow-hidden border border-border h-80 bg-muted" />
      {!isValid && hasValue && (
        <div className="absolute top-3 left-3 right-3 bg-destructive/90 text-destructive-foreground text-xs font-medium px-3 py-2 rounded-md flex items-center gap-2 backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            {outOfRange
              ? "Coordinates are outside allowed ranges (Lat -90 to 90, Lng -180 to 180)."
              : "Enter valid numeric coordinates to preview the location."}
          </span>
        </div>
      )}
      {!hasValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-primary/10 p-4 rounded-full mb-3">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Coordinate Preview</p>
          <p className="text-xs text-muted-foreground mt-1">Enter latitude and longitude to see the location</p>
        </div>
      )}
    </div>
  );
}
