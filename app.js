const express = require("express");
const apiRouter = require("./routers/api.router");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index");
const app = express();

app.use("/api", apiRouter);

app.all("*", () => {
  console.log("request made!");
});

// error handling
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
