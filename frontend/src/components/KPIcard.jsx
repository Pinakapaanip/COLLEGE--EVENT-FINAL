export default function KPIcard({ label, value, icon: Icon, tone = "cyan" }) {
  const tones = {
    cyan: "from-cyan-300/20 to-blue-500/10 text-cyan-100 shadow-cyan-500/20",
    purple: "from-purple-300/20 to-fuchsia-500/10 text-purple-100 shadow-purple-500/20",
    emerald: "from-emerald-300/20 to-teal-500/10 text-emerald-100 shadow-emerald-500/20",
    amber: "from-amber-300/20 to-orange-500/10 text-amber-100 shadow-amber-500/20"
  };

  return (
    <section className={`rounded-xl border border-white/10 bg-gradient-to-br ${tones[tone]} p-5 shadow-lg transition-all hover:scale-105`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-300">{label}</p>
        {Icon && (
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
            <Icon size={21} />
          </div>
        )}
      </div>
      <p className="mt-4 text-3xl font-black text-white">{value}</p>
    </section>
  );
}
