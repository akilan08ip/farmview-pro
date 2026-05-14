import { useEffect, useMemo, useState } from "react";
import { Plus, Bell, Calendar as CalendarIcon, Clock, Trash2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/PageHeader";
import { drones } from "@/data/mock";
import { toast } from "sonner";

interface Booking {
  id: string;
  droneId: string;
  droneName: string;
  date: string; // YYYY-MM-DD
  slot: string; // e.g. "08:00 - 10:00"
  field: string;
  operator: string;
  notes?: string;
}

interface Reminder {
  id: string;
  title: string;
  due: string; // ISO datetime
  droneId?: string;
  done: boolean;
}

const SLOTS = [
  "06:00 - 08:00",
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
];

const BOOKINGS_KEY = "fdm.bookings.v1";
const REMINDERS_KEY = "fdm.reminders.v1";

const todayISO = () => new Date().toISOString().slice(0, 10);

const seedBookings = (): Booking[] => [
  { id: "BK-001", droneId: drones[0].id, droneName: drones[0].name, date: todayISO(), slot: "08:00 - 10:00", field: "North Wheat Field", operator: "John Miller", notes: "Morning spray" },
  { id: "BK-002", droneId: drones[1].id, droneName: drones[1].name, date: todayISO(), slot: "10:00 - 12:00", field: "South Corn Field", operator: "Sarah Chen" },
];

const seedReminders = (): Reminder[] => {
  const t = new Date(); t.setHours(t.getHours() + 2);
  const t2 = new Date(); t2.setDate(t2.getDate() + 1);
  return [
    { id: "RM-001", title: "Pre-flight battery check — AgriHawk Alpha", due: t.toISOString(), droneId: drones[0].id, done: false },
    { id: "RM-002", title: "Calibrate sprayer nozzles", due: t2.toISOString(), droneId: drones[0].id, done: false },
  ];
};

function loadLS<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback; }
  catch { return fallback; }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(() => loadLS(BOOKINGS_KEY, seedBookings()));
  const [reminders, setReminders] = useState<Reminder[]>(() => loadLS(REMINDERS_KEY, seedReminders()));
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);

  // form state
  const [bDrone, setBDrone] = useState(drones[0].id);
  const [bDate, setBDate] = useState(todayISO());
  const [bSlot, setBSlot] = useState(SLOTS[0]);
  const [bField, setBField] = useState("");
  const [bOperator, setBOperator] = useState("");
  const [bNotes, setBNotes] = useState("");

  const [rTitle, setRTitle] = useState("");
  const [rDate, setRDate] = useState(todayISO());
  const [rTime, setRTime] = useState("09:00");
  const [rDrone, setRDrone] = useState<string>("none");

  useEffect(() => { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders)); }, [reminders]);

  // Notify when reminders are due
  useEffect(() => {
    const tick = setInterval(() => {
      const now = Date.now();
      reminders.forEach((r) => {
        if (!r.done && new Date(r.due).getTime() <= now && new Date(r.due).getTime() > now - 60_000) {
          toast(`🔔 Reminder: ${r.title}`);
        }
      });
    }, 30_000);
    return () => clearInterval(tick);
  }, [reminders]);

  const bookingsByDrone = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    drones.forEach(d => { map[d.id] = []; });
    bookings.forEach(b => { (map[b.droneId] ||= []).push(b); });
    Object.values(map).forEach(list => list.sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot)));
    return map;
  }, [bookings]);

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const drone = drones.find(d => d.id === bDrone)!;
    const conflict = bookings.find(b => b.droneId === bDrone && b.date === bDate && b.slot === bSlot);
    if (conflict) { toast.error("That slot is already booked for this drone."); return; }
    const id = `BK-${String(bookings.length + 1).padStart(3, "0")}`;
    setBookings([...bookings, { id, droneId: bDrone, droneName: drone.name, date: bDate, slot: bSlot, field: bField || "—", operator: bOperator || "—", notes: bNotes }]);
    toast.success(`Booked ${drone.name} on ${bDate} (${bSlot})`);
    setBField(""); setBOperator(""); setBNotes("");
    setBookingOpen(false);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rTitle.trim()) { toast.error("Title required"); return; }
    const due = new Date(`${rDate}T${rTime}:00`).toISOString();
    const id = `RM-${String(reminders.length + 1).padStart(3, "0")}`;
    setReminders([...reminders, { id, title: rTitle, due, droneId: rDrone === "none" ? undefined : rDrone, done: false }]);
    toast.success("Reminder added");
    setRTitle("");
    setReminderOpen(false);
  };

  const removeBooking = (id: string) => setBookings(bookings.filter(b => b.id !== id));
  const toggleReminder = (id: string) => setReminders(reminders.map(r => r.id === id ? { ...r, done: !r.done } : r));
  const removeReminder = (id: string) => setReminders(reminders.filter(r => r.id !== id));

  const upcomingReminders = [...reminders].sort((a, b) => a.due.localeCompare(b.due));

  return (
    <div>
      <PageHeader title="Bookings & Reminders" description="Reserve drone time slots and schedule work reminders">
        <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
          <DialogTrigger asChild>
            <Button variant="outline"><Bell className="h-4 w-4 mr-1" /> New Reminder</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Reminder</DialogTitle></DialogHeader>
            <form onSubmit={handleAddReminder} className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title</label>
                <Input value={rTitle} onChange={e => setRTitle(e.target.value)} placeholder="e.g. Battery swap before 10am flight" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Date</label>
                  <Input type="date" value={rDate} onChange={e => setRDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Time</label>
                  <Input type="time" value={rTime} onChange={e => setRTime(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Drone (optional)</label>
                <Select value={rDrone} onValueChange={setRDrone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— None —</SelectItem>
                    {drones.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Save Reminder</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Book Slot</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Book Drone Slot</DialogTitle></DialogHeader>
            <form onSubmit={handleAddBooking} className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Drone</label>
                <Select value={bDrone} onValueChange={setBDrone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {drones.map(d => <SelectItem key={d.id} value={d.id}>{d.name} — {d.model}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Date</label>
                  <Input type="date" value={bDate} onChange={e => setBDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Time Slot</label>
                  <Select value={bSlot} onValueChange={setBSlot}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SLOTS.map(s => {
                        const taken = bookings.some(b => b.droneId === bDrone && b.date === bDate && b.slot === s);
                        return <SelectItem key={s} value={s} disabled={taken}>{s}{taken ? " (booked)" : ""}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Field</label>
                <Input value={bField} onChange={e => setBField(e.target.value)} placeholder="e.g. North Wheat Field" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Operator</label>
                <Input value={bOperator} onChange={e => setBOperator(e.target.value)} placeholder="e.g. John Miller" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Notes</label>
                <Textarea rows={2} value={bNotes} onChange={e => setBNotes(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">Confirm Booking</Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Per-drone slot grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mb-6">
        {drones.map((drone) => {
          const list = bookingsByDrone[drone.id] || [];
          return (
            <Card key={drone.id} className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{drone.name}</span>
                  <Badge variant="outline" className="font-normal">{list.length} slot{list.length === 1 ? "" : "s"}</Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground">{drone.model}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {list.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No bookings yet.</p>}
                {list.map((b) => (
                  <div key={b.id} className="flex items-start justify-between gap-2 rounded-md border border-border p-3 hover:bg-muted/30">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        {b.date}
                        <Clock className="h-3.5 w-3.5 text-muted-foreground ml-2" />
                        {b.slot}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{b.field} • {b.operator}</p>
                      {b.notes && <p className="text-xs text-muted-foreground mt-0.5 truncate">{b.notes}</p>}
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeBooking(b.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reminders */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Bell className="h-4 w-4" /> Work Reminders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {upcomingReminders.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No reminders. Add one to stay on schedule.</p>}
          {upcomingReminders.map((r) => {
            const overdue = !r.done && new Date(r.due).getTime() < Date.now();
            return (
              <div key={r.id} className={`flex items-center gap-3 rounded-md border p-3 ${r.done ? "opacity-60" : overdue ? "border-destructive/40 bg-destructive/5" : "border-border"}`}>
                <button onClick={() => toggleReminder(r.id)} className="shrink-0">
                  <CheckCircle2 className={`h-5 w-5 ${r.done ? "text-success" : "text-muted-foreground"}`} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${r.done ? "line-through" : ""}`}>{r.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.due).toLocaleString()}
                    {r.droneId && <> • {drones.find(d => d.id === r.droneId)?.name}</>}
                    {overdue && <span className="text-destructive ml-2">Overdue</span>}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeReminder(r.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
