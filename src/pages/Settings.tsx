import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = (checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" description="Manage your profile and preferences" />

      <div className="space-y-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-base font-heading">User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xl font-bold">JM</div>
              <div>
                <p className="font-medium">John Miller</p>
                <p className="text-sm text-muted-foreground">john@farmops.com</p>
                <Badge variant="outline" className="mt-1">Admin</Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                <Input defaultValue="John Miller" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <Input defaultValue="john@farmops.com" />
              </div>
            </div>
            <Button size="sm" onClick={() => toast.success("Profile updated!")}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-base font-heading">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Safety zone violations", defaultChecked: true },
              { label: "Low battery warnings", defaultChecked: true },
              { label: "Mission status changes", defaultChecked: true },
              { label: "Route deviations", defaultChecked: false },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between">
                <span className="text-sm">{pref.label}</span>
                <Switch defaultChecked={pref.defaultChecked} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-base font-heading">Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Dark Mode</span>
              <Switch checked={darkMode} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
