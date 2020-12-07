const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
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
//Express Body Parser midd.
app.use(express.json());

const PORT = process.env.PORT;

// Routers Middelware
// app.use("/api/questions", question);
// app.use("/api/auth", auth);

app.use("/api", routers);

//Error Handler

app.use(customErrorHandler);

//Static Files

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`App started on ${PORT} - ${process.env.NODE_ENV}`);
});
