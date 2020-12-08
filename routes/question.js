const express = require("express");
const getAccessToRoute = require("../middlewares/auth/getAccessToRoute");
const getQuestionOwnerAccess = require("../middlewares/auth/getQuestionOwnerAccess");
const checkQuestionExist = require("../middlewares/db/checkQuestionExist");

const {
  askNewQuestions,
  getAllQuestions,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
} = require("../controllers/question");

const router = express.Router();
// /api/question
router.get("/", getAllQuestions);
router.post("/ask", getAccessToRoute, askNewQuestions);
router.get("/:id", checkQuestionExist, getSingleQuestion);
router.put(
  "/:id/edit",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  editQuestion
);
router.delete(
  "/:id/delete",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  deleteQuestion
);

router.get("/:id/like", [getAccessToRoute, checkQuestionExist], likeQuestion);

module.exports = router;
