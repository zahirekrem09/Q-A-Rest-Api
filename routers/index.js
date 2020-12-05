const express = require("express");
const question = require("./question");
const auth = require("./auth");

const router = express.Router();

router.use("/questions", question);
router.use("/auth", auth);

// app.use("/api/questions", question);
// app.use("/api/auth", auth);

module.exports = router;
