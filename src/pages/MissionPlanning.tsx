import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { CoordinatePreviewMap } from "@/components/CoordinatePreviewMap";
import { toast } from "sonner";

const coordSchema = z.object({
  latitude: z
    .number({ invalid_type_error: "Latitude is required" })
    .min(-90, { message: "Latitude must be between -90 and 90" })
    .max(90, { message: "Latitude must be between -90 and 90" }),
  longitude: z
    .number({ invalid_type_error: "Longitude is required" })
    .min(-180, { message: "Longitude must be between -180 and 180" })
    .max(180, { message: "Longitude must be between -180 and 180" }),
  altitude: z
    .number({ invalid_type_error: "Altitude is required" })
    .min(0, { message: "Altitude cannot be negative" })
    .max(500, { message: "Altitude must be 500m or less (regulatory limit)" }),
});

type CoordErrors = Partial<Record<"latitude" | "longitude" | "altitude", string>>;

type Status = "Planned" | "Active";

const STORAGE_KEY = "farmdrone.missions";

export default function MissionPlanningPage() {
  const [name, setName] = useState("");
  const [droneId, setDroneId] = useState("");
  const [operator, setOperator] = useState("");
  const [field, setField] = useState("");
  const [missionType, setMissionType] = useState("");
  const [plannedStart, setPlannedStart] = useState("");
  const [plannedEnd, setPlannedEnd] = useState("");
  const [status, setStatus] = useState<Status>("Planned");
  const [duration, setDuration] = useState("");
  const [sprayArea, setSprayArea] = useState("");
  const [notes, setNotes] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [altitude, setAltitude] = useState("");
  const [errors, setErrors] = useState<CoordErrors>({});

  const droneMap: Record<string, string> = {
    "DRN-01": "AgriHawk Alpha",
    "DRN-02": "SkyMapper Pro",
    "DRN-03": "CropWatch Mini",
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Mission name is required."); return; }
    if (!droneId) { toast.error("Please select a drone."); return; }
    if (!plannedStart) { toast.error("Planned start time is required."); return; }
    if (plannedEnd && new Date(plannedEnd) <= new Date(plannedStart)) {
      toast.error("End time must be after start time.");
      return;
    }
    const parsed = coordSchema.safeParse({
      latitude: latitude === "" ? NaN : Number(latitude),
      longitude: longitude === "" ? NaN : Number(longitude),
      altitude: altitude === "" ? NaN : Number(altitude),
    });
    if (!parsed.success) {
      const next: CoordErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof CoordErrors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please fix the highlighted coordinate errors.");
      return;
    }
    setErrors({});
    const mission = {
      id: `M-${Date.now()}`,
      name,
      droneId,
      droneName: droneMap[droneId] ?? droneId,
      operator,
      field,
      type: missionType,
      status,
      plannedStart,
      plannedEnd,
      duration,
      sprayArea,
      notes,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      altitude: parsed.data.altitude,
      createdAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mission, ...existing]));
    } catch { /* ignore */ }
    toast.success(`Mission "${name}" saved as ${status}.`);
    setName(""); setDroneId(""); setOperator(""); setField(""); setMissionType("");
    setPlannedStart(""); setPlannedEnd(""); setStatus("Planned"); setDuration("");
    setSprayArea(""); setNotes(""); setLatitude(""); setLongitude(""); setAltitude("");
  };

  return (
    <div>
      <PageHeader title="Plan New Mission" description="Create and configure a new drone mission" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-base font-heading">Mission Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Mission Name</label>
                <Input placeholder="e.g. North Field Morning Spray" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Drone</label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select drone" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRN-01">AgriHawk Alpha</SelectItem>
                      <SelectItem value="DRN-02">SkyMapper Pro</SelectItem>
                      <SelectItem value="DRN-03">CropWatch Mini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Operator</label>
                  <Input placeholder="Operator name" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Field Name</label>
                <Input placeholder="e.g. North Wheat Field" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Mission Type</label>
                <Select value={missionType} onValueChange={setMissionType}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spraying">Spraying</SelectItem>
                    <SelectItem value="mapping">Mapping</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Planned Start</label>
                  <Input type="datetime-local" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Expected Duration</label>
                  <Input placeholder="e.g. 45 min" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Planned Spray Area</label>
                <Input placeholder="e.g. 12 hectares" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Latitude</label>
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="e.g. 31.1471"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    aria-invalid={!!errors.latitude}
                    className={errors.latitude ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.latitude && <p className="text-xs text-destructive mt-1">{errors.latitude}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Longitude</label>
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="e.g. 75.3412"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    aria-invalid={!!errors.longitude}
                    className={errors.longitude ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.longitude && <p className="text-xs text-destructive mt-1">{errors.longitude}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Altitude (m)</label>
                  <Input
                    type="number"
                    step="1"
                    placeholder="e.g. 45"
                    value={altitude}
                    onChange={(e) => setAltitude(e.target.value)}
                    aria-invalid={!!errors.altitude}
                    className={errors.altitude ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.altitude && <p className="text-xs text-destructive mt-1">{errors.altitude}</p>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Notes</label>
                <Textarea placeholder="Additional notes..." rows={3} />
              </div>
              <Button type="submit" className="w-full">Save Mission</Button>
            </form>
          </CardContent>
        </Card>

        <div>
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-base font-heading">Coordinate Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <CoordinatePreviewMap latitude={latitude} longitude={longitude} className="h-80" />
              <p className="text-xs text-muted-foreground mt-3">Live preview updates as you type latitude and longitude.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
