import Table from "./Table";

const columns = [
  { key: "event_id", label: "Event ID" },
  { key: "participant_id", label: "Participant ID" },
  { key: "rank", label: "Rank", render: (row) => `#${row.rank}` },
  { key: "prize", label: "Prize" }
];

export default function ResultTable({ results, onEdit, onDelete }) {
  return <Table columns={columns} rows={results} getRowId={(row) => row.id} onEdit={onEdit} onDelete={onDelete} />;
}
