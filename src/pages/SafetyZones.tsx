import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/PageHeader";
import { ZoneBadge } from "@/components/ZoneBadge";
import { DroneMap } from "@/components/DroneMap";
import { safetyZones } from "@/data/mock";
import type { ZoneType } from "@/data/mock";
import { toast } from "sonner";

export default function SafetyZonesPage() {
  const [open, setOpen] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Safety zone added!");
    setOpen(false);
  };

  return (
    <div>
      <PageHeader title="Safety Zones" description="Manage restricted and warning zones">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Add Zone</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Safety Zone</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Zone Name</label>
                  <Input placeholder="e.g. River Buffer Zone" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Zone Type</label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restricted">Restricted</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="no-spray">No-Spray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Field Name</label>
                  <Input placeholder="e.g. North Wheat Field" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Coordinates / Polygon</label>
                  <Input placeholder="Paste coordinates or draw on map" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Description</label>
                  <Textarea placeholder="Zone description..." rows={2} />
                </div>
                <Button type="submit" className="w-full">Save Zone</Button>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Map Preview (India)</label>
                <DroneMap className="h-72 md:h-[420px]" showRoutes={false} showDrone={false} showSafetyZones region="india" />
                <p className="text-xs text-muted-foreground mt-2">Existing India safety zones shown for reference. Drawing tools coming soon.</p>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Map showing India safety zones */}
      <div className="mb-6">
        <DroneMap className="h-64 sm:h-96" showRoutes={false} showDrone={false} showSafetyZones region="india" />
      </div>

      <Card className="card-shadow">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left p-4 font-medium">Zone Name</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">Field</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Description</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {safetyZones.map((zone) => (
                  <tr key={zone.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4 font-medium">{zone.name}</td>
                    <td className="p-4"><ZoneBadge type={zone.type as ZoneType} /></td>
                    <td className="p-4 hidden sm:table-cell text-muted-foreground">{zone.field}</td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground text-xs max-w-xs truncate">{zone.description}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${zone.active ? "text-success" : "text-muted-foreground"}`}>
                        <span className={`h-2 w-2 rounded-full ${zone.active ? "bg-success" : "bg-muted-foreground"}`} />
                        {zone.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
