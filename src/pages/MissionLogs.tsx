import { useState } from "react";
import { Search, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { MissionStatusBadge } from "@/components/MissionStatusBadge";
import { missions } from "@/data/mock";
import type { MissionStatus } from "@/data/mock";
import { toast } from "sonner";

export default function MissionLogsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = missions.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.operator.toLowerCase().includes(search.toLowerCase()) || m.droneName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const exportCSV = () => {
    const headers = "Mission ID,Drone,Operator,Field,Start Time,End Time,Status,Alerts\n";
    const rows = filtered.map((m) => `${m.id},${m.droneName},${m.operator},${m.field},${m.plannedStart},${m.endTime || "—"},${m.status},${m.totalAlerts}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "mission-logs.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  return (
    <div>
      <PageHeader title="Mission Logs" description="View and export mission history">
        <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-1" />Export CSV</Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search missions, drones, operators..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Planned">Planned</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Suspicious">Suspicious</SelectItem>
            <SelectItem value="Dangerous">Dangerous</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="card-shadow">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left p-4 font-medium">Mission ID</th>
                  <th className="text-left p-4 font-medium">Drone</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">Operator</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Field</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Start</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Alerts</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4 font-medium">{m.id}</td>
                    <td className="p-4 text-muted-foreground">{m.droneName}</td>
                    <td className="p-4 hidden sm:table-cell text-muted-foreground">{m.operator}</td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground">{m.field}</td>
                    <td className="p-4 hidden lg:table-cell text-muted-foreground text-xs">{new Date(m.plannedStart).toLocaleString()}</td>
                    <td className="p-4"><MissionStatusBadge status={m.status} /></td>
                    <td className="p-4">
                      <span className={m.totalAlerts > 0 ? "text-warning font-medium" : "text-muted-foreground"}>{m.totalAlerts}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No missions found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
