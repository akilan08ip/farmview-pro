import { Shield, UserCog, Eye, Check, X, CircleDot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/PageHeader";

type Access = "full" | "limited" | "none";

interface PagePerm {
  page: string;
  admin: Access;
  operator: Access;
  viewer: Access;
  admin_note?: string;
  operator_note?: string;
  viewer_note?: string;
}

const matrix: PagePerm[] = [
  {
    page: "Dashboard",
    admin: "full", operator: "full", viewer: "full",
    admin_note: "All KPIs & org-wide stats",
    operator_note: "Own fleet KPIs",
    viewer_note: "Read-only overview",
  },
  {
    page: "Mission Planning",
    admin: "full", operator: "full", viewer: "none",
    admin_note: "Create / approve / assign",
    operator_note: "Create & submit own missions",
    viewer_note: "No access",
  },
  {
    page: "Live Monitoring",
    admin: "full", operator: "limited", viewer: "limited",
    admin_note: "Control all drones, override",
    operator_note: "Control assigned drones only",
    viewer_note: "Watch live telemetry, no controls",
  },
  {
    page: "Safety Zones",
    admin: "full", operator: "limited", viewer: "limited",
    admin_note: "Add / edit / disable zones",
    operator_note: "View zones, propose changes",
    viewer_note: "View only",
  },
  {
    page: "Bookings",
    admin: "full", operator: "limited", viewer: "limited",
    admin_note: "Approve, reschedule, cancel any",
    operator_note: "Manage own bookings",
    viewer_note: "View calendar",
  },
  {
    page: "Mission Logs",
    admin: "full", operator: "limited", viewer: "limited",
    admin_note: "All historical logs + export",
    operator_note: "Own mission logs",
    viewer_note: "Read-only access",
  },
  {
    page: "Reports & Analytics",
    admin: "full", operator: "limited", viewer: "limited",
    admin_note: "Generate / export all reports",
    operator_note: "Own performance reports",
    viewer_note: "View shared reports",
  },
  {
    page: "Settings",
    admin: "full", operator: "limited", viewer: "none",
    admin_note: "Org, users, roles, billing",
    operator_note: "Profile & preferences",
    viewer_note: "No access",
  },
  {
    page: "Role Access",
    admin: "full", operator: "limited", viewer: "limited",
    admin_note: "Manage role assignments",
    operator_note: "View matrix",
    viewer_note: "View matrix",
  },
];

const roleMeta = {
  admin: { label: "Admin", icon: Shield, color: "text-primary", bg: "bg-primary/10" },
  operator: { label: "Drone Operator", icon: UserCog, color: "text-blue-600", bg: "bg-blue-500/10" },
  viewer: { label: "Viewer", icon: Eye, color: "text-slate-600", bg: "bg-slate-500/10" },
};

function AccessCell({ level, note }: { level: Access; note?: string }) {
  if (level === "full") {
    return (
      <div className="flex items-start gap-2">
        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <div>
          <div className="text-xs font-semibold text-primary">Full</div>
          {note && <div className="text-xs text-muted-foreground">{note}</div>}
        </div>
      </div>
    );
  }
  if (level === "limited") {
    return (
      <div className="flex items-start gap-2">
        <CircleDot className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <div className="text-xs font-semibold text-amber-700">Limited</div>
          {note && <div className="text-xs text-muted-foreground">{note}</div>}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2">
      <X className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
      <div>
        <div className="text-xs font-semibold text-destructive">No access</div>
        {note && <div className="text-xs text-muted-foreground">{note}</div>}
      </div>
    </div>
  );
}

export default function RoleAccessPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Role Access"
        description="What each role can do across the FarmDrone dashboard"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(roleMeta) as Array<keyof typeof roleMeta>).map((k) => {
          const r = roleMeta[k];
          const Icon = r.icon;
          const count = matrix.filter((m) => m[k] === "full").length;
          return (
            <Card key={k}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${r.bg}`}>
                    <Icon className={`h-5 w-5 ${r.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{r.label}</CardTitle>
                    <CardDescription className="text-xs">
                      {count} of {matrix.length} pages with full access
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-xs">
                    <Check className="h-3 w-3 mr-1" /> {matrix.filter((m) => m[k] === "full").length} Full
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <CircleDot className="h-3 w-3 mr-1" /> {matrix.filter((m) => m[k] === "limited").length} Limited
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <X className="h-3 w-3 mr-1" /> {matrix.filter((m) => m[k] === "none").length} None
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Permission Matrix</CardTitle>
          <CardDescription>Page-by-page breakdown of what each role can access</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Page</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Admin</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1.5"><UserCog className="h-4 w-4 text-blue-600" /> Drone Operator</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1.5"><Eye className="h-4 w-4 text-slate-600" /> Viewer</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matrix.map((row) => (
                  <TableRow key={row.page}>
                    <TableCell className="font-medium">{row.page}</TableCell>
                    <TableCell><AccessCell level={row.admin} note={row.admin_note} /></TableCell>
                    <TableCell><AccessCell level={row.operator} note={row.operator_note} /></TableCell>
                    <TableCell><AccessCell level={row.viewer} note={row.viewer_note} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <div className="font-semibold">Full access</div>
              <div className="text-muted-foreground text-xs">Can view, create, edit, and delete all records on this page.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CircleDot className="h-4 w-4 text-amber-600 mt-0.5" />
            <div>
              <div className="font-semibold">Limited access</div>
              <div className="text-muted-foreground text-xs">Can only act on own records or has read-only access to some fields.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <X className="h-4 w-4 text-destructive mt-0.5" />
            <div>
              <div className="font-semibold">No access</div>
              <div className="text-muted-foreground text-xs">Page is hidden from navigation and direct URL access is blocked.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
