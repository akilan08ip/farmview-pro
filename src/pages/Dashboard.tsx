import { Plane, Wifi, AlertTriangle, Battery, Plus, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MissionStatusBadge } from "@/components/MissionStatusBadge";
import { AlertCard } from "@/components/AlertCard";
import { PageHeader } from "@/components/PageHeader";
import { missions, drones, alerts } from "@/data/mock";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const activeMissions = missions.filter((m) => m.status === "Active" || m.status === "Suspicious" || m.status === "Dangerous").length;
  const dronesOnline = drones.filter((d) => d.status !== "offline").length;
  const safetyAlerts = alerts.filter((a) => !a.resolved).length;
  const avgBattery = Math.round(drones.reduce((s, d) => s + d.battery, 0) / drones.length);

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your drone operations" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Missions" value={activeMissions} icon={Plane} variant="success" trend="+1 from yesterday" />
        <StatCard title="Drones Online" value={`${dronesOnline}/${drones.length}`} icon={Wifi} variant="default" />
        <StatCard title="Safety Alerts" value={safetyAlerts} icon={AlertTriangle} variant={safetyAlerts > 0 ? "warning" : "default"} />
        <StatCard title="Avg Battery" value={`${avgBattery}%`} icon={Battery} variant={avgBattery < 30 ? "destructive" : "default"} />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button asChild><Link to="/missions/new"><Plus className="h-4 w-4 mr-1" />Create Mission</Link></Button>
        <Button variant="outline" asChild><Link to="/safety-zones"><Shield className="h-4 w-4 mr-1" />Add Safety Zone</Link></Button>
        <Button variant="outline" asChild><Link to="/reports"><BarChart3 className="h-4 w-4 mr-1" />View Reports</Link></Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Missions */}
        <Card className="lg:col-span-2 card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Recent Missions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 font-medium">Mission</th>
                    <th className="text-left py-2 font-medium hidden sm:table-cell">Drone</th>
                    <th className="text-left py-2 font-medium hidden md:table-cell">Operator</th>
                    <th className="text-left py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {missions.slice(0, 5).map((m) => (
                    <tr key={m.id} className="border-b last:border-0">
                      <td className="py-3">
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.id}</p>
                      </td>
                      <td className="py-3 hidden sm:table-cell text-muted-foreground">{m.droneName}</td>
                      <td className="py-3 hidden md:table-cell text-muted-foreground">{m.operator}</td>
                      <td className="py-3"><MissionStatusBadge status={m.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.filter((a) => !a.resolved).map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
            {alerts.filter((a) => !a.resolved).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No active alerts</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
