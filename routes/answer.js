const express = require("express");
const getAccessToRoute = require("../middlewares/auth/getAccessToRoute");
const checkAnswerQuestionExist = require("../middlewares/db/checkAnswerQuestionExist");
const getAnswerOwnerAccess = require("../middlewares/auth/getAnswerOwnerAccess");
const {
  addNewAnswer,
  getAllAnswers,
  getSingleAnswer,
  editAnswer,
  deleteAnswer,
  undoLikeAnswer,
  likeAnswer,
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
router.delete(
  "/:answer_id/delete",
  checkAnswerQuestionExist,
  getAccessToRoute,
  getAnswerOwnerAccess,
  deleteAnswer
);

router.get(
  "/:answer_id/like",
  [checkAnswerQuestionExist, getAccessToRoute],
  likeAnswer
);
router.get(
  "/:answer_id/undo_like",
  [checkAnswerQuestionExist, getAccessToRoute],
  undoLikeAnswer
);

module.exports = router;
