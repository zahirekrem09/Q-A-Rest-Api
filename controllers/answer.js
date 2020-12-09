const Question = require("../models/Question");
const Answer = require("../models/Answer");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const addNewAnswer = asyncErrorWrapper(async (req, res, next) => {
  const { question_id } = req.params;
  //   console.log(question_id);

  const userId = req.user.id;

  const information = req.body;

  const answer = await Answer.create({
    ...information,
    user: userId,
    question: question_id,
  });

  return res.status(200).json({
    success: true,
    data: answer,
  });
});

module.exports = {
  addNewAnswer,
};
