import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

const fieldMap = {
  events: ["title", "category", "department", "date", "venue", "organizer", "description"],
  participants: ["event_id", "student_name", "roll_no", "department", "year", "participant_type"],
  results: ["event_id", "participant_id", "rank", "prize"]
};

function labelFor(field) {
  return field.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function EditModal({ open, resource, item, options, events, participants, loading, onClose, onSubmit }) {
  const fields = useMemo(() => fieldMap[resource] || [], [resource]);
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm(item || {});
  }, [item]);

  if (!open || !item) return null;

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function renderField(field) {
    const baseClass = "field";
    if (field === "description") {
      return <textarea className={`${baseClass} min-h-24`} value={form[field] || ""} onChange={(event) => update(field, event.target.value)} />;
    }
    if (field === "date") {
      return <input className={baseClass} type="date" value={String(form[field] || "").slice(0, 10)} onChange={(event) => update(field, event.target.value)} required />;
    }
    if (field === "department") {
      return (
        <select className={baseClass} value={form[field] || ""} onChange={(event) => update(field, event.target.value)} required>
          {(options.departments || []).map((value) => <option key={value}>{value}</option>)}
        </select>
      );
    }
    if (field === "category") {
      return (
        <select className={baseClass} value={form[field] || ""} onChange={(event) => update(field, event.target.value)} required>
          {(options.categories || []).map((value) => <option key={value}>{value}</option>)}
        </select>
      );
    }
    if (field === "year") {
      return (
        <select className={baseClass} value={form[field] || ""} onChange={(event) => update(field, event.target.value)} required>
          {(options.years || []).map((value) => <option key={value}>{value}</option>)}
        </select>
      );
    }
    if (field === "participant_type") {
      return (
        <select className={baseClass} value={form[field] || ""} onChange={(event) => update(field, event.target.value)} required>
          {(options.participantTypes || []).map((value) => <option key={value}>{value}</option>)}
        </select>
      );
    }
    if (field === "event_id") {
      return (
        <select className={baseClass} value={form[field] || ""} onChange={(event) => update(field, event.target.value)} required>
          {events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
        </select>
      );
    }
    if (field === "participant_id") {
      const filtered = participants.filter((participant) => Number(participant.event_id) === Number(form.event_id));
      const rows = filtered.length ? filtered : participants;
      return (
        <select className={baseClass} value={form[field] || ""} onChange={(event) => update(field, event.target.value)} required>
          {rows.map((participant) => <option key={participant.id} value={participant.id}>{participant.student_name} - {participant.roll_no}</option>)}
        </select>
      );
    }

    return <input className={baseClass} value={form[field] || ""} onChange={(event) => update(field, event.target.value)} required />;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-sm">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
        className="glass-panel w-full max-w-2xl rounded-xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Edit Record</p>
            <h2 className="mt-1 text-2xl font-bold text-white">{resource}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-slate-200 hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field} className={field === "description" ? "space-y-2 md:col-span-2" : "space-y-2"}>
              <span className="text-sm text-slate-300">{labelFor(field)}</span>
              {renderField(field)}
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={loading} className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 disabled:opacity-60">
            Cancel
          </button>
          <button disabled={loading} className="rounded-xl bg-blue-500 px-5 py-2 text-sm font-bold text-white hover:bg-blue-400 disabled:opacity-60">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
