import { useMemo, useState } from "react";
import { MapPin, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Combined restricted/no-spray/warning zones across India + Iowa demo farms
type Zone = { name: string; type: "restricted" | "warning" | "no-spray"; coords: [number, number][] };

const ALL_ZONES: Zone[] = [
  { name: "Punjab Wheat Belt — Restricted (Border Buffer)", type: "restricted", coords: [[31.20, 75.30], [31.20, 75.55], [31.05, 75.55], [31.05, 75.30]] },
  { name: "Yamuna River Buffer (Haryana)", type: "restricted", coords: [[29.10, 77.20], [29.10, 77.40], [28.95, 77.40], [28.95, 77.20]] },
  { name: "Nashik Vineyard — No Spray Zone", type: "no-spray", coords: [[20.00, 73.75], [20.00, 73.95], [19.85, 73.95], [19.85, 73.75]] },
  { name: "Thanjavur Paddy Fields — Warning", type: "warning", coords: [[10.80, 79.10], [10.80, 79.30], [10.65, 79.30], [10.65, 79.10]] },
  { name: "Coorg Coffee Estate — Organic", type: "no-spray", coords: [[12.45, 75.70], [12.45, 75.85], [12.30, 75.85], [12.30, 75.70]] },
  { name: "Nagpur Orange Orchard — Restricted", type: "restricted", coords: [[21.20, 78.95], [21.20, 79.15], [21.05, 79.15], [21.05, 78.95]] },
  { name: "Bengaluru Airport Buffer", type: "restricted", coords: [[13.22, 77.68], [13.22, 77.74], [13.18, 77.74], [13.18, 77.68]] },
  { name: "Hyderabad Outer Reservoir", type: "warning", coords: [[17.45, 78.30], [17.45, 78.36], [17.41, 78.36], [17.41, 78.30]] },
  { name: "River Buffer Zone (Iowa Farm)", type: "restricted", coords: [[42.030, -93.625], [42.030, -93.620], [42.033, -93.620], [42.033, -93.625]] },
  { name: "Residential Area (Iowa Farm)", type: "restricted", coords: [[42.045, -93.622], [42.045, -93.616], [42.048, -93.616], [42.048, -93.622]] },
];

function centroid(coords: [number, number][]): [number, number] {
  const n = coords.length;
  let lat = 0, lng = 0;
  for (const [la, ln] of coords) { lat += la; lng += ln; }
  return [lat / n, lng / n];
}

// Haversine distance in km
function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

const typeStyle: Record<Zone["type"], string> = {
  restricted: "bg-destructive/10 text-destructive border-destructive/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  "no-spray": "bg-primary/10 text-primary border-primary/30",
};

export function NearbyRestrictedZones() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [alt, setAlt] = useState("");
  const [submitted, setSubmitted] = useState<{ lat: number; lng: number; alt: number } | null>(null);

  const results = useMemo(() => {
    if (!submitted) return [];
    const here: [number, number] = [submitted.lat, submitted.lng];
    return ALL_ZONES
      .map((z) => ({ zone: z, distanceKm: haversineKm(here, centroid(z.coords)) }))
      .filter((r) => r.distanceKm <= 3)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [submitted]);

  const onCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const la = parseFloat(lat), ln = parseFloat(lng), al = parseFloat(alt || "0");
    if (Number.isFinite(la) && Number.isFinite(ln)) setSubmitted({ lat: la, lng: ln, alt: al });
  };

  return (
    <Card className="card-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-heading flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-warning" /> Nearby Restricted Areas (3 km)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onCheck} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3">
          <div>
            <Label htmlFor="nz-lat" className="text-xs">Latitude</Label>
            <Input id="nz-lat" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="e.g. 31.10" />
          </div>
          <div>
            <Label htmlFor="nz-lng" className="text-xs">Longitude</Label>
            <Input id="nz-lng" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="e.g. 75.40" />
          </div>
          <div>
            <Label htmlFor="nz-alt" className="text-xs">Altitude (m)</Label>
            <Input id="nz-alt" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. 45" />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full">Check</Button>
          </div>
        </form>

        {submitted && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Checking near <span className="font-mono">{submitted.lat.toFixed(4)}, {submitted.lng.toFixed(4)}</span>
              {submitted.alt > 0 && <> at altitude <span className="font-mono">{submitted.alt}m</span></>}
            </p>
            {results.length === 0 ? (
              <div className="rounded-md border border-success/30 bg-success/5 p-3 text-sm text-success">
                ✓ No restricted areas within 3 km — safe to operate.
              </div>
            ) : (
              <ul className="space-y-2">
                {results.map((r) => (
                  <li key={r.zone.name} className="flex items-start justify-between gap-2 rounded-md border border-border p-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium truncate">{r.zone.name}</span>
                      </div>
                      <Badge variant="outline" className={`mt-1 text-[10px] ${typeStyle[r.zone.type]}`}>
                        {r.zone.type}
                      </Badge>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground shrink-0">
                      {r.distanceKm.toFixed(2)} km
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
