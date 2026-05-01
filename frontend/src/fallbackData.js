const departments = ["CSE", "AI", "ECE", "MECH"];
const categories = ["Technical", "Cultural", "Sports", "Workshop", "Innovation"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const participantTypes = ["Internal", "External"];

const baseEvents = [
  ["CodeSprint Challenge", "Technical", "CSE", "2026-01-08"],
  ["Cyber Shield Summit", "Technical", "CSE", "2026-01-22"],
  ["Prompt Lab League", "Innovation", "AI", "2026-02-05"],
  ["Vision Hack Challenge", "Workshop", "AI", "2026-02-16"],
  ["RoboCircuit Summit", "Technical", "ECE", "2026-03-07"],
  ["Signal Quest League", "Innovation", "ECE", "2026-03-21"],
  ["CAD Clash Challenge", "Workshop", "MECH", "2026-04-04"],
  ["RoboRace Summit", "Sports", "MECH", "2026-04-18"]
];

export const fallbackEvents = Array.from({ length: 36 }, (_, index) => {
  const base = baseEvents[index % baseEvents.length];
  return {
    id: index + 1,
    title: `${base[0]} ${index + 1}`,
    category: categories[(index + 2) % categories.length],
    department: index < 12 ? "CSE" : index < 20 ? "AI" : index < 30 ? "ECE" : "MECH",
    date: base[3],
    venue: ["Main Auditorium", "Innovation Lab", "Seminar Hall A", "Sports Complex"][index % 4],
    organizer: ["Tech Club", "IEEE Chapter", "Innovation Cell", "Student Council"][index % 4],
    description: "Campus event with judging rounds, student participation, and department-level coordination."
  };
});

export const fallbackParticipants = Array.from({ length: 432 }, (_, index) => ({
  id: index + 1,
  event_id: (index % 36) + 1,
  student_name: ["Aarav Sharma", "Diya Reddy", "Vihaan Iyer", "Ananya Patel", "Kabir Nair"][index % 5],
  roll_no: `${departments[index % 4]}${2026000 + index}`,
  department: departments[(index * 3) % 4],
  year: years[index % 4],
  participant_type: index % 6 === 0 ? "External" : "Internal"
}));

export const fallbackResults = fallbackEvents.flatMap((event) =>
  [1, 2, 3].map((rank) => ({
    id: event.id * 10 + rank,
    event_id: event.id,
    participant_id: ((event.id - 1) * 12 + rank),
    rank,
    prize: rank === 1 ? "Gold Medal + Certificate" : rank === 2 ? "Silver Medal + Certificate" : "Bronze Medal + Certificate"
  }))
);

function countBy(items, key) {
  return items.reduce((acc, item) => ({ ...acc, [item[key]]: (acc[item[key]] || 0) + 1 }), {});
}

function series(obj, valueKey) {
  return Object.entries(obj).map(([label, value]) => ({ label, [valueKey]: value }));
}

export function fallbackAnalytics() {
  return {
    kpis: { totalEvents: 36, totalParticipants: 432, departmentsCount: 4, upcomingEvents: 9 },
    eventsByDepartment: series(countBy(fallbackEvents, "department"), "events"),
    monthlyTrend: [{ month: "Jan", events: 9 }, { month: "Feb", events: 8 }, { month: "Mar", events: 10 }, { month: "Apr", events: 9 }],
    categoryDistribution: series(countBy(fallbackEvents, "category"), "value"),
    participantTypeDistribution: series(countBy(fallbackParticipants, "participant_type"), "value"),
    participantsByDepartment: series(countBy(fallbackParticipants, "department"), "participants"),
    winners: fallbackResults.slice(0, 30).map((result) => {
      const event = fallbackEvents.find((item) => item.id === result.event_id);
      const participant = fallbackParticipants.find((item) => item.id === result.participant_id);
      return { ...result, event_title: event?.title, student_name: participant?.student_name, roll_no: participant?.roll_no, department: event?.department };
    })
  };
}

export const fallbackOptions = { departments, categories, years, participantTypes };
