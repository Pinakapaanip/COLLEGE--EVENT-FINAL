const departments = ["CSE", "AI", "ECE", "MECH"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const categories = ["Technical", "Cultural", "Sports", "Workshop", "Innovation"];
const participantTypes = ["Internal", "External"];

const eventBlueprint = [
  ["CSE", 12], ["AI", 8], ["ECE", 10], ["MECH", 6]
];

const titleBank = {
  CSE: ["CodeSprint", "WebForge", "Cyber Shield", "Algo Arena", "DevOps Relay", "Cloud Quest"],
  AI: ["Prompt Lab", "Vision Hack", "Data Derby", "Model Masters", "Neural Nexus"],
  ECE: ["RoboCircuit", "Signal Quest", "IoT Forge", "VLSI Spark", "Drone Dash"],
  MECH: ["CAD Clash", "RoboRace", "Thermo Trial", "Mechathon", "Auto Expo"]
};

const firstNames = ["Aarav", "Diya", "Vihaan", "Ananya", "Ishaan", "Meera", "Kabir", "Saanvi", "Arjun", "Nisha", "Rohan", "Tara", "Aditya", "Kavya", "Rahul", "Priya", "Vivaan", "Sneha", "Kiran", "Aisha"];
const lastNames = ["Sharma", "Reddy", "Iyer", "Patel", "Nair", "Khan", "Das", "Mehta", "Rao", "Varma", "Menon", "Kapoor", "Joshi", "Bose", "Naidu", "Saxena"];
const venues = ["Main Auditorium", "Innovation Lab", "Seminar Hall A", "Open Air Theatre", "ECE Lab", "Mechanical Workshop", "CSE Block 204", "Sports Complex"];
const organizers = ["Student Council", "Tech Club", "Department Forum", "IEEE Chapter", "Cultural Committee", "Innovation Cell"];

function pick(list, index, offset = 0) {
  return list[(index + offset) % list.length];
}

function buildMockData() {
  const events = [];
  let eventId = 1;
  eventBlueprint.forEach(([department, count], deptIndex) => {
    for (let i = 0; i < count; i += 1) {
      const month = (i + deptIndex) % 4;
      const day = 4 + ((i * 5 + deptIndex * 3) % 24);
      const date = new Date(Date.UTC(2026, month, day)).toISOString().slice(0, 10);
      const title = `${pick(titleBank[department], i, deptIndex)} ${i % 3 === 0 ? "Challenge" : i % 3 === 1 ? "Summit" : "League"}`;
      events.push({
        id: eventId++,
        title,
        category: pick(categories, i, deptIndex),
        department,
        date,
        venue: pick(venues, i, deptIndex),
        organizer: pick(organizers, i, deptIndex),
        description: `${title} brings students together for practical problem solving, judging rounds, and campus-wide collaboration.`
      });
    }
  });

  const students = Array.from({ length: 236 }, (_, i) => {
    const department = departments[(i * 7 + 3) % departments.length];
    return {
      id: i + 1,
      student_name: `${pick(firstNames, i)} ${pick(lastNames, i, 5)}`,
      roll_no: `${department}${String(2026001 + i).slice(-4)}`,
      department,
      year: pick(years, i, 1),
      participant_type: i % 5 === 0 || i % 11 === 0 ? "External" : "Internal"
    };
  });

  const participants = [];
  let participantId = 1;
  events.forEach((event, eventIndex) => {
    const count = 10 + ((eventIndex * 7) % 9);
    for (let i = 0; i < count; i += 1) {
      const student = students[(eventIndex * 13 + i * 3) % students.length];
      participants.push({
        id: participantId++,
        event_id: event.id,
        student_name: student.student_name,
        roll_no: `${student.roll_no}-${event.id}`,
        department: student.department,
        year: student.year,
        participant_type: student.participant_type
      });
    }
  });

  const results = [];
  let resultId = 1;
  events.forEach((event, eventIndex) => {
    const eventParticipants = participants.filter((p) => p.event_id === event.id);
    [1, 2, 3].forEach((rank, offset) => {
      const participant = eventParticipants[(eventIndex + offset * 2) % eventParticipants.length];
      results.push({
        id: resultId++,
        event_id: event.id,
        participant_id: participant.id,
        rank,
        prize: rank === 1 ? "Gold Medal + Certificate" : rank === 2 ? "Silver Medal + Certificate" : "Bronze Medal + Certificate"
      });
    });
  });

  return { departments, years, categories, participantTypes, events, participants, results };
}

module.exports = { buildMockData, departments, years, categories, participantTypes };
