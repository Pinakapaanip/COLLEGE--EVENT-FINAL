import { Edit3, Trash2 } from "lucide-react";

export default function Table({ columns, rows, getRowId, onEdit, onDelete, emptyText = "No data found" }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-white/10 text-xs uppercase tracking-[0.14em] text-slate-300">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-4 font-semibold">
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-4 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={getRowId(row)} className="border-t border-white/10 text-slate-100 transition hover:bg-white/[0.06]">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 align-top">
                    {column.render ? column.render(row) : row[column.key] || "-"}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-500/90 px-3 py-2 text-xs font-bold text-white transition-all hover:scale-105 hover:bg-blue-400"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-500/90 px-3 py-2 text-xs font-bold text-white transition-all hover:scale-105 hover:bg-red-400"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && <div className="px-5 py-12 text-center text-slate-300">{emptyText}</div>}
    </div>
  );
}
