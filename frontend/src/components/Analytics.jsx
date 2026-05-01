import { useMemo, useState } from "react";
import { CalendarDays, RotateCcw, TrendingUp, UserPlus } from "lucide-react";
import Charts from "./Charts";
import KPIcard from "./KPIcard";
import Table from "./Table";

function countBy(items, getter) {
  return items.reduce((acc, item) => {
    const key = getter(item) || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function series(obj) {
  return Object.entries(obj).map(([label, value]) => ({ label, value }));
}

function monthKey(date) {
  const parsed = new Date(`${String(date).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "Unknown";
  return parsed.toLocaleDateString("en", { month: "short", day: "2-digit" });
}

export default function Analytics({ events, participants, results, options }) {
  const [filters, setFilters] = useState({ startDate: "", endDate: "", department: "", category: "" });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = String(event.date || "").slice(0, 10);
      if (filters.startDate && eventDate < filters.startDate) return false;
      if (filters.endDate && eventDate > filters.endDate) return false;
      if (filters.department && event.department !== filters.department) return false;
      if (filters.category && event.category !== filters.category) return false;
      return true;
    });
  }, [events, filters]);

  const filteredEventIds = useMemo(() => new Set(filteredEvents.map((event) => Number(event.id))), [filteredEvents]);
  const filteredParticipants = participants.filter((participant) => filteredEventIds.has(Number(participant.event_id)));
  const filteredResults = results.filter((result) => filteredEventIds.has(Number(result.event_id)));

  const chartData = {
    eventsByDepartment: series(countBy(filteredEvents, (event) => event.department)),
    categoryDistribution: series(countBy(filteredEvents, (event) => event.category)),
    eventsOverTime: series(countBy(filteredEvents, (event) => monthKey(event.date))).sort((a, b) => a.label.localeCompare(b.label)),
    participantsByDepartment: series(countBy(filteredParticipants, (participant) => participant.department)),
    internalExternal: series(countBy(filteredParticipants, (participant) => participant.participant_type)),
    winnersTop: filteredResults
      .filter((result) => Number(result.rank) <= 3)
      .map((result) => {
        const participant = participants.find((item) => Number(item.id) === Number(result.participant_id));
        return { label: participant?.student_name || `Participant ${result.participant_id}`, value: 4 - Number(result.rank) };
      })
      .slice(0, 8)
  };

  const timelineColumns = [
    { key: "title", label: "Event Name" },
    { key: "department", label: "Department" },
    { key: "category", label: "Category" },
    { key: "date", label: "Date" }
  ];

  const avg = filteredEvents.length ? (filteredParticipants.length / filteredEvents.length).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-xl p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Analytics Filters</p>
            <h2 className="mt-1 text-2xl font-bold text-white">Performance Intelligence</h2>
          </div>
          <button
            onClick={() => setFilters({ startDate: "", endDate: "", department: "", category: "" })}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition-all hover:scale-105 hover:bg-white/10"
          >
            <RotateCcw size={16} />
            Reset Filters
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Start Date</span>
            <input className="field" type="date" value={filters.startDate} onChange={(event) => setFilters({ ...filters, startDate: event.target.value })} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">End Date</span>
            <input className="field" type="date" value={filters.endDate} onChange={(event) => setFilters({ ...filters, endDate: event.target.value })} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Department</span>
            <select className="field" value={filters.department} onChange={(event) => setFilters({ ...filters, department: event.target.value })}>
              <option value="">All Departments</option>
              {(options.departments || []).map((department) => <option key={department}>{department}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Category</span>
            <select className="field" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
              <option value="">All Categories</option>
              {(options.categories || []).map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <KPIcard label="Total Events" value={filteredEvents.length} icon={CalendarDays} tone="cyan" />
        <KPIcard label="Total Participants" value={filteredParticipants.length} icon={UserPlus} tone="purple" />
        <KPIcard label="Avg Participants per Event" value={avg} icon={TrendingUp} tone="emerald" />
      </div>

      <Charts data={chartData} />

      <section className="glass-panel rounded-xl p-5">
        <h3 className="mb-4 text-lg font-bold text-white">Event Timeline</h3>
        <Table columns={timelineColumns} rows={filteredEvents} getRowId={(row) => row.id} emptyText="No data found" />
      </section>
    </div>
  );
}
