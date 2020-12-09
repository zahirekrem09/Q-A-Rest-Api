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

const getAllAnswers = asyncErrorWrapper(async (req, res, next) => {
  const { question_id } = req.params;
  const question = await Question.findById(question_id).populate("answers");

  //   console.log(question);
  const { answers } = question;

  return res.status(200).json({
    success: true,
    data: answers,
    count: answers.length,
  });
});

const getSingleAnswer = asyncErrorWrapper(async (req, res, next) => {
  const { answer_id } = req.params;

  const answer = await Answer.findById(answer_id)
    .populate({
      path: "question",
      select: "title",
    })
    .populate({
      path: "user",
      select: "name profile_image",
    });
  return res.status(200).json({
    success: true,
    data: answer,
  });
});

const editAnswer = asyncErrorWrapper(async (req, res, next) => {
  const { answer_id } = req.params;

  const { content } = req.body;

  let answer = await Answer.findById(answer_id);
  answer.content = content;

  await answer.save();
  return res.status(200).json({
    success: true,
    data: answer,
  });
});

const deleteAnswer = asyncErrorWrapper(async (req, res, next) => {
  const { answer_id } = req.params;
  const { question_id } = req.params;

  await Answer.findByIdAndRemove(answer_id);
  const question = await Question.findById(question_id);
  //   const filterAnswers = question.answers.filter(
  //     (answer) => answer === answer_id
  //   );
  question.answers.splice(question.answers.indexOf(answer_id), 1);

  await question.save();

  return res.status(200).json({
    success: true,
    message: "Amswer delete succesfull",
    data: question.answers,
  });
});

const likeAnswer = asyncErrorWrapper(async (req, res, next) => {
  const { answer_id } = req.params;

  let answer = await Answer.findById(answer_id);

  if (answer.likes.includes(req.user.id)) {
    return next(new CustomError("You already liked this answer", 400));
  }
  answer.likes.push(req.user.id);
  await answer.save();

  res.status(200).json({
    success: true,
    message: "Liked operations successfull",
    data: answer,
  });
});

const undoLikeAnswer = asyncErrorWrapper(async (req, res, next) => {
  const { answer_id } = req.params;

  let answer = await Answer.findById(answer_id);

  if (!answer.likes.includes(req.user.id)) {
    return next(new CustomError("You can not  undo  this answer", 400));
  }
  const index = answer.likes.indexOf(req.user.id);
  answer.likes.splice(index, 1);
  await answer.save();

  res.status(200).json({
    success: true,
    message: "UnLiked operations successfull",
    data: answer,
  });
});

module.exports = {
  addNewAnswer,
  getAllAnswers,
  getSingleAnswer,
  editAnswer,
  deleteAnswer,
  likeAnswer,
  undoLikeAnswer,
};
