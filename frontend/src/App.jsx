import { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { Activity, CalendarPlus, LayoutDashboard, LogIn, Medal, Trophy, UserPlus, Users } from "lucide-react";
import { apiRequest, API_URL } from "./api";
import { fallbackAnalytics, fallbackEvents, fallbackOptions, fallbackParticipants } from "./fallbackData";

const colors = ["#2dd4bf", "#60a5fa", "#f472b6", "#facc15", "#a78bfa", "#fb7185"];
const nav = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["events", "Events", CalendarPlus],
  ["participants", "Participants", Users],
  ["results", "Results", Trophy]
];

const emptyEvent = { title: "", category: "Technical", department: "CSE", date: "2026-04-30", venue: "", organizer: "", description: "" };
const emptyParticipant = { event_id: "", student_name: "", roll_no: "", department: "CSE", year: "2nd Year", participant_type: "Internal" };
const emptyResult = { event_id: "", participant_id: "", rank: "1", prize: "Gold Medal + Certificate" };

function Notice({ message, tone = "cyan" }) {
  if (!message) return null;
  const palette = tone === "error" ? "border-rose-400/40 bg-rose-500/10 text-rose-100" : "border-cyan-300/30 bg-cyan-400/10 text-cyan-50";
  return <div className={`rounded-lg border px-4 py-3 text-sm ${palette}`}>{message}</div>;
}

function Field({ label, children }) {
  return (
    <label className="space-y-2 text-sm text-slate-300">
      <span>{label}</span>
      {children}
    </label>
  );
}

function TextInput(props) {
  return <input className="field" {...props} />;
}

function Select({ children, ...props }) {
  return <select className="field" {...props}>{children}</select>;
}

function ChartCard({ title, children }) {
  return (
    <section className="glass rounded-lg p-5">
      <h3 className="mb-4 text-base font-semibold text-white">{title}</h3>
      <div className="h-72">{children}</div>
    </section>
  );
}

function Login({ onLogin }) {
  const [name, setName] = useState("");
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="glass w-full max-w-md rounded-lg p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-lg bg-teal-400/20 p-3 text-teal-200"><Activity /></div>
          <div>
            <h1 className="text-2xl font-bold text-white">College Event Portal</h1>
            <p className="text-sm text-slate-300">Demo access for analytics and operations</p>
          </div>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); onLogin(name || "Demo Coordinator"); }} className="space-y-4">
          <Field label="Coordinator name or email">
            <TextInput value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter anything to continue" />
          </Field>
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-teal-300">
            <LogIn size={18} /> Enter Dashboard
          </button>
        </form>
      </div>
    </main>
  );
}

function Dashboard({ analytics, events, participants, error }) {
  const kpis = analytics?.kpis || {};
  const cards = [
    ["Total Events", kpis.totalEvents || events.length, CalendarPlus],
    ["Total Participants", kpis.totalParticipants || participants.length, UserPlus],
    ["Departments", kpis.departmentsCount || 4, LayoutDashboard],
    ["Upcoming Events", kpis.upcomingEvents || 0, Activity]
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border border-white/10">
        <div className="banner-track flex w-[300%]">
          {["event-tech.svg", "event-stage.svg", "event-lab.svg"].map((image) => (
            <img key={image} className="h-56 w-1/3 object-cover" src={`/images/${image}`} alt="Campus event banner" />
          ))}
        </div>
      </div>
      <Notice message={error} tone={error?.includes("unavailable") || error?.includes("failed") ? "error" : "cyan"} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon]) => (
          <div key={label} className="glass rounded-lg p-5 transition hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300">{label}</p>
              <Icon className="text-teal-200" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Events by Department">
          <ResponsiveContainer><BarChart data={analytics.eventsByDepartment}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="label" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip /><Bar dataKey="events" fill="#2dd4bf" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Monthly Trend (Jan-Apr)">
          <ResponsiveContainer><LineChart data={analytics.monthlyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip /><Line type="monotone" dataKey="events" stroke="#f472b6" strokeWidth={3} /></LineChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Category Distribution">
          <ResponsiveContainer><PieChart><Pie data={analytics.categoryDistribution} dataKey="value" nameKey="label" outerRadius={96} label>{analytics.categoryDistribution.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Internal vs External">
          <ResponsiveContainer><PieChart><Pie data={analytics.participantTypeDistribution} dataKey="value" nameKey="label" innerRadius={54} outerRadius={96} label>{analytics.participantTypeDistribution.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Participants by Department">
          <ResponsiveContainer><BarChart data={analytics.participantsByDepartment}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="label" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip /><Bar dataKey="participants" fill="#60a5fa" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>
        <section className="glass rounded-lg p-5">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white"><Medal size={18} /> Winners Leaderboard</h3>
          <div className="max-h-72 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400"><tr><th className="py-2">Rank</th><th>Student</th><th>Event</th><th>Prize</th></tr></thead>
              <tbody>
                {analytics.winners.map((winner) => (
                  <tr key={winner.id} className="border-t border-white/10">
                    <td className="py-3 text-teal-200">#{winner.rank}</td><td>{winner.student_name}</td><td className="text-slate-300">{winner.event_title}</td><td className="text-slate-300">{winner.prize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function Events({ events, options, onCreated }) {
  const [form, setForm] = useState(emptyEvent);
  const [notice, setNotice] = useState("");
  async function submit(event) {
    event.preventDefault();
    const response = await apiRequest("/api/events", { method: "POST", body: JSON.stringify(form) });
    setNotice(response.error || "Event saved successfully");
    if (response.success !== false) {
      onCreated(response.data);
      setForm(emptyEvent);
    }
  }
  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <form onSubmit={submit} className="glass space-y-4 rounded-lg p-5">
        <h2 className="text-xl font-semibold text-white">Add Event</h2><Notice message={notice} tone={notice.includes("failed") ? "error" : "cyan"} />
        <Field label="Title"><TextInput required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category"><Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{options.categories.map((x) => <option key={x}>{x}</option>)}</Select></Field>
          <Field label="Department"><Select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>{options.departments.map((x) => <option key={x}>{x}</option>)}</Select></Field>
        </div>
        <Field label="Date"><TextInput required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
        <Field label="Venue"><TextInput required value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></Field>
        <Field label="Organizer"><TextInput required value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} /></Field>
        <Field label="Description"><textarea className="field min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
        <button className="rounded-lg bg-teal-400 px-4 py-3 font-semibold text-slate-950">Save Event</button>
      </form>
      <div className="glass rounded-lg p-5">
        <h2 className="mb-4 text-xl font-semibold text-white">View Events</h2>
        <div className="grid gap-3">
          {events.map((event) => <div key={event.id} className="rounded-lg border border-white/10 bg-white/5 p-4"><div className="flex flex-wrap justify-between gap-2"><strong>{event.title}</strong><span className="text-teal-200">{event.department} • {event.date}</span></div><p className="mt-2 text-sm text-slate-300">{event.category} at {event.venue} by {event.organizer}</p><p className="mt-2 text-sm text-slate-400">{event.description}</p></div>)}
        </div>
      </div>
    </div>
  );
}

function Participants({ events, participants, options, onCreated }) {
  const firstEvent = events[0]?.id || fallbackEvents[0].id;
  const [form, setForm] = useState({ ...emptyParticipant, event_id: firstEvent });
  const [notice, setNotice] = useState("");
  useEffect(() => { if (!form.event_id && firstEvent) setForm((prev) => ({ ...prev, event_id: firstEvent })); }, [firstEvent, form.event_id]);
  async function submit(event) {
    event.preventDefault();
    const response = await apiRequest("/api/participants", { method: "POST", body: JSON.stringify(form) });
    setNotice(response.error || "Participant saved successfully");
    if (response.success !== false) onCreated(response.data);
  }
  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <form onSubmit={submit} className="glass space-y-4 rounded-lg p-5">
        <h2 className="text-xl font-semibold text-white">Add Participant</h2><Notice message={notice} tone={notice.includes("Duplicate") || notice.includes("failed") ? "error" : "cyan"} />
        <Field label="Event"><Select value={form.event_id} onChange={(e) => setForm({ ...form, event_id: e.target.value })}>{events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}</Select></Field>
        <Field label="Student Name"><TextInput required value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} /></Field>
        <Field label="Roll No"><TextInput required value={form.roll_no} onChange={(e) => setForm({ ...form, roll_no: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Department"><Select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>{options.departments.map((x) => <option key={x}>{x}</option>)}</Select></Field>
          <Field label="Year"><Select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>{options.years.map((x) => <option key={x}>{x}</option>)}</Select></Field>
        </div>
        <Field label="Participant Type"><Select value={form.participant_type} onChange={(e) => setForm({ ...form, participant_type: e.target.value })}>{options.participantTypes.map((x) => <option key={x}>{x}</option>)}</Select></Field>
        <button className="rounded-lg bg-teal-400 px-4 py-3 font-semibold text-slate-950">Save Participant</button>
      </form>
      <div className="glass rounded-lg p-5"><h2 className="mb-4 text-xl font-semibold text-white">Recent Participants</h2>{participants.slice(0, 18).map((p) => <div key={p.id} className="mb-2 rounded-lg bg-white/5 p-3 text-sm">{p.student_name} <span className="text-slate-400">({p.roll_no}) • {p.department} • {p.participant_type}</span></div>)}</div>
    </div>
  );
}

function Results({ events, participants, onCreated }) {
  const [form, setForm] = useState({ ...emptyResult, event_id: events[0]?.id || 1, participant_id: participants[0]?.id || 1 });
  const [notice, setNotice] = useState("");
  const eventParticipants = useMemo(() => participants.filter((p) => Number(p.event_id) === Number(form.event_id)), [participants, form.event_id]);
  const participantOptions = eventParticipants.length ? eventParticipants : participants.slice(0, 25);
  useEffect(() => { if (participantOptions[0] && !participantOptions.some((p) => Number(p.id) === Number(form.participant_id))) setForm((prev) => ({ ...prev, participant_id: participantOptions[0].id })); }, [participantOptions, form.participant_id]);
  async function submit(event) {
    event.preventDefault();
    const response = await apiRequest("/api/results", { method: "POST", body: JSON.stringify(form) });
    setNotice(response.error || "Result saved successfully");
    if (response.success !== false) onCreated(response.data);
  }
  return (
    <form onSubmit={submit} className="glass mx-auto max-w-2xl space-y-4 rounded-lg p-5">
      <h2 className="text-xl font-semibold text-white">Add Result</h2><Notice message={notice} tone={notice.includes("failed") ? "error" : "cyan"} />
      <Field label="Event"><Select value={form.event_id} onChange={(e) => setForm({ ...form, event_id: e.target.value })}>{events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}</Select></Field>
      <Field label="Participant"><Select value={form.participant_id} onChange={(e) => setForm({ ...form, participant_id: e.target.value })}>{participantOptions.map((p) => <option key={p.id} value={p.id}>{p.student_name} - {p.roll_no}</option>)}</Select></Field>
      <Field label="Rank"><Select value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })}><option value="1">1</option><option value="2">2</option><option value="3">3</option></Select></Field>
      <Field label="Prize"><TextInput required value={form.prize} onChange={(e) => setForm({ ...form, prize: e.target.value })} /></Field>
      <button className="rounded-lg bg-teal-400 px-4 py-3 font-semibold text-slate-950">Save Result</button>
    </form>
  );
}

export default function App() {
  const [user, setUser] = useState(localStorage.getItem("portalUser"));
  const [page, setPage] = useState("dashboard");
  const [events, setEvents] = useState(fallbackEvents);
  const [participants, setParticipants] = useState(fallbackParticipants);
  const [analytics, setAnalytics] = useState(null);
  const [options, setOptions] = useState(fallbackOptions);
  const [error, setError] = useState("");

  function login(value) {
    localStorage.setItem("portalUser", value);
    setUser(value);
  }

  async function refresh() {
    const [eventRes, participantRes, analyticsRes, optionRes] = await Promise.all([
      apiRequest("/api/events"), apiRequest("/api/participants"), apiRequest("/api/analytics"), apiRequest("/api/options")
    ]);
    setEvents(eventRes.data?.length ? eventRes.data : fallbackEvents);
    setParticipants(participantRes.data?.length ? participantRes.data : fallbackParticipants);
    setAnalytics(analyticsRes.data);
    setOptions({ ...fallbackOptions, ...(optionRes.data || {}) });
    setError(eventRes.error || participantRes.error || analyticsRes.error || "");
  }

  useEffect(() => { refresh().catch((err) => setError(err.message)); }, []);

  if (!user) return <Login onLogin={login} />;
  const safeAnalytics = analytics || fallbackAnalytics();

  return (
    <div className="min-h-screen lg:flex">
      <aside className="glass lg:sticky lg:top-0 lg:h-screen lg:w-72 border-r border-white/10 p-5">
        <div className="mb-8 flex items-center gap-3"><div className="rounded-lg bg-teal-400/20 p-2 text-teal-200"><Activity /></div><div><h1 className="font-bold text-white">Event Analytics</h1><p className="text-xs text-slate-400">API: {API_URL}</p></div></div>
        <nav className="grid gap-2">{nav.map(([id, label, Icon]) => <button key={id} onClick={() => setPage(id)} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left transition ${page === id ? "bg-teal-400 text-slate-950" : "text-slate-200 hover:bg-white/10"}`}><Icon size={18} /> {label}</button>)}</nav>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-sm text-teal-200">Welcome, {user}</p><h2 className="text-2xl font-bold text-white md:text-3xl">College Event Management & Analytics Portal</h2></div>
          <button onClick={refresh} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-100 hover:bg-white/10">Refresh Data</button>
        </div>
        {page === "dashboard" && <Dashboard analytics={safeAnalytics} events={events} participants={participants} error={error} />}
        {page === "events" && <Events events={events} options={options} onCreated={(item) => { setEvents([item, ...events]); refresh(); }} />}
        {page === "participants" && <Participants events={events} participants={participants} options={options} onCreated={(item) => { setParticipants([item, ...participants]); refresh(); }} />}
        {page === "results" && <Results events={events} participants={participants} onCreated={() => refresh()} />}
      </main>
    </div>
  );
}
