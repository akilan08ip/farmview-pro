import { useMemo } from "react";
import { Battery, Gauge, Navigation, Satellite, Clock, Signal, Pause } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TelemetryCard } from "@/components/TelemetryCard";
import { MissionStatusBadge } from "@/components/MissionStatusBadge";
import { AlertCard } from "@/components/AlertCard";
import { DroneMap } from "@/components/DroneMap";
import { TelemetryHistoryChart } from "@/components/Charts";
import { PageHeader } from "@/components/PageHeader";
import { missions, alerts, telemetry } from "@/data/mock";

export default function LiveMonitoringPage() {
  const activeMission = useMemo(() => missions.find((m) => m.status === "Active") || missions[0], []);
  const batteryStatus = telemetry.battery < 30 ? "critical" : telemetry.battery < 50 ? "warning" : "normal";

  return (
    <div>
      <PageHeader title="Live Monitoring" description={`Tracking: ${activeMission.name}`}>
        <MissionStatusBadge status={activeMission.status} />
        <Button variant="destructive" size="sm">
          <Pause className="h-4 w-4 mr-1" /> Emergency Pause
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <DroneMap className="h-72 sm:h-96" showRoutes showSafetyZones showDrone />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <TelemetryCard label="Battery" value={telemetry.battery} unit="%" icon={Battery} status={telemetry.battery < 30 ? "critical" : telemetry.battery < 50 ? "warning" : "normal"} />
            <TelemetryCard label="Altitude" value={telemetry.altitude} unit="m" icon={Gauge} />
            <TelemetryCard label="Speed" value={telemetry.speed} unit="m/s" icon={Navigation} />
            <TelemetryCard label="GPS" value={telemetry.gpsStatus} icon={Satellite} />
            <TelemetryCard label="Mission Time" value={telemetry.missionTime} icon={Clock} />
            <TelemetryCard label="Signal" value={telemetry.signalStrength} unit="%" icon={Signal} />
          </div>

          <TelemetryHistoryChart />
        </div>

        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Alert Stream</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
