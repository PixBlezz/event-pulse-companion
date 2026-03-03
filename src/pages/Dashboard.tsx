import { useState } from "react";
import { Navigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { month: "Jan", attendance: 45 },
  { month: "Feb", attendance: 60 },
  { month: "Mar", attendance: 90 },
  { month: "Apr", attendance: 55 },
  { month: "May", attendance: 70 },
  { month: "Jun", attendance: 80 },
];

const EVENTS_TABLE = [
  { name: "Industry Night with Tech Leaders", date: "Fri 14 Mar", type: "Workshop", going: 90 },
  { name: "AI & Machine Learning Seminar", date: "Wed 19 Mar", type: "Seminar", going: 54 },
  { name: "COMPSSA Hackathon 2025", date: "Sat 29 Mar", type: "Hackathon", going: 120 },
];

const STATS = [
  { label: "Events Posted", value: "12" },
  { label: "Members", value: "340" },
  { label: "Attendances Confirmed", value: "264" },
  { label: "Free to Run", value: "100%" },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("overview");
  const [postForm, setPostForm] = useState({ title: "", date: "", venue: "", desc: "", type: "Workshop", imageUrl: "" });
  const [postSuccess, setPostSuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user?.isRep) return <Navigate to="/rep-login" replace />;

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 4000);
    setPostForm({ title: "", date: "", venue: "", desc: "", type: "Workshop", imageUrl: "" });
  };

  const NAV_ITEMS = ["Overview", "Post Event", "All Events", "Members", "Settings"];

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
          <span className="font-poppins font-bold text-sm">Event Pulse</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => { setActiveNav(item.toLowerCase().replace(" ", "-")); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-poppins text-sm transition-colors min-h-[44px] ${
                activeNav === item.toLowerCase().replace(" ", "-")
                  ? "bg-sidebar-accent text-primary font-semibold"
                  : "text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <p className="font-poppins text-xs text-secondary-foreground/50">CS Rep · 2024/2025</p>
          <button onClick={logout} className="font-poppins text-xs text-destructive hover:underline mt-2">Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <h1 className="font-poppins font-extrabold text-2xl text-foreground mb-8 ml-10 lg:ml-0">Dashboard</h1>

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
          <h2 className="font-poppins font-bold text-lg text-card-foreground mb-6">Monthly Attendance</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
              <XAxis dataKey="month" tick={{ fontFamily: "Poppins", fontSize: 12 }} />
              <YAxis tick={{ fontFamily: "Poppins", fontSize: 12 }} />
              <Tooltip contentStyle={{ fontFamily: "Poppins", borderRadius: "8px" }} />
              <Bar dataKey="attendance" fill="#E8820C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Post Event Form */}
        <div className="bg-card rounded-xl border border-border p-6 mb-10">
          <h2 className="font-poppins font-bold text-lg text-card-foreground mb-6">Post a New Event</h2>
          {postSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-600 font-poppins text-sm px-4 py-3 rounded-xl mb-6">
              Event posted! Email notifications sent to 340 members.
            </div>
          )}
          <form onSubmit={handlePost} className="grid md:grid-cols-2 gap-4">
            <input value={postForm.title} onChange={(e) => setPostForm((p) => ({ ...p, title: e.target.value }))} placeholder="Event Title" required className="px-4 py-3 rounded-xl border border-input font-poppins text-sm bg-background text-foreground min-h-[44px]" />
            <input type="datetime-local" value={postForm.date} onChange={(e) => setPostForm((p) => ({ ...p, date: e.target.value }))} required className="px-4 py-3 rounded-xl border border-input font-poppins text-sm bg-background text-foreground min-h-[44px]" />
            <input value={postForm.venue} onChange={(e) => setPostForm((p) => ({ ...p, venue: e.target.value }))} placeholder="Venue" required className="px-4 py-3 rounded-xl border border-input font-poppins text-sm bg-background text-foreground min-h-[44px]" />
            <select value={postForm.type} onChange={(e) => setPostForm((p) => ({ ...p, type: e.target.value }))} className="px-4 py-3 rounded-xl border border-input font-poppins text-sm bg-background text-foreground min-h-[44px]">
              <option>Workshop</option>
              <option>Seminar</option>
              <option>Hackathon</option>
              <option>Meeting</option>
            </select>
            <textarea value={postForm.desc} onChange={(e) => setPostForm((p) => ({ ...p, desc: e.target.value }))} placeholder="Description" rows={3} className="md:col-span-2 px-4 py-3 rounded-xl border border-input font-poppins text-sm bg-background text-foreground resize-none" />
            <input value={postForm.imageUrl} onChange={(e) => setPostForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="Paste an Unsplash image link" className="md:col-span-2 px-4 py-3 rounded-xl border border-input font-poppins text-sm bg-background text-foreground min-h-[44px]" />
            <div className="md:col-span-2">
              <button type="submit" className="bg-primary text-primary-foreground font-poppins font-bold text-sm px-8 py-3 rounded-full hover:brightness-110 transition-all min-h-[44px]">
                Post Event & Notify Members
              </button>
            </div>
          </form>
        </div>

        {/* Events Table */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-poppins font-bold text-lg text-card-foreground mb-6">Recent Events</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-poppins font-semibold text-sm text-muted-foreground pb-3">Event Name</th>
                  <th className="text-left font-poppins font-semibold text-sm text-muted-foreground pb-3">Date</th>
                  <th className="text-left font-poppins font-semibold text-sm text-muted-foreground pb-3">Type</th>
                  <th className="text-left font-poppins font-semibold text-sm text-muted-foreground pb-3">People Going</th>
                  <th className="text-left font-poppins font-semibold text-sm text-muted-foreground pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {EVENTS_TABLE.map((ev) => (
                  <tr key={ev.name} className="border-b border-border last:border-0">
                    <td className="py-4 font-poppins text-sm text-card-foreground font-semibold">{ev.name}</td>
                    <td className="py-4 font-poppins text-sm text-muted-foreground">{ev.date}</td>
                    <td className="py-4"><span className="bg-primary/10 text-primary font-poppins font-semibold text-xs px-3 py-1 rounded-full">{ev.type}</span></td>
                    <td className="py-4 font-poppins text-sm text-muted-foreground">{ev.going}</td>
                    <td className="py-4 space-x-3">
                      <button className="font-poppins text-sm text-muted-foreground hover:text-foreground min-h-[44px]">View</button>
                      <button className="font-poppins text-sm text-destructive hover:underline min-h-[44px]">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
