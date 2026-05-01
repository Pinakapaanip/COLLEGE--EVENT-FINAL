const { app, initDb } = require("./app");

const port = process.env.PORT || 10000;

initDb().finally(() => {
  app.listen(port, () => {
    console.log(`College Event Portal API running on port ${port}`);
  });
});
