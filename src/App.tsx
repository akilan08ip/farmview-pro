import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import MissionPlanningPage from "./pages/MissionPlanning";
import LiveMonitoringPage from "./pages/LiveMonitoring";
import SafetyZonesPage from "./pages/SafetyZones";
import MissionLogsPage from "./pages/MissionLogs";
import ReportsPage from "./pages/Reports";
import BookingsPage from "./pages/Bookings";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout><DashboardPage /></DashboardLayout>} />
          <Route path="/missions/new" element={<DashboardLayout><MissionPlanningPage /></DashboardLayout>} />
          <Route path="/monitoring" element={<DashboardLayout><LiveMonitoringPage /></DashboardLayout>} />
          <Route path="/safety-zones" element={<DashboardLayout><SafetyZonesPage /></DashboardLayout>} />
          <Route path="/logs" element={<DashboardLayout><MissionLogsPage /></DashboardLayout>} />
          <Route path="/reports" element={<DashboardLayout><ReportsPage /></DashboardLayout>} />
          <Route path="/bookings" element={<DashboardLayout><BookingsPage /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
