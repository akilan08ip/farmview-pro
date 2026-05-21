export type MissionStatus = "Planned" | "Active" | "Completed" | "Suspicious" | "Dangerous";
export type MissionType = "spraying" | "mapping" | "monitoring";
export type AlertType = "Low Battery" | "Restricted Zone Entry" | "Route Deviation" | "GPS Signal Weak" | "Emergency Pause Activated";
export type AlertSeverity = "info" | "warning" | "critical";
export type ZoneType = "restricted" | "warning" | "no-spray";
export type UserRole = "Admin" | "Drone Operator" | "Viewer";

export interface Mission {
  id: string;
  name: string;
  droneId: string;
  droneName: string;
  operator: string;
  field: string;
  type: MissionType;
  status: MissionStatus;
  plannedStart: string;
  actualStart?: string;
  endTime?: string;
  duration: string;
  sprayArea: string;
  totalAlerts: number;
  notes: string;
}

export interface Drone {
  id: string;
  name: string;
  model: string;
  battery: number;
  status: "online" | "offline" | "in-mission";
  lastSeen: string;
  position: [number, number]; // [lat, lng]
  altitude: number; // meters
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  missionId: string;
  droneName: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface SafetyZone {
  id: string;
  name: string;
  type: ZoneType;
  field: string;
  description: string;
  coordinates: string;
  active: boolean;
}

export const missions: Mission[] = [
  { id: "MSN-001", name: "North Field Spray", droneId: "DRN-01", droneName: "AgriHawk Alpha", operator: "John Miller", field: "North Wheat Field", type: "spraying", status: "Active", plannedStart: "2026-04-11T08:00:00", actualStart: "2026-04-11T08:05:00", duration: "45 min", sprayArea: "12 hectares", totalAlerts: 1, notes: "Morning spray session" },
  { id: "MSN-002", name: "South Mapping Run", droneId: "DRN-02", droneName: "SkyMapper Pro", operator: "Sarah Chen", field: "South Corn Field", type: "mapping", status: "Completed", plannedStart: "2026-04-10T14:00:00", actualStart: "2026-04-10T14:02:00", endTime: "2026-04-10T15:30:00", duration: "88 min", sprayArea: "—", totalAlerts: 0, notes: "NDVI mapping complete" },
  { id: "MSN-003", name: "Orchard Monitor", droneId: "DRN-03", droneName: "CropWatch Mini", operator: "James Lee", field: "Apple Orchard East", type: "monitoring", status: "Planned", plannedStart: "2026-04-12T06:00:00", duration: "30 min", sprayArea: "—", totalAlerts: 0, notes: "Disease check flight" },
  { id: "MSN-004", name: "Vineyard Spray", droneId: "DRN-01", droneName: "AgriHawk Alpha", operator: "John Miller", field: "Vineyard Block A", type: "spraying", status: "Suspicious", plannedStart: "2026-04-11T10:00:00", actualStart: "2026-04-11T10:03:00", duration: "60 min", sprayArea: "8 hectares", totalAlerts: 3, notes: "Route deviation detected" },
  { id: "MSN-005", name: "River Field Check", droneId: "DRN-02", droneName: "SkyMapper Pro", operator: "Sarah Chen", field: "River Barley Field", type: "monitoring", status: "Dangerous", plannedStart: "2026-04-11T07:00:00", actualStart: "2026-04-11T07:01:00", duration: "25 min", sprayArea: "—", totalAlerts: 2, notes: "Entered restricted zone near river" },
];

export const drones: Drone[] = [
  { id: "DRN-01", name: "AgriHawk Alpha", model: "DJI Agras T40", battery: 78, status: "in-mission", lastSeen: "2026-04-11T10:30:00", position: [31.1471, 75.3412], altitude: 45 },
  { id: "DRN-02", name: "SkyMapper Pro", model: "DJI Matrice 350", battery: 45, status: "in-mission", lastSeen: "2026-04-11T10:28:00", position: [19.9975, 73.7898], altitude: 62 },
  { id: "DRN-03", name: "CropWatch Mini", model: "DJI Mini 4 Pro", battery: 92, status: "online", lastSeen: "2026-04-11T10:25:00", position: [12.9141, 75.7397], altitude: 0 },
];

export const alerts: Alert[] = [
  { id: "ALT-001", type: "Low Battery", severity: "warning", missionId: "MSN-002", droneName: "SkyMapper Pro", message: "Battery below 20% — return to base recommended", timestamp: "2026-04-11T10:12:00", resolved: false },
  { id: "ALT-002", type: "Restricted Zone Entry", severity: "critical", missionId: "MSN-005", droneName: "SkyMapper Pro", message: "Drone entered restricted zone near river boundary", timestamp: "2026-04-11T07:18:00", resolved: false },
  { id: "ALT-003", type: "Route Deviation", severity: "warning", missionId: "MSN-004", droneName: "AgriHawk Alpha", message: "Drone deviated 120m from planned route", timestamp: "2026-04-11T10:22:00", resolved: false },
  { id: "ALT-004", type: "GPS Signal Weak", severity: "info", missionId: "MSN-001", droneName: "AgriHawk Alpha", message: "GPS signal degraded to 2 satellites", timestamp: "2026-04-11T08:45:00", resolved: true },
];

export const safetyZones: SafetyZone[] = [
  { id: "SZ-001", name: "River Buffer Zone", type: "restricted", field: "River Barley Field", description: "50m buffer from river bank — no fly zone", coordinates: "42.3601° N, 71.0589° W", active: true },
  { id: "SZ-002", name: "Residential Area", type: "restricted", field: "North Wheat Field", description: "200m buffer around residential buildings", coordinates: "42.3611° N, 71.0601° W", active: true },
  { id: "SZ-003", name: "Organic Section", type: "no-spray", field: "South Corn Field", description: "Certified organic section — no chemical spraying", coordinates: "42.3580° N, 71.0550° W", active: true },
];

export const telemetry = {
  battery: 78,
  altitude: 45,
  speed: 8.2,
  gpsStatus: "Strong" as const,
  missionTime: "00:32:15",
  signalStrength: 94,
};
