const express = require("express");
const getAccessToRoute = require("../middlewares/auth/getAccessToRoute");
const checkQuestionExist = require("../middlewares/db/checkQuestionExist");

const {
  askNewQuestions,
  getAllQuestions,
  getSingleQuestion,
} = require("../controllers/question");

const router = express.Router();
// /api/question
router.get("/", getAllQuestions);
router.post("/ask", getAccessToRoute, askNewQuestions);
router.get("/:id", checkQuestionExist, getSingleQuestion);

module.exports = router;
