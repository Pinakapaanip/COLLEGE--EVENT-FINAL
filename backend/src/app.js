require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dataService = require("./services/dataService");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

function send(res, payload, status = 200) {
  res.status(status).json(payload);
}

function asyncRoute(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      send(res, { success: false, data: null, error: error.message || "Unexpected server error", source: "server" }, 400);
    }
  };
}

app.get("/", (req, res) => send(res, { success: true, message: "College Event Portal API", routes: ["/health", "/api/events", "/api/participants", "/api/results", "/api/analytics"] }));
app.get("/health", (req, res) => send(res, { success: true, ...dataService.health() }));
app.get("/api/options", (req, res) => send(res, { success: true, data: dataService.options(), source: "static", error: null }));

app.get("/api/events", asyncRoute(async (req, res) => send(res, { success: true, ...(await dataService.listEvents()) })));
app.post("/api/events", asyncRoute(async (req, res) => send(res, { success: true, ...(await dataService.addEvent(req.body)) }, 201)));
app.put("/api/events/:id", asyncRoute(async (req, res) => send(res, { success: true, ...(await dataService.updateEvent(req.params.id, req.body)) })));
app.delete("/api/events/:id", asyncRoute(async (req, res) => send(res, { success: true, ...(await dataService.deleteEvent(req.params.id)) })));

app.get("/api/participants", asyncRoute(async (req, res) => send(res, { success: true, ...(await dataService.listParticipants()) })));
app.post("/api/participants", asyncRoute(async (req, res) => send(res, { success: true, ...(await dataService.addParticipant(req.body)) }, 201)));
app.put("/api/participants/:id", asyncRoute(async (req, res) => send(res, { success: true, ...(await dataService.updateParticipant(req.params.id, req.body)) })));
app.delete("/api/participants/:id", asyncRoute(async (req, res) => send(res, { success: true, ...(await dataService.deleteParticipant(req.params.id)) })));

app.get("/api/results", asyncRoute(async (req, res) => send(res, { success: true, ...(await dataService.listResults()) })));
app.post("/api/results", asyncRoute(async (req, res) => send(res, { success: true, ...(await dataService.addResult(req.body)) }, 201)));
app.put("/api/results/:id", asyncRoute(async (req, res) => send(res, { success: true, ...(await dataService.updateResult(req.params.id, req.body)) })));
app.delete("/api/results/:id", asyncRoute(async (req, res) => send(res, { success: true, ...(await dataService.deleteResult(req.params.id)) })));

app.get("/api/analytics", asyncRoute(async (req, res) => send(res, { success: true, ...(await dataService.analytics()) })));

app.use((req, res) => send(res, { success: false, data: null, error: "Route not found", source: "server" }, 404));

module.exports = { app, initDb: dataService.initDb };
