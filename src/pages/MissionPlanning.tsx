import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { toast } from "sonner";

export default function MissionPlanningPage() {
  const [missionType, setMissionType] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mission saved successfully!");
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
                  <Input type="number" step="0.0001" placeholder="e.g. 31.1471" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Longitude</label>
                  <Input type="number" step="0.0001" placeholder="e.g. 75.3412" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Altitude (m)</label>
                  <Input type="number" step="1" placeholder="e.g. 45" />
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
              <CardTitle className="text-base font-heading">Route Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <MapPlaceholder className="h-80" />
              <p className="text-xs text-muted-foreground mt-3">Draw the flight path on the map. Connect a mapping service to enable route planning.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
