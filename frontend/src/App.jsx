import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Database, Medal, Sparkles, Trophy, Users } from "lucide-react";
import { apiRequest, BASE_URL } from "./api";
import { fallbackEvents, fallbackOptions, fallbackParticipants, fallbackResults } from "./fallbackData";
import Analytics from "./components/Analytics";
import Carousel from "./components/Carousel";
import ConfirmModal from "./components/ConfirmModal";
import EditModal from "./components/EditModal";
import EventTable from "./components/EventTable";
import Header from "./components/Header";
import KPIcard from "./components/KPIcard";
import ParticipantTable from "./components/ParticipantTable";
import ResultTable from "./components/ResultTable";
import Sidebar from "./components/Sidebar";

const emptyEvent = {
  title: "",
  category: "Technical",
  department: "CSE",
  date: "2026-04-30",
  venue: "",
  organizer: "",
  description: ""
};

const emptyParticipant = {
  event_id: "",
  student_name: "",
  roll_no: "",
  department: "CSE",
  year: "2nd Year",
  participant_type: "Internal"
};

const emptyResult = {
  event_id: "",
  participant_id: "",
  rank: "1",
  prize: "Gold Medal + Certificate"
};

function safeArray(value, fallback = []) {
  return Array.isArray(value) && value.length ? value : fallback;
}

function ToastStack({ toasts, onClose }) {
  return (
    <div className="fixed right-4 top-4 z-[60] grid w-[min(360px,calc(100vw-2rem))] gap-3">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => onClose(toast.id)}
          className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold shadow-lg backdrop-blur-lg ${
            toast.type === "error"
              ? "border-red-300/30 bg-red-500/20 text-red-50"
              : "border-emerald-300/30 bg-emerald-500/20 text-emerald-50"
          }`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="grid min-h-[320px] place-items-center">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-cyan-200/20 border-t-cyan-300" />
        <p className="mt-4 text-sm font-semibold text-slate-200">Loading portal data...</p>
      </div>
    </div>
  );
}

function PageTitle({ eyebrow, title, children }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-bold text-white md:text-3xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function EventForm({ options, onSubmit, loading }) {
  const [form, setForm] = useState(emptyEvent);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSubmit(form, () => setForm(emptyEvent));
  }

  return (
    <form onSubmit={submit} className="glass-panel rounded-xl p-5">
      <PageTitle eyebrow="Create" title="Add Event" />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Title</span>
          <input className="field" value={form.title} onChange={(event) => update("title", event.target.value)} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Category</span>
          <select className="field" value={form.category} onChange={(event) => update("category", event.target.value)} required>
            {(options.categories || []).map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Department</span>
          <select className="field" value={form.department} onChange={(event) => update("department", event.target.value)} required>
            {(options.departments || []).map((department) => <option key={department}>{department}</option>)}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Date</span>
          <input className="field" type="date" value={form.date} onChange={(event) => update("date", event.target.value)} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Venue</span>
          <input className="field" value={form.venue} onChange={(event) => update("venue", event.target.value)} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Organizer</span>
          <input className="field" value={form.organizer} onChange={(event) => update("organizer", event.target.value)} required />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-slate-300">Description</span>
          <textarea className="field min-h-28" value={form.description} onChange={(event) => update("description", event.target.value)} />
        </label>
      </div>
      <button disabled={loading} className="mt-5 rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Saving..." : "Create Event"}
      </button>
    </form>
  );
}

function ParticipantForm({ events, options, onSubmit, loading }) {
  const firstEvent = events[0]?.id || "";
  const [form, setForm] = useState({ ...emptyParticipant, event_id: firstEvent });

  useEffect(() => {
    if (!form.event_id && firstEvent) setForm((current) => ({ ...current, event_id: firstEvent }));
  }, [firstEvent, form.event_id]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form, () => setForm({ ...emptyParticipant, event_id: firstEvent }));
      }}
      className="glass-panel rounded-xl p-5"
    >
      <h3 className="mb-4 text-xl font-bold text-white">Add Participant</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-slate-300">Event</span>
          <select className="field" value={form.event_id} onChange={(event) => update("event_id", event.target.value)} required>
            {events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Student Name</span>
          <input className="field" value={form.student_name} onChange={(event) => update("student_name", event.target.value)} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Roll No</span>
          <input className="field" value={form.roll_no} onChange={(event) => update("roll_no", event.target.value)} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Department</span>
          <select className="field" value={form.department} onChange={(event) => update("department", event.target.value)} required>
            {(options.departments || []).map((department) => <option key={department}>{department}</option>)}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Year</span>
          <select className="field" value={form.year} onChange={(event) => update("year", event.target.value)} required>
            {(options.years || []).map((year) => <option key={year}>{year}</option>)}
          </select>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-slate-300">Participant Type</span>
          <select className="field" value={form.participant_type} onChange={(event) => update("participant_type", event.target.value)} required>
            {(options.participantTypes || []).map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
      </div>
      <button disabled={loading || !events.length} className="mt-5 rounded-xl bg-purple-300 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-purple-500/20 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Saving..." : "Create Participant"}
      </button>
    </form>
  );
}

function ResultForm({ events, participants, onSubmit, loading }) {
  const [form, setForm] = useState({ ...emptyResult, event_id: events[0]?.id || "", participant_id: participants[0]?.id || "" });
  const filteredParticipants = participants.filter((participant) => Number(participant.event_id) === Number(form.event_id));
  const participantOptions = filteredParticipants.length ? filteredParticipants : participants;

  useEffect(() => {
    if (participantOptions[0] && !participantOptions.some((participant) => Number(participant.id) === Number(form.participant_id))) {
      setForm((current) => ({ ...current, participant_id: participantOptions[0].id }));
    }
  }, [participantOptions, form.participant_id]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form, () => setForm({ ...emptyResult, event_id: events[0]?.id || "", participant_id: participants[0]?.id || "" }));
      }}
      className="glass-panel rounded-xl p-5"
    >
      <h3 className="mb-4 text-xl font-bold text-white">Add Result</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Event</span>
          <select className="field" value={form.event_id} onChange={(event) => update("event_id", event.target.value)} required>
            {events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Participant</span>
          <select className="field" value={form.participant_id} onChange={(event) => update("participant_id", event.target.value)} required>
            {participantOptions.map((participant) => <option key={participant.id} value={participant.id}>{participant.student_name} - {participant.roll_no}</option>)}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Rank</span>
          <select className="field" value={form.rank} onChange={(event) => update("rank", event.target.value)} required>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Prize</span>
          <input className="field" value={form.prize} onChange={(event) => update("prize", event.target.value)} required />
        </label>
      </div>
      <button disabled={loading || !events.length || !participants.length} className="mt-5 rounded-xl bg-amber-300 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Saving..." : "Create Result"}
      </button>
    </form>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [events, setEvents] = useState(fallbackEvents);
  const [participants, setParticipants] = useState(fallbackParticipants);
  const [results, setResults] = useState(fallbackResults);
  const [options, setOptions] = useState(fallbackOptions);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState([]);
  const [editState, setEditState] = useState({ open: false, resource: "", item: null });
  const [deleteState, setDeleteState] = useState({ open: false, resource: "", item: null });

  function toast(message, type = "success") {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3200);
  }

  async function loadData() {
    setIsLoading(true);
    const [eventRes, participantRes, resultRes, optionRes] = await Promise.all([
      apiRequest("/events"),
      apiRequest("/participants"),
      apiRequest("/results"),
      apiRequest("/options")
    ]);

    setEvents(safeArray(eventRes.data, fallbackEvents));
    setParticipants(safeArray(participantRes.data, fallbackParticipants));
    setResults(safeArray(resultRes.data, fallbackResults));
    setOptions({ ...fallbackOptions, ...(optionRes.data || {}) });

    const firstError = [eventRes, participantRes, resultRes, optionRes].find((response) => response.error)?.error || "";
    setError(firstError);
    if (firstError) toast(firstError, "error");
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createResource(resource, payload, reset) {
    setIsSaving(true);
    const response = await apiRequest(`/${resource}`, { method: "POST", body: JSON.stringify(payload) });
    setIsSaving(false);

    if (!response.success) {
      toast(response.error || "Save failed", "error");
      return;
    }

    if (resource === "events") setEvents((current) => [response.data, ...current]);
    if (resource === "participants") setParticipants((current) => [response.data, ...current]);
    if (resource === "results") setResults((current) => [response.data, ...current]);
    reset?.();
    toast("Saved successfully");
  }

  async function updateResource(resource, payload) {
    setIsSaving(true);
    const response = await apiRequest(`/${resource}/${payload.id}`, { method: "PUT", body: JSON.stringify(payload) });
    setIsSaving(false);

    if (!response.success) {
      toast(response.error || "Update failed", "error");
      return;
    }

    const updater = (row) => (Number(row.id) === Number(payload.id) ? response.data : row);
    if (resource === "events") setEvents((current) => current.map(updater));
    if (resource === "participants") setParticipants((current) => current.map(updater));
    if (resource === "results") setResults((current) => current.map(updater));
    setEditState({ open: false, resource: "", item: null });
    toast("Updated successfully");
  }

  async function deleteResource() {
    const { resource, item } = deleteState;
    if (!resource || !item) return;
    setIsSaving(true);
    const response = await apiRequest(`/${resource}/${item.id}`, { method: "DELETE" });
    setIsSaving(false);

    if (!response.success) {
      toast(response.error || "Delete failed", "error");
      return;
    }

    const keep = (row) => Number(row.id) !== Number(item.id);
    if (resource === "events") {
      setEvents((current) => current.filter(keep));
      setParticipants((current) => current.filter((participant) => Number(participant.event_id) !== Number(item.id)));
      setResults((current) => current.filter((result) => Number(result.event_id) !== Number(item.id)));
    }
    if (resource === "participants") {
      setParticipants((current) => current.filter(keep));
      setResults((current) => current.filter((result) => Number(result.participant_id) !== Number(item.id)));
    }
    if (resource === "results") setResults((current) => current.filter(keep));
    setDeleteState({ open: false, resource: "", item: null });
    toast("Deleted successfully");
  }

  const searchedEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return events;
    return events.filter((event) =>
      [event.title, event.category, event.department, event.venue, event.organizer]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [events, search]);

  const stats = {
    totalEvents: events.length,
    totalParticipants: participants.length,
    totalResults: results.length,
    databaseMode: error ? "Fallback Ready" : "Live API"
  };

  function edit(resource, item) {
    setEditState({ open: true, resource, item });
  }

  function askDelete(resource, item) {
    setDeleteState({ open: true, resource, item });
  }

  function renderPage() {
    if (isLoading) return <LoadingSpinner />;

    if (activePage === "dashboard") {
      return (
        <div className="space-y-6">
          <Carousel />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KPIcard label="Total Events" value={stats.totalEvents} icon={CalendarDays} tone="cyan" />
            <KPIcard label="Participants" value={stats.totalParticipants} icon={Users} tone="purple" />
            <KPIcard label="Results Recorded" value={stats.totalResults} icon={Trophy} tone="amber" />
            <KPIcard label="API Status" value={stats.databaseMode} icon={Database} tone="emerald" />
          </div>
          <section className="glass-panel rounded-xl p-5">
            <PageTitle eyebrow="Operations" title="Recent Events">
              <button onClick={() => setActivePage("add-event")} className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition-all hover:scale-105">
                Add Event
              </button>
            </PageTitle>
            <EventTable events={events.slice(0, 8)} onEdit={(item) => edit("events", item)} onDelete={(item) => askDelete("events", item)} />
          </section>
        </div>
      );
    }

    if (activePage === "events") {
      return (
        <section className="glass-panel rounded-xl p-5">
          <PageTitle eyebrow="Manage" title="View Events" />
          <EventTable events={events} onEdit={(item) => edit("events", item)} onDelete={(item) => askDelete("events", item)} />
        </section>
      );
    }

    if (activePage === "add-event") {
      return <EventForm options={options} loading={isSaving} onSubmit={(payload, reset) => createResource("events", payload, reset)} />;
    }

    if (activePage === "participants") {
      return (
        <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
          <ParticipantForm events={events} options={options} loading={isSaving} onSubmit={(payload, reset) => createResource("participants", payload, reset)} />
          <section className="glass-panel rounded-xl p-5">
            <PageTitle eyebrow="Manage" title="Participants" />
            <ParticipantTable participants={participants} onEdit={(item) => edit("participants", item)} onDelete={(item) => askDelete("participants", item)} />
          </section>
        </div>
      );
    }

    if (activePage === "results") {
      return (
        <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
          <ResultForm events={events} participants={participants} loading={isSaving} onSubmit={(payload, reset) => createResource("results", payload, reset)} />
          <section className="glass-panel rounded-xl p-5">
            <PageTitle eyebrow="Manage" title="Results" />
            <ResultTable results={results} onEdit={(item) => edit("results", item)} onDelete={(item) => askDelete("results", item)} />
          </section>
        </div>
      );
    }

    if (activePage === "analytics") {
      return <Analytics events={events} participants={participants} results={results} options={options} />;
    }

    if (activePage === "search") {
      return (
        <section className="glass-panel rounded-xl p-5">
          <PageTitle eyebrow="Discover" title="Search Events">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-slate-200">
              <Sparkles size={16} className="text-cyan-200" />
              {searchedEvents.length} match{searchedEvents.length === 1 ? "" : "es"}
            </div>
          </PageTitle>
          <input
            className="field mb-5"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, department, category, venue, or organizer"
          />
          <EventTable events={searchedEvents} onEdit={(item) => edit("events", item)} onDelete={(item) => askDelete("events", item)} />
        </section>
      );
    }

    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-r from-blue-900 via-slate-950 to-purple-900 text-slate-100 ${isDark ? "dark" : ""}`}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.22),transparent_30%)] lg:flex">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <main className="min-w-0 flex-1 p-4 md:p-6">
          <Header isDark={isDark} onToggleTheme={() => setIsDark((value) => !value)} onRefresh={loadData} isLoading={isLoading} />
          <div className="mt-5">
            <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
              API Base URL: <span className="font-semibold text-cyan-200">{BASE_URL}</span>
            </div>
            {error && <div className="mb-4 rounded-xl border border-amber-300/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-50">{error}</div>}
            {renderPage()}
          </div>
        </main>
      </div>

      <EditModal
        open={editState.open}
        resource={editState.resource}
        item={editState.item}
        options={options}
        events={events}
        participants={participants}
        loading={isSaving}
        onClose={() => setEditState({ open: false, resource: "", item: null })}
        onSubmit={(payload) => updateResource(editState.resource, payload)}
      />
      <ConfirmModal
        open={deleteState.open}
        loading={isSaving}
        onCancel={() => setDeleteState({ open: false, resource: "", item: null })}
        onConfirm={deleteResource}
      />
      <ToastStack toasts={toasts} onClose={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />
    </div>
  );
}
