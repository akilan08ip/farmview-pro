import { Download, FileText, BarChart3, Shield, Navigation, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { AlertsPieChart, MissionTypesChart, BatteryChart, MissionsChart, MonthlyRevenueChart, DroneIncomeChart } from "@/components/Charts";
import { DroneIncomeTable } from "@/components/DroneIncomeTable";
import { missions, alerts } from "@/data/mock";
import { toast } from "sonner";

export default function ReportsPage() {
  const completedMissions = missions.filter((m) => m.status === "Completed").length;
  const safetyViolations = alerts.filter((a) => a.type === "Restricted Zone Entry").length;
  const routeDeviations = alerts.filter((a) => a.type === "Route Deviation").length;

  const handleCSV = () => {
    toast.success("CSV report downloaded!");
  };

  return (
    <div>
      <PageHeader title="Reports" description="Mission performance and safety analytics">
        <Button variant="outline" onClick={handleCSV}><Download className="h-4 w-4 mr-1" />Download CSV</Button>
        <Button variant="outline" disabled><FileText className="h-4 w-4 mr-1" />Download PDF</Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Revenue (YTD)" value="$246K" icon={DollarSign} variant="success" />
        <StatCard title="Missions Completed" value={completedMissions} icon={BarChart3} />
        <StatCard title="Safety Violations" value={safetyViolations} icon={Shield} variant="destructive" />
        <StatCard title="Route Deviations" value={routeDeviations} icon={Navigation} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MonthlyRevenueChart />
        <DroneIncomeChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MissionsChart />
        <BatteryChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AlertsPieChart />
        <MissionTypesChart />
      </div>

      <div className="mb-6">
        <DroneIncomeTable />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-base font-heading">Mission Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missions.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.field} · {m.duration}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${m.totalAlerts === 0 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                    {m.totalAlerts} alerts
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-base font-heading">Battery Usage by Drone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "AgriHawk Alpha", usage: 72, color: "bg-primary" },
                { name: "SkyMapper Pro", usage: 55, color: "bg-warning" },
                { name: "CropWatch Mini", usage: 8, color: "bg-success" },
              ].map((d) => (
                <div key={d.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{d.name}</span>
                    <span className="text-muted-foreground">{d.usage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.usage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
