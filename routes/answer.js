const express = require("express");
const getAccessToRoute = require("../middlewares/auth/getAccessToRoute");
const { addNewAnswer } = require("../controllers/answer");

// mergePrams öncekş route deki paramsları getirmek için
const router = express.Router({ mergeParams: true });
// /api/question/question_id/answers

// router.get("/");
router.post("/", getAccessToRoute, addNewAnswer);

module.exports = router;
