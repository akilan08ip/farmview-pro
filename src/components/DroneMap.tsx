import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

interface DroneMapProps {
  className?: string;
  showRoutes?: boolean;
  showSafetyZones?: boolean;
  showDrone?: boolean;
  center?: [number, number];
  zoom?: number;
}

// Mock route coordinates (farm area near Iowa)
const plannedRoute: [number, number][] = [
  [42.034, -93.620],
  [42.036, -93.615],
  [42.038, -93.610],
  [42.040, -93.608],
  [42.042, -93.612],
  [42.044, -93.618],
];

const actualRoute: [number, number][] = [
  [42.034, -93.620],
  [42.0355, -93.616],
  [42.037, -93.611],
  [42.039, -93.609],
  [42.0415, -93.611],
  [42.043, -93.616],
];

const dronePosition: [number, number] = [42.043, -93.616];

const safetyZonePolygons: { coords: [number, number][]; color: string; name: string }[] = [
  {
    name: "River Buffer Zone",
    color: "#ef4444",
    coords: [
      [42.030, -93.625],
      [42.030, -93.620],
      [42.033, -93.620],
      [42.033, -93.625],
    ],
  },
  {
    name: "Residential Area",
    color: "#ef4444",
    coords: [
      [42.045, -93.622],
      [42.045, -93.616],
      [42.048, -93.616],
      [42.048, -93.622],
    ],
  },
  {
    name: "Organic Section",
    color: "#3b82f6",
    coords: [
      [42.036, -93.605],
      [42.036, -93.600],
      [42.040, -93.600],
      [42.040, -93.605],
    ],
  },
];

export function DroneMap({
  className = "",
  showRoutes = true,
  showSafetyZones = true,
  showDrone = true,
  center = [42.038, -93.613],
  zoom = 14,
}: DroneMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    if (showRoutes) {
      // Planned route (dashed green)
      L.polyline(plannedRoute, {
        color: "#22c55e",
        weight: 3,
        dashArray: "8 6",
        opacity: 0.7,
      }).addTo(map).bindPopup("Planned Route");

      // Actual route (solid orange)
      L.polyline(actualRoute, {
        color: "#f97316",
        weight: 3,
        opacity: 0.9,
      }).addTo(map).bindPopup("Actual Route");
    }

    if (showSafetyZones) {
      safetyZonePolygons.forEach((zone) => {
        L.polygon(zone.coords, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.15,
          weight: 2,
        }).addTo(map).bindPopup(`<b>${zone.name}</b>`);
      });
    }

    if (showDrone) {
      const droneIcon = L.divIcon({
        html: `<div style="background:#22c55e;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 8px rgba(34,197,94,0.6);"></div>`,
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      L.marker(dronePosition, { icon: droneIcon })
        .addTo(map)
        .bindPopup("<b>AgriHawk Alpha</b><br/>Battery: 78%<br/>Alt: 45m");
    }

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return <div ref={mapRef} className={`rounded-lg overflow-hidden border border-border ${className}`} />;
}
