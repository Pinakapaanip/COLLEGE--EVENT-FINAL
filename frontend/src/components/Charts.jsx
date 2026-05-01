import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const colors = ["#22d3ee", "#a78bfa", "#fb7185", "#34d399", "#fbbf24", "#60a5fa"];

function ChartShell({ title, children }) {
  return (
    <section className="glass-panel rounded-xl p-5 shadow-lg transition-all hover:scale-[1.01]">
      <h3 className="mb-4 text-base font-bold text-white">{title}</h3>
      <div className="h-72">{children}</div>
    </section>
  );
}

export default function Charts({ data }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartShell title="Events by Department">
        <ResponsiveContainer>
          <BarChart data={data.eventsByDepartment}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="label" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title="Category Distribution">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data.categoryDistribution} dataKey="value" nameKey="label" outerRadius={98} label>
              {data.categoryDistribution.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title="Events Over Time">
        <ResponsiveContainer>
          <LineChart data={data.eventsOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="label" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title="Participants by Department">
        <ResponsiveContainer>
          <BarChart data={data.participantsByDepartment}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="label" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Bar dataKey="value" fill="#34d399" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title="Internal vs External">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data.internalExternal} dataKey="value" nameKey="label" innerRadius={54} outerRadius={98} label>
              {data.internalExternal.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title="Winners Leaderboard">
        <ResponsiveContainer>
          <BarChart data={data.winnersTop}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="label" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Bar dataKey="value" fill="#fbbf24" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
    </div>
  );
}
