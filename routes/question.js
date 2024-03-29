const express = require("express");
const Question = require("../models/Question");
const answer = require("./answer");
const questionQuery = require("../middlewares/query/questionQuery");
const answerQuery = require("../middlewares/query/answerQuery");
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
  undoLikeQuestion,
} = require("../controllers/question");

const router = express.Router();
// /api/question
router.get(
  "/",
  questionQuery(Question, {
    population: {
      path: "user",
      select: "name profil_image",
    },
  }),
  getAllQuestions
);
router.post("/ask", getAccessToRoute, askNewQuestions);
router.get(
  "/:id",
  checkQuestionExist,
  answerQuery(Question, {
    population: [
      {
        path: "user",
        select: "name profil_image",
      },
      {
        path: "answers",
        select: "content",
      },
    ],
  }),
  getSingleQuestion
);
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
router.get(
  "/:id/undo_like",
  [getAccessToRoute, checkQuestionExist],
  undoLikeQuestion
);

router.use("/:question_id/answers", checkQuestionExist, answer);

module.exports = router;
