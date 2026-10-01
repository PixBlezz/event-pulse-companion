import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { EVENTS } from "@/components/EventsGrid";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
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

type Page = "overview" | "attendees" | "events" | "insights" | "settings";

const NAV: { id: Page; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "attendees", label: "People Going" },
  { id: "events", label: "Events" },
  { id: "insights", label: "Insights" },
  { id: "settings", label: "Settings" },
];

const TITLES: Record<Page, string> = {
  overview: "Overview",
  attendees: "People Going",
  events: "Events",
  insights: "Insights",
  settings: "Settings",
};

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--success))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--primary) / 0.5)",
];

const card = "bg-card rounded-xl border border-border p-6";
const h2 = "font-poppins font-bold text-lg text-card-foreground mb-6";
const btnPrimary = "bg-primary text-primary-foreground font-poppins font-bold text-sm px-5 py-2.5 rounded-full hover:brightness-110 transition-all min-h-[44px] disabled:opacity-50";
const input = "font-poppins text-sm bg-background border border-input rounded-lg px-3 min-h-[44px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const fmtDate = (d: string) => new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

const exportCSV = (rows: Attendee[], filename = "compssa-attendees.csv") => {
  const header = "Name,Email,Student ID,Level,Phone,Event,Reason,Date\n";
  const body = rows
    .map((a) =>
      [a.name, a.email, a.student_id, a.level, a.phone, a.event_title, a.reason || "", fmtDate(a.created_at)]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
  const url = URL.createObjectURL(new Blob([header + body], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const Dashboard = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState<Page>("overview");
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selected, setSelected] = useState<Attendee | null>(null);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    const { data, error } = await supabase.from("attendees").select("*").order("created_at", { ascending: false });
    if (error) setLoadError(true);
    else setAttendees(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const eventCounts = useMemo(() => attendees.reduce<Record<string, number>>((acc, a) => {
    acc[a.event_title] = (acc[a.event_title] || 0) + 1;
    return acc;
  }, {}), [attendees]);

  const levelCounts = useMemo(() => attendees.reduce<Record<string, number>>((acc, a) => {
    acc[a.level] = (acc[a.level] || 0) + 1;
    return acc;
  }, {}), [attendees]);

  const dailyData = useMemo(() => {
    const map: Record<string, number> = {};
    [...attendees].reverse().forEach((a) => {
      const k = new Date(a.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short" });
      map[k] = (map[k] || 0) + 1;
    });
    return Object.entries(map).map(([day, count]) => ({ day, count }));
  }, [attendees]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return attendees.filter((a) =>
      (eventFilter === "all" || a.event_title === eventFilter) &&
      (levelFilter === "all" || a.level === levelFilter) &&
      (!q || [a.name, a.email, a.student_id, a.phone].some((v) => v.toLowerCase().includes(q)))
    );
  }, [attendees, search, eventFilter, levelFilter]);

  const allEventTitles = Array.from(new Set([...EVENTS.map((e) => e.title), ...Object.keys(eventCounts)]));
  const levels = Object.keys(levelCounts).sort();
  const today = new Date().toDateString();
  const todayCount = attendees.filter((a) => new Date(a.created_at).toDateString() === today).length;
  const topEvent = Object.entries(eventCounts).sort((a, b) => b[1] - a[1])[0];

  const STATS = [
    { label: "Total Confirmations", value: String(attendees.length) },
    { label: "Signed Up Today", value: String(todayCount) },
    { label: "Most Popular Level", value: Object.entries(levelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—" },
    { label: "Latest Signup", value: attendees[0] ? fmtDate(attendees[0].created_at) : "—" },
  ];

  const go = (p: Page) => { setPage(p); setSidebarOpen(false); };
  const viewEventPeople = (title: string) => { setEventFilter(title); setLevelFilter("all"); setSearch(""); go("attendees"); };

  const adminLink = `${window.location.origin}/pulse-admin-x7k9`;
  const copyLink = async () => {
    await navigator.clipboard.writeText(adminLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Empty = ({ text }: { text: string }) => <p className="font-poppins text-sm text-muted-foreground">{text}</p>;

  const renderPage = () => {
    if (page === "overview") return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => (
            <div key={s.label} className="bg-card rounded-xl p-5 border border-border">
              <p className="font-poppins font-extrabold text-2xl text-primary">{s.value}</p>
              <p className="font-poppins text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className={`${card} lg:col-span-2`}>
            <h2 className={h2}>Confirmations per Event</h2>
            {Object.keys(eventCounts).length === 0 ? <Empty text="No confirmations yet — share the site link with students!" /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={Object.entries(eventCounts).map(([e, c]) => ({ event: e.length > 16 ? e.slice(0, 16) + "…" : e, count: c }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="event" tick={{ fontFamily: "Poppins", fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontFamily: "Poppins", fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontFamily: "Poppins", borderRadius: 8 }} />
                  <Bar dataKey="count" name="People Going" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className={card}>
            <h2 className={h2}>Top Event</h2>
            {topEvent ? (
              <>
                <p className="font-poppins font-extrabold text-xl text-card-foreground">{topEvent[0]}</p>
                <p className="font-poppins text-sm text-muted-foreground mt-1">{topEvent[1]} people going</p>
                <button onClick={() => viewEventPeople(topEvent[0])} className={`${btnPrimary} mt-6 w-full`}>See Who's Coming</button>
              </>
            ) : <Empty text="No signups yet." />}
          </div>
        </div>
        <div className={card}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-poppins font-bold text-lg text-card-foreground">Latest Signups</h2>
            <button onClick={() => go("attendees")} className="font-poppins text-sm font-semibold text-primary hover:underline min-h-[44px]">View all →</button>
          </div>
          {attendees.length === 0 ? <Empty text="Once students fill the form, they'll appear here." /> : (
            <ul className="divide-y divide-border">
              {attendees.slice(0, 5).map((a) => (
                <li key={a.id} className="py-3 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-poppins font-bold flex items-center justify-center shrink-0">{a.name.charAt(0).toUpperCase()}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins font-semibold text-sm text-card-foreground truncate">{a.name}</p>
                    <p className="font-poppins text-xs text-muted-foreground truncate">{a.event_title}</p>
                  </div>
                  <span className="font-poppins text-xs text-muted-foreground">{fmtDate(a.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </>
    );

    if (page === "attendees") return (
      <div className={card}>
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <label className="sr-only" htmlFor="search">Search</label>
          <input id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, student ID or phone" className={`${input} flex-1`} />
          <label className="sr-only" htmlFor="ev">Filter by event</label>
          <select id="ev" value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className={input}>
            <option value="all">All events</option>
            {allEventTitles.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <label className="sr-only" htmlFor="lv">Filter by level</label>
          <select id="lv" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className={input}>
            <option value="all">All levels</option>
            {levels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <button onClick={() => exportCSV(filtered)} disabled={filtered.length === 0} className={btnPrimary}>Export CSV</button>
        </div>
        <p className="font-poppins text-sm text-muted-foreground mb-4">Showing {filtered.length} of {attendees.length}</p>
        {filtered.length === 0 ? <Empty text={attendees.length === 0 ? "No one has confirmed yet." : "No matches. Try a different search or filter."} /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Student ID", "Level", "WhatsApp", "Event", "Date", ""].map((h) => (
                    <th key={h} className="text-left font-poppins font-semibold text-sm text-muted-foreground pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-poppins text-sm text-card-foreground font-semibold">{a.name}<span className="block font-normal text-xs text-muted-foreground">{a.email}</span></td>
                    <td className="py-3 pr-4 font-poppins text-sm text-muted-foreground">{a.student_id}</td>
                    <td className="py-3 pr-4"><span className="bg-primary/10 text-primary font-poppins font-semibold text-xs px-3 py-1 rounded-full whitespace-nowrap">{a.level}</span></td>
                    <td className="py-3 pr-4 font-poppins text-sm text-muted-foreground whitespace-nowrap">{a.phone}</td>
                    <td className="py-3 pr-4 font-poppins text-sm text-muted-foreground">{a.event_title}</td>
                    <td className="py-3 pr-4 font-poppins text-sm text-muted-foreground whitespace-nowrap">{fmtDate(a.created_at)}</td>
                    <td className="py-3"><button onClick={() => setSelected(a)} className="font-poppins text-sm font-semibold text-primary hover:underline min-h-[44px]">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );

    if (page === "events") return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allEventTitles.map((title) => {
          const ev = EVENTS.find((e) => e.title === title);
          const count = eventCounts[title] || 0;
          return (
            <div key={title} className="bg-card rounded-xl border border-border overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-card-hover)]">
              {ev && <img src={ev.image} alt={title} className="w-full h-36 object-cover" />}
              <div className="p-5">
                {ev && <p className="font-poppins text-xs font-semibold text-primary mb-1">{ev.tag} · {ev.date} · 📍 {ev.venue}</p>}
                <h3 className="font-poppins font-bold text-card-foreground">{title}</h3>
                <p className="font-poppins font-extrabold text-3xl text-primary mt-3">{count}</p>
                <p className="font-poppins text-sm text-muted-foreground">people going</p>
                <div className="flex gap-2 mt-5">
                  <button onClick={() => viewEventPeople(title)} className={`${btnPrimary} flex-1`}>See List</button>
                  <button onClick={() => exportCSV(attendees.filter((a) => a.event_title === title), `${title}.csv`)} disabled={count === 0} className="font-poppins font-bold text-sm px-4 rounded-full border border-border text-card-foreground min-h-[44px] disabled:opacity-50">CSV</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );

    if (page === "insights") return (
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={card}>
          <h2 className={h2}>Signups Over Time</h2>
          {dailyData.length === 0 ? <Empty text="No data yet." /> : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontFamily: "Poppins", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontFamily: "Poppins", fontSize: 12 }} />
                <Tooltip contentStyle={{ fontFamily: "Poppins", borderRadius: 8 }} />
                <Line type="monotone" dataKey="count" name="Signups" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className={card}>
          <h2 className={h2}>Signups by Level</h2>
          {levels.length === 0 ? <Empty text="No data yet." /> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={Object.entries(levelCounts).map(([name, value]) => ({ name, value }))} dataKey="value" nameKey="name" outerRadius={95} label>
                  {Object.keys(levelCounts).map((l, i) => <Cell key={l} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: "Poppins", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className={`${card} lg:col-span-2`}>
          <h2 className={h2}>Why Students Are Coming</h2>
          {attendees.filter((a) => a.reason).length === 0 ? <Empty text="No reasons shared yet." /> : (
            <ul className="space-y-3">
              {attendees.filter((a) => a.reason).slice(0, 10).map((a) => (
                <li key={a.id} className="border-l-4 border-primary pl-4">
                  <p className="font-poppins text-sm text-card-foreground">"{a.reason}"</p>
                  <p className="font-poppins text-xs text-muted-foreground mt-1">— {a.name}, {a.event_title}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );

    return (
      <div className="space-y-6 max-w-2xl">
        <div className={card}>
          <h2 className={h2}>Your Secret Admin Link</h2>
          <p className="font-poppins text-sm text-muted-foreground mb-4">Only people with this link can open the dashboard. Bookmark it and don't share it.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input readOnly value={adminLink} aria-label="Admin link" className={`${input} flex-1`} />
            <button onClick={copyLink} className={btnPrimary}>{copied ? "✓ Copied" : "Copy Link"}</button>
          </div>
        </div>
        <div className={card}>
          <h2 className={h2}>Data</h2>
          <p className="font-poppins text-sm text-muted-foreground mb-4">Download every confirmation as a spreadsheet you can open in Excel or Google Sheets.</p>
          <div className="flex gap-3">
            <button onClick={() => exportCSV(attendees)} disabled={attendees.length === 0} className={btnPrimary}>Download All ({attendees.length})</button>
            <button onClick={load} className="font-poppins font-bold text-sm px-5 rounded-full border border-border text-card-foreground min-h-[44px]">Refresh Data</button>
          </div>
        </div>
        <div className={card}>
          <h2 className={h2}>About</h2>
          <p className="font-poppins text-sm text-muted-foreground">COMPSSA Event Pulse · Admin dashboard · {EVENTS.length} events listed on the site.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-muted">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "Close menu" : "Open menu"} aria-expanded={sidebarOpen} className="lg:hidden fixed top-4 left-4 z-50 bg-secondary text-secondary-foreground p-2 rounded-lg min-w-[44px] min-h-[44px]">
        {sidebarOpen ? "✕" : "☰"}
      </button>

      <aside className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-40 w-60 bg-secondary text-secondary-foreground flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
          <Logo size={28} />
          <span className="font-poppins font-bold text-sm">Event Pulse Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1" aria-label="Admin sections">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              aria-current={page === item.id ? "page" : undefined}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-poppins text-sm transition-colors min-h-[44px] flex justify-between items-center ${
                page === item.id ? "bg-sidebar-accent text-primary font-semibold" : "text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              {item.label}
              {item.id === "attendees" && attendees.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">{attendees.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <p className="font-poppins text-xs text-secondary-foreground/50 mb-2">COMPSSA Admin · Secret link — don't share</p>
          <Link to="/" className="font-poppins text-xs text-primary hover:underline">← Back to site</Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-secondary/50 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

      <main className="flex-1 p-6 lg:p-10 overflow-auto min-w-0">
        <div className="flex items-center justify-between mb-8 ml-12 lg:ml-0 gap-4">
          <div>
            <h1 className="font-poppins font-extrabold text-2xl text-foreground">{TITLES[page]}</h1>
            <p className="font-poppins text-sm text-muted-foreground">COMPSSA Event Pulse</p>
          </div>
          <button onClick={load} className="font-poppins font-semibold text-sm px-4 rounded-full border border-border bg-card text-card-foreground min-h-[44px]">↻ Refresh</button>
        </div>

        {loading ? (
          <div aria-busy="true" aria-label="Loading data" className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => <div key={i} className="h-24 bg-card rounded-xl border border-border animate-pulse" />)}
            </div>
            <div className="h-72 bg-card rounded-xl border border-border animate-pulse" />
          </div>
        ) : loadError ? (
          <div role="alert" className={`${card} text-center`}>
            <p className="font-poppins font-bold text-card-foreground">We couldn't load the confirmations.</p>
            <p className="font-poppins text-sm text-muted-foreground mt-1">Check your internet connection and try again.</p>
            <button onClick={load} className={`${btnPrimary} mt-5`}>Try Again</button>
          </div>
        ) : renderPage()}
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 bg-secondary/60 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div role="dialog" aria-modal="true" aria-label={`Details for ${selected.name}`} className="bg-card rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-poppins font-bold text-lg flex items-center justify-center">{selected.name.charAt(0).toUpperCase()}</span>
              <div>
                <p className="font-poppins font-bold text-card-foreground">{selected.name}</p>
                <p className="font-poppins text-sm text-muted-foreground">{selected.email}</p>
              </div>
            </div>
            <dl className="space-y-3 font-poppins text-sm">
              {[
                ["Student ID", selected.student_id],
                ["Level", selected.level],
                ["WhatsApp", selected.phone],
                ["Event", selected.event_title],
                ["Signed up", fmtDate(selected.created_at)],
                ["Why attending", selected.reason || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-border pb-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-card-foreground font-semibold text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex gap-3 mt-6">
              <a href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className={`${btnPrimary} flex-1 text-center flex items-center justify-center`}>Message on WhatsApp</a>
              <button onClick={() => setSelected(null)} className="font-poppins font-bold text-sm px-5 rounded-full border border-border text-card-foreground min-h-[44px]">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
