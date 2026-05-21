import { useMemo, useState } from "react";
import { Battery, Gauge, Navigation, Satellite, Clock, Signal, Pause, Plane } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TelemetryCard } from "@/components/TelemetryCard";
import { MissionStatusBadge } from "@/components/MissionStatusBadge";
import { AlertCard } from "@/components/AlertCard";
import { DroneMap } from "@/components/DroneMap";
import { TelemetryHistoryChart } from "@/components/Charts";
import { PageHeader } from "@/components/PageHeader";
import { NearbyRestrictedZones } from "@/components/NearbyRestrictedZones";
import { missions, alerts, drones, telemetry } from "@/data/mock";

// Per-drone live telemetry (synthesized around shared baseline)
function telemetryFor(droneId: string) {
  const base = telemetry;
  switch (droneId) {
    case "DRN-01":
      return { ...base, battery: 78, altitude: 45, speed: 8.2, gpsStatus: "Strong", missionTime: "00:32:15", signalStrength: 94 };
    case "DRN-02":
      return { ...base, battery: 45, altitude: 62, speed: 9.5, gpsStatus: "Strong", missionTime: "01:14:02", signalStrength: 81 };
    case "DRN-03":
      return { ...base, battery: 92, altitude: 0, speed: 0, gpsStatus: "Idle", missionTime: "00:00:00", signalStrength: 99 };
    default:
      return base;
  }
}

export default function LiveMonitoringPage() {
  const [selectedDroneId, setSelectedDroneId] = useState<string>(drones[0].id);

  const selectedDrone = useMemo(() => drones.find((d) => d.id === selectedDroneId)!, [selectedDroneId]);
  const activeMission = useMemo(
    () => missions.find((m) => m.droneId === selectedDroneId && m.status === "Active")
      || missions.find((m) => m.droneId === selectedDroneId)
      || missions[0],
    [selectedDroneId]
  );
  const droneAlerts = useMemo(
    () => alerts.filter((a) => a.droneName === selectedDrone.name),
    [selectedDrone.name]
  );
  const t = useMemo(() => telemetryFor(selectedDroneId), [selectedDroneId]);
  const batteryStatus = t.battery < 30 ? "critical" : t.battery < 50 ? "warning" : "normal";

  return (
    <div>
      <PageHeader title="Live Monitoring" description={`Tracking: ${selectedDrone.name} · ${activeMission.name}`}>
        <MissionStatusBadge status={activeMission.status} />
        <Button variant="destructive" size="sm">
          <Pause className="h-4 w-4 mr-1" /> Emergency Pause
        </Button>
      </PageHeader>

      {/* Drone selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {drones.map((d) => {
          const active = d.id === selectedDroneId;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDroneId(d.id)}
              className={`text-left rounded-lg border p-3 transition-colors card-shadow ${
                active ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <Plane className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{d.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{d.model} · {d.status}</p>
                </div>
                <span className={`text-xs font-mono ${d.battery < 30 ? "text-destructive" : d.battery < 50 ? "text-warning" : "text-success"}`}>
                  {d.battery}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <DroneMap className="h-72 sm:h-96" showRoutes showSafetyZones showDrone />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <TelemetryCard label="Battery" value={t.battery} unit="%" icon={Battery} status={batteryStatus} />
            <TelemetryCard label="Altitude" value={t.altitude} unit="m" icon={Gauge} />
            <TelemetryCard label="Speed" value={t.speed} unit="m/s" icon={Navigation} />
            <TelemetryCard label="GPS" value={t.gpsStatus} icon={Satellite} />
            <TelemetryCard label="Mission Time" value={t.missionTime} icon={Clock} />
            <TelemetryCard label="Signal" value={t.signalStrength} unit="%" icon={Signal} />
          </div>

          <TelemetryHistoryChart />

          <NearbyRestrictedZones />
        </div>

        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">
              Alert Stream — {selectedDrone.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
            {droneAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No alerts for this drone.</p>
            ) : (
              droneAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
