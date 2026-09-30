import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Attendee {
  id: string;
  event_title: string;
  name: string;
  email: string;
  student_id: string;
  level: string;
  phone: string;
  reason: string | null;
  created_at: string;
}

const Dashboard = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    const { data, error } = await supabase
      .from("attendees")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setLoadError(true);
    else setAttendees(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Per-event counts
  const eventCounts = attendees.reduce<Record<string, number>>((acc, a) => {
    acc[a.event_title] = (acc[a.event_title] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(eventCounts).map(([event, count]) => ({
    event: event.length > 18 ? event.slice(0, 18) + "…" : event,
    attendance: count,
  }));

  const levelCounts = attendees.reduce<Record<string, number>>((acc, a) => {
    acc[a.level] = (acc[a.level] || 0) + 1;
    return acc;
  }, {});

  const exportCSV = () => {
    const header = "Name,Email,Student ID,Level,Phone,Event,Reason,Date\n";
    const rows = attendees
      .map((a) =>
        [a.name, a.email, a.student_id, a.level, a.phone, a.event_title, (a.reason || "").replace(/,/g, ";"), new Date(a.created_at).toLocaleDateString()]
          .map((v) => `"${v}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "compssa-attendees.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const STATS = [
    { label: "Total Confirmations", value: String(attendees.length) },
    { label: "Events With Signups", value: String(Object.keys(eventCounts).length) },
    { label: "Most Popular Level", value: Object.entries(levelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—" },
    { label: "Latest Signup", value: attendees[0] ? new Date(attendees[0].created_at).toLocaleDateString() : "—" },
  ];

  const NAV_ITEMS = ["Overview", "Attendees"];

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Mobile menu button */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 bg-secondary text-secondary-foreground p-2 rounded-lg min-w-[44px] min-h-[44px]">
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-60 bg-secondary text-secondary-foreground flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
          <Logo size={28} />
          <span className="font-poppins font-bold text-sm">Event Pulse Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => { setActiveNav(item.toLowerCase()); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-poppins text-sm transition-colors min-h-[44px] ${
                activeNav === item.toLowerCase()
                  ? "bg-sidebar-accent text-primary font-semibold"
                  : "text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <p className="font-poppins text-xs text-secondary-foreground/50 mb-2">COMPSSA Admin · Secret link — don't share</p>
          <Link to="/" className="font-poppins text-xs text-primary hover:underline">← Back to site</Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="flex items-center justify-between mb-8 ml-10 lg:ml-0">
          <h1 className="font-poppins font-extrabold text-2xl text-foreground">Dashboard</h1>
          <button onClick={exportCSV} disabled={attendees.length === 0} className="bg-primary text-primary-foreground font-poppins font-bold text-sm px-5 py-2.5 rounded-full hover:brightness-110 transition-all min-h-[44px] disabled:opacity-50">
            Export to Excel (CSV)
          </button>
        </div>

        {loading ? (
          <div aria-busy="true" aria-label="Loading attendance data" className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => <div key={i} className="h-24 bg-card rounded-xl border border-border animate-pulse" />)}
            </div>
            <div className="h-72 bg-card rounded-xl border border-border animate-pulse" />
            <div className="h-64 bg-card rounded-xl border border-border animate-pulse" />
          </div>
        ) : loadError ? (
          <div role="alert" className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="font-poppins font-bold text-card-foreground">We couldn't load the confirmations.</p>
            <p className="font-poppins text-sm text-muted-foreground mt-1">Check your internet connection and try again.</p>
            <button onClick={load} className="mt-5 bg-primary text-primary-foreground font-poppins font-bold text-sm px-6 py-2.5 rounded-full min-h-[44px]">Try Again</button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {STATS.map((s) => (
                <div key={s.label} className="bg-card rounded-xl p-5 border border-border">
                  <p className="font-poppins font-extrabold text-2xl text-primary">{s.value}</p>
                  <p className="font-poppins text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-card rounded-xl border border-border p-6 mb-10">
              <h2 className="font-poppins font-bold text-lg text-card-foreground mb-6">Confirmations per Event</h2>
              {chartData.length === 0 ? (
                <p className="font-poppins text-sm text-muted-foreground">No confirmations yet — share the site link with students!</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
                    <XAxis dataKey="event" tick={{ fontFamily: "Poppins", fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontFamily: "Poppins", fontSize: 12 }} />
                    <Tooltip contentStyle={{ fontFamily: "Poppins", borderRadius: "8px" }} />
                    <Bar dataKey="attendance" fill="#E8820C" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Attendees Table */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-poppins font-bold text-lg text-card-foreground mb-6">All Confirmations ({attendees.length})</h2>
              {attendees.length === 0 ? (
                <p className="font-poppins text-sm text-muted-foreground">No one has confirmed yet. Once students fill the form, they'll appear here.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left font-poppins font-semibold text-sm text-muted-foreground pb-3">Name</th>
                        <th className="text-left font-poppins font-semibold text-sm text-muted-foreground pb-3">Student ID</th>
                        <th className="text-left font-poppins font-semibold text-sm text-muted-foreground pb-3">Level</th>
                        <th className="text-left font-poppins font-semibold text-sm text-muted-foreground pb-3">WhatsApp</th>
                        <th className="text-left font-poppins font-semibold text-sm text-muted-foreground pb-3">Event</th>
                        <th className="text-left font-poppins font-semibold text-sm text-muted-foreground pb-3">Why Attending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.map((a) => (
                        <tr key={a.id} className="border-b border-border last:border-0">
                          <td className="py-4 font-poppins text-sm text-card-foreground font-semibold">
                            {a.name}
                            <span className="block font-normal text-xs text-muted-foreground">{a.email}</span>
                          </td>
                          <td className="py-4 font-poppins text-sm text-muted-foreground">{a.student_id}</td>
                          <td className="py-4"><span className="bg-primary/10 text-primary font-poppins font-semibold text-xs px-3 py-1 rounded-full">{a.level}</span></td>
                          <td className="py-4 font-poppins text-sm text-muted-foreground">{a.phone}</td>
                          <td className="py-4 font-poppins text-sm text-muted-foreground">{a.event_title}</td>
                          <td className="py-4 font-poppins text-sm text-muted-foreground max-w-[220px]">{a.reason || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
