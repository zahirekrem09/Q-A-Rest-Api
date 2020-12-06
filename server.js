const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./helpers/db/connectDatabase");

const routers = require("./routes");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");

//Env Variables
dotenv.config({
  path: "./config/env/config.env",
});

//db Connect

connectDatabase();

const app = express();

const PORT = process.env.PORT;

// Routers Middelware
// app.use("/api/questions", question);
// app.use("/api/auth", auth);

app.use("/api", routers);

//Error Handler

app.use(customErrorHandler);

app.listen(PORT, () => {
  console.log(`App started on ${PORT} - ${process.env.NODE_ENV}`);
});
