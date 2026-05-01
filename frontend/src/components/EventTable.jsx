import Table from "./Table";

const columns = [
  { key: "title", label: "Event Name" },
  { key: "category", label: "Category" },
  { key: "department", label: "Department" },
  { key: "date", label: "Date" },
  { key: "venue", label: "Venue" },
  { key: "organizer", label: "Organizer" }
];

export default function EventTable({ events, onEdit, onDelete }) {
  return <Table columns={columns} rows={events} getRowId={(row) => row.id} onEdit={onEdit} onDelete={onDelete} />;
}
