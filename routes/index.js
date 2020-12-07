const express = require("express");
const question = require("./question");
const auth = require("./auth");
const user = require("./user");
const admin = require("./admin");

const router = express.Router();

router.use("/questions", question);
router.use("/auth", auth);
router.use("/users", user);
router.use("/admin", admin);

// app.use("/api/questions", question);
// app.use("/api/auth", auth);

module.exports = router;
