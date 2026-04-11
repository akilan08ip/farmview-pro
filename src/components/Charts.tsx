import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const missionsByDay = [
  { day: "Mon", missions: 3, alerts: 1 },
  { day: "Tue", missions: 5, alerts: 2 },
  { day: "Wed", missions: 4, alerts: 0 },
  { day: "Thu", missions: 6, alerts: 3 },
  { day: "Fri", missions: 2, alerts: 1 },
  { day: "Sat", missions: 7, alerts: 2 },
  { day: "Sun", missions: 4, alerts: 1 },
];

const batteryHistory = [
  { time: "08:00", alpha: 100, skyMapper: 95, cropWatch: 100 },
  { time: "09:00", alpha: 88, skyMapper: 80, cropWatch: 97 },
  { time: "10:00", alpha: 78, skyMapper: 65, cropWatch: 92 },
  { time: "11:00", alpha: 65, skyMapper: 45, cropWatch: 88 },
  { time: "12:00", alpha: 55, skyMapper: 30, cropWatch: 85 },
  { time: "13:00", alpha: 42, skyMapper: 95, cropWatch: 80 },
];

const alertsByType = [
  { name: "Low Battery", value: 8, color: "hsl(38, 92%, 50%)" },
  { name: "Zone Entry", value: 3, color: "hsl(0, 72%, 51%)" },
  { name: "Route Deviation", value: 5, color: "hsl(200, 70%, 50%)" },
  { name: "GPS Weak", value: 4, color: "hsl(152, 55%, 33%)" },
];

const missionTypes = [
  { name: "Spraying", value: 12, color: "hsl(152, 55%, 33%)" },
  { name: "Mapping", value: 8, color: "hsl(200, 70%, 50%)" },
  { name: "Monitoring", value: 6, color: "hsl(38, 92%, 50%)" },
];

export function MissionsChart() {
  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading">Missions This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={missionsByDay} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="missions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Missions" />
            <Bar dataKey="alerts" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} name="Alerts" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function BatteryChart() {
  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading">Battery Levels Today</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={batteryHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend />
            <Area type="monotone" dataKey="alpha" stroke="hsl(152, 55%, 33%)" fill="hsl(152, 55%, 33%)" fillOpacity={0.15} name="AgriHawk Alpha" />
            <Area type="monotone" dataKey="skyMapper" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.15} name="SkyMapper Pro" />
            <Area type="monotone" dataKey="cropWatch" stroke="hsl(200, 70%, 50%)" fill="hsl(200, 70%, 50%)" fillOpacity={0.15} name="CropWatch Mini" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function AlertsPieChart() {
  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading">Alerts by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={alertsByType} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: "hsl(var(--muted-foreground))" }} style={{ fontSize: 11 }}>
              {alertsByType.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function MissionTypesChart() {
  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading">Missions by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={missionTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: "hsl(var(--muted-foreground))" }} style={{ fontSize: 11 }}>
              {missionTypes.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Telemetry history for Live Monitoring
const telemetryHistory = [
  { time: "00:00", battery: 100, altitude: 0, speed: 0 },
  { time: "05:00", battery: 95, altitude: 30, speed: 5.2 },
  { time: "10:00", battery: 90, altitude: 45, speed: 8.1 },
  { time: "15:00", battery: 85, altitude: 42, speed: 7.5 },
  { time: "20:00", battery: 82, altitude: 48, speed: 9.0 },
  { time: "25:00", battery: 80, altitude: 44, speed: 8.3 },
  { time: "30:00", battery: 78, altitude: 45, speed: 8.2 },
];

export function TelemetryHistoryChart() {
  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading">Telemetry History</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={telemetryHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend />
            <Area type="monotone" dataKey="battery" stroke="hsl(152, 55%, 33%)" fill="hsl(152, 55%, 33%)" fillOpacity={0.1} name="Battery %" />
            <Area type="monotone" dataKey="altitude" stroke="hsl(200, 70%, 50%)" fill="hsl(200, 70%, 50%)" fillOpacity={0.1} name="Altitude (m)" />
            <Area type="monotone" dataKey="speed" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.1} name="Speed (m/s)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
