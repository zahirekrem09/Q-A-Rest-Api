const express = require("express");
const getAccessToRoute = require("../middlewares/auth/getAccessToRoute");
const checkAnswerQuestionExist = require("../middlewares/db/checkAnswerQuestionExist");
const getAnswerOwnerAccess = require("../middlewares/auth/getAnswerOwnerAccess");
const {
  addNewAnswer,
  getAllAnswers,
  getSingleAnswer,
  editAnswer,
} = require("../controllers/answer");

// mergePrams öncekş route deki paramsları getirmek için
const router = express.Router({ mergeParams: true });
// /api/question/question_id/answers

router.get("/", getAllAnswers);
router.post("/", getAccessToRoute, addNewAnswer);
router.get("/:answer_id", checkAnswerQuestionExist, getSingleAnswer);
router.put(
  "/:answer_id/edit",
  checkAnswerQuestionExist,
  getAccessToRoute,
  getAnswerOwnerAccess,
  editAnswer
);

module.exports = router;
