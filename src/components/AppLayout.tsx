import { useState, createContext, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LayoutDashboard, Plane, Radio, Shield, ClipboardList, BarChart3, Settings, ChevronLeft, ChevronRight, Sprout, LogOut, Menu, CalendarClock, Users, UserCog, Eye
} from "lucide-react";
import { useRole, type Role } from "@/hooks/use-role";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

type Access = "full" | "limited" | "none";

const navItems: { title: string; path: string; icon: any; access: Record<Role, Access> }[] = [
  { title: "Dashboard",        path: "/dashboard",    icon: LayoutDashboard, access: { admin: "full",    operator: "full",    viewer: "full" } },
  { title: "Mission Planning", path: "/missions/new", icon: Plane,           access: { admin: "full",    operator: "full",    viewer: "none" } },
  { title: "Live Monitoring",  path: "/monitoring",   icon: Radio,           access: { admin: "full",    operator: "limited", viewer: "limited" } },
  { title: "Safety Zones",     path: "/safety-zones", icon: Shield,          access: { admin: "full",    operator: "limited", viewer: "limited" } },
  { title: "Bookings",         path: "/bookings",     icon: CalendarClock,   access: { admin: "full",    operator: "limited", viewer: "limited" } },
  { title: "Mission Logs",     path: "/logs",         icon: ClipboardList,   access: { admin: "full",    operator: "limited", viewer: "limited" } },
  { title: "Reports",          path: "/reports",      icon: BarChart3,       access: { admin: "full",    operator: "limited", viewer: "limited" } },
  { title: "Role Access",      path: "/roles",        icon: Users,           access: { admin: "full",    operator: "limited", viewer: "limited" } },
  { title: "Settings",         path: "/settings",     icon: Settings,        access: { admin: "full",    operator: "limited", viewer: "none" } },
];

const roleMeta: Record<Role, { label: string; icon: any }> = {
  admin:    { label: "Admin",          icon: Shield },
  operator: { label: "Drone Operator", icon: UserCog },
  viewer:   { label: "Viewer",         icon: Eye },
};

const SidebarContext = createContext({ collapsed: false, toggle: () => {} });
export const useSidebarState = () => useContext(SidebarContext);

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useRole();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (signingOut) return;
    setSigningOut(true);
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch (err: any) {
      // Continue with local cleanup even if remote signOut fails
      console.warn("signOut error", err);
    }
    try {
      // Clear any lingering supabase auth tokens + app state
      Object.keys(localStorage)
        .filter((k) => k.startsWith("sb-") || k === "farmdrone.role")
        .forEach((k) => localStorage.removeItem(k));
      sessionStorage.clear();
    } catch {}
    toast.success("Signed out");
    navigate("/", { replace: true });
  };

  const visibleItems = navItems.filter((i) => i.access[role] !== "none");
  const RoleIcon = roleMeta[role].icon;

  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed(!collapsed) }}>
      <div className="min-h-screen flex bg-background">
        {mobileOpen && (
          <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}

        <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <Sprout className="h-7 w-7 text-sidebar-primary shrink-0" />
            {!collapsed && <span className="ml-3 font-heading font-bold text-lg truncate">FarmDrone</span>}
          </div>

          {!collapsed && (
            <div className="px-3 py-2 border-b border-sidebar-border">
              <div className="flex items-center gap-2 text-xs text-sidebar-foreground/70">
                <RoleIcon className="h-3.5 w-3.5" />
                <span>Signed in as</span>
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">{roleMeta[role].label}</Badge>
              </div>
            </div>
          )}

          <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
            {visibleItems.map((item) => {
              const active = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
              const limited = item.access[role] === "limited";
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"}`}
                  title={limited ? `${item.title} (limited access)` : item.title}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && (
                    <span className="truncate flex-1">{item.title}</span>
                  )}
                  {!collapsed && limited && (
                    <span className="text-[9px] uppercase tracking-wide text-amber-500/90 font-semibold">Ltd</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex border-t border-sidebar-border p-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center py-2 rounded-md hover:bg-sidebar-accent/60 transition-colors"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          <div className="border-t border-sidebar-border p-2">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors disabled:opacity-60"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{signingOut ? "Signing out…" : "Sign Out"}</span>}
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-card flex items-center px-4 lg:px-6 sticky top-0 z-30">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden mr-3 p-1.5 rounded-md hover:bg-accent">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:bg-accent text-sm">
                  <RoleIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{roleMeta[role].label}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Switch role (demo)</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(Object.keys(roleMeta) as Role[]).map((r) => {
                    const Icon = roleMeta[r].icon;
                    return (
                      <DropdownMenuItem key={r} onClick={() => setRole(r)}>
                        <Icon className="h-4 w-4 mr-2" />
                        {roleMeta[r].label}
                        {role === r && <span className="ml-auto text-xs text-primary">Active</span>}
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} disabled={signingOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {signingOut ? "Signing out…" : "Sign Out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold">
                JM
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
