import Table from "./Table";

const columns = [
  { key: "student_name", label: "Student" },
  { key: "roll_no", label: "Roll No" },
  { key: "department", label: "Department" },
  { key: "year", label: "Year" },
  { key: "participant_type", label: "Type" },
  { key: "event_id", label: "Event ID" }
];

export default function ParticipantTable({ participants, onEdit, onDelete }) {
  return <Table columns={columns} rows={participants} getRowId={(row) => row.id} onEdit={onEdit} onDelete={onDelete} />;
}
