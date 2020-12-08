const express = require("express");
const getAccessToRoute = require("../middlewares/auth/getAccessToRoute");

const { askNewQuestions, getAllQuestions } = require("../controllers/question");

const router = express.Router();
// /api/question
router.get("/", getAllQuestions);
router.post("/ask", getAccessToRoute, askNewQuestions);

module.exports = router;
