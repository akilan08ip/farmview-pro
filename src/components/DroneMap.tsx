import { memo, useEffect, useRef } from "react";
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
  region?: "iowa" | "india";
}

// India farm safety zones (real coordinates near major agri belts)
const indiaSafetyZones: { coords: [number, number][]; color: string; name: string; type: string }[] = [
  {
    name: "Punjab Wheat Belt — Restricted (Border Buffer)",
    type: "restricted",
    color: "#ef4444",
    coords: [
      [31.20, 75.30], [31.20, 75.55], [31.05, 75.55], [31.05, 75.30],
    ],
  },
  {
    name: "Yamuna River Buffer (Haryana)",
    type: "restricted",
    color: "#ef4444",
    coords: [
      [29.10, 77.20], [29.10, 77.40], [28.95, 77.40], [28.95, 77.20],
    ],
  },
  {
    name: "Nashik Vineyard — No Spray Zone",
    type: "no-spray",
    color: "#3b82f6",
    coords: [
      [20.00, 73.75], [20.00, 73.95], [19.85, 73.95], [19.85, 73.75],
    ],
  },
  {
    name: "Thanjavur Paddy Fields — Warning",
    type: "warning",
    color: "#f59e0b",
    coords: [
      [10.80, 79.10], [10.80, 79.30], [10.65, 79.30], [10.65, 79.10],
    ],
  },
  {
    name: "Coorg Coffee Estate — Organic",
    type: "no-spray",
    color: "#3b82f6",
    coords: [
      [12.45, 75.70], [12.45, 75.85], [12.30, 75.85], [12.30, 75.70],
    ],
  },
  {
    name: "Nagpur Orange Orchard — Restricted",
    type: "restricted",
    color: "#ef4444",
    coords: [
      [21.20, 78.95], [21.20, 79.15], [21.05, 79.15], [21.05, 78.95],
    ],
  },
];

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

function DroneMapImpl({
  className = "",
  showRoutes = true,
  showSafetyZones = true,
  showDrone = true,
  center,
  zoom,
  region = "iowa",
}: DroneMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const isIndia = region === "india";
    const resolvedCenter: [number, number] =
      center ?? (isIndia ? [22.9734, 78.6569] : [42.038, -93.613]);
    const resolvedZoom = zoom ?? (isIndia ? 5 : 14);

    const map = L.map(mapRef.current, {
      center: resolvedCenter,
      zoom: resolvedZoom,
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true, // canvas renderer: faster for polygons/polylines
      zoomAnimation: true,
      fadeAnimation: false,
      markerZoomAnimation: false,
      wheelDebounceTime: 40,
      wheelPxPerZoomLevel: 80,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
      updateWhenIdle: true,
      updateWhenZooming: false,
      keepBuffer: 2,
      crossOrigin: true,
    }).addTo(map);

    const renderer = L.canvas({ padding: 0.5 });

    if (showRoutes && !isIndia) {
      L.polyline(plannedRoute, {
        color: "#22c55e", weight: 3, dashArray: "8 6", opacity: 0.7, renderer,
      }).addTo(map).bindPopup("Planned Route");
      L.polyline(actualRoute, {
        color: "#f97316", weight: 3, opacity: 0.9, renderer,
      }).addTo(map).bindPopup("Actual Route");
    }

    if (showSafetyZones) {
      const zones = isIndia ? indiaSafetyZones : safetyZonePolygons;
      zones.forEach((zone) => {
        L.polygon(zone.coords, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.18,
          weight: 2,
          renderer,
        }).addTo(map).bindPopup(`<b>${zone.name}</b>`);
      });
    }

    if (showDrone && !isIndia) {
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

    // Ensure map renders correctly inside dialogs / animated containers
    const t = setTimeout(() => map.invalidateSize(), 150);

    // Throttled resize handling instead of leaflet's default per-frame work
    let resizeRaf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => map.invalidateSize());
    });
    ro.observe(mapRef.current);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(resizeRaf);
      ro.disconnect();
      map.remove();
      mapInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  return <div ref={mapRef} className={`rounded-lg overflow-hidden border border-border ${className}`} />;
}

export const DroneMap = memo(DroneMapImpl);
