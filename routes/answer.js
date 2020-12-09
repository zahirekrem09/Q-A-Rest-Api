const express = require("express");
const getAccessToRoute = require("../middlewares/auth/getAccessToRoute");
const checkAnswerQuestionExist = require("../middlewares/db/checkAnswerQuestionExist");
const {
  addNewAnswer,
  getAllAnswers,
  getSingleAnswer,
} = require("../controllers/answer");

// mergePrams öncekş route deki paramsları getirmek için
const router = express.Router({ mergeParams: true });
// /api/question/question_id/answers

router.get("/", getAllAnswers);
router.post("/", getAccessToRoute, addNewAnswer);
router.get("/:answer_id", checkAnswerQuestionExist, getSingleAnswer);

module.exports = router;
