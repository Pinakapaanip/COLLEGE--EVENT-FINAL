function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "Unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function objectToSeries(obj, name = "count") {
  return Object.entries(obj).map(([label, value]) => ({ label, [name]: Number(value) }));
}

function buildAnalytics(data) {
  const { events, participants, results } = data;
  const now = new Date("2026-04-01T00:00:00.000Z");
  const monthlyMap = { Jan: 0, Feb: 0, Mar: 0, Apr: 0 };

  events.forEach((event) => {
    const month = new Date(`${event.date}T00:00:00.000Z`).toLocaleString("en", { month: "short", timeZone: "UTC" });
    if (monthlyMap[month] !== undefined) monthlyMap[month] += 1;
  });

  const winners = results
    .map((result) => {
      const event = events.find((item) => Number(item.id) === Number(result.event_id));
      const participant = participants.find((item) => Number(item.id) === Number(result.participant_id));
      return {
        id: result.id,
        rank: result.rank,
        prize: result.prize,
        event_title: event?.title || "Unknown Event",
        department: event?.department || participant?.department || "Unknown",
        student_name: participant?.student_name || "Unknown Student",
        roll_no: participant?.roll_no || "N/A"
      };
    })
    .sort((a, b) => a.rank - b.rank || a.event_title.localeCompare(b.event_title))
    .slice(0, 30);

  return {
    kpis: {
      totalEvents: events.length,
      totalParticipants: participants.length,
      departmentsCount: new Set(events.map((event) => event.department)).size,
      upcomingEvents: events.filter((event) => new Date(`${event.date}T00:00:00.000Z`) >= now).length
    },
    eventsByDepartment: objectToSeries(countBy(events, "department"), "events"),
    monthlyTrend: Object.entries(monthlyMap).map(([month, eventsCount]) => ({ month, events: eventsCount })),
    categoryDistribution: objectToSeries(countBy(events, "category"), "value"),
    participantTypeDistribution: objectToSeries(countBy(participants, "participant_type"), "value"),
    participantsByDepartment: objectToSeries(countBy(participants, "department"), "participants"),
    winners
  };
}

module.exports = { buildAnalytics };
