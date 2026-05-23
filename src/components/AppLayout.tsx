import { useState, createContext, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Plane, Radio, Shield, ClipboardList, BarChart3, Settings, ChevronLeft, ChevronRight, Sprout, LogOut, Menu, X, CalendarClock, Users
} from "lucide-react";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Mission Planning", path: "/missions/new", icon: Plane },
  { title: "Live Monitoring", path: "/monitoring", icon: Radio },
  { title: "Safety Zones", path: "/safety-zones", icon: Shield },
  { title: "Bookings", path: "/bookings", icon: CalendarClock },
  { title: "Mission Logs", path: "/logs", icon: ClipboardList },
  { title: "Reports", path: "/reports", icon: BarChart3 },
  { title: "Role Access", path: "/roles", icon: Users },
  { title: "Settings", path: "/settings", icon: Settings },
];

const SidebarContext = createContext({ collapsed: false, toggle: () => {} });
export const useSidebarState = () => useContext(SidebarContext);

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed(!collapsed) }}>
      <div className="min-h-screen flex bg-background">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <Sprout className="h-7 w-7 text-sidebar-primary shrink-0" />
            {!collapsed && <span className="ml-3 font-heading font-bold text-lg truncate">FarmDrone</span>}
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
            {navItems.map((item) => {
              const active = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"}`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Collapse toggle (desktop) */}
          <div className="hidden lg:flex border-t border-sidebar-border p-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center py-2 rounded-md hover:bg-sidebar-accent/60 transition-colors"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-sidebar-border p-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </Link>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="h-16 border-b border-border bg-card flex items-center px-4 lg:px-6 sticky top-0 z-30">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden mr-3 p-1.5 rounded-md hover:bg-accent">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold">
                JM
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
