import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ open, loading, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <section className="glass-panel w-full max-w-md rounded-xl p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-red-500/20 text-red-100">
            <AlertTriangle />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Confirm Delete</h2>
            <p className="mt-2 text-sm text-slate-300">Are you sure you want to delete this item?</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} disabled={loading} className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 disabled:opacity-60">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-400 disabled:opacity-60">
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </section>
    </div>
  );
}
