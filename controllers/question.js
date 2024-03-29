const Question = require("../models/Question");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const askNewQuestions = asyncErrorWrapper(async (req, res, next) => {
  const information = req.body;

  const question = await Question.create({
    ...information,
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    data: question,
  });
});

const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {
  //TODO: Search content and users

  return res.status(200).json(res.queryResults);
});

const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {
  // const { id } = req.params;
  // const question = await Question.findById(id);

  // res.status(200).json({
  //   success: true,
  //   data: question,
  // });

  return res.status(200).json(res.queryResults);
});

const editQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  const { title, content } = req.body;
  let question = await Question.findById(id);
  (question.title = title), (question.content = content);
  question = await question.save();
  res.status(200).json({
    success: true,
    data: question,
  });
});

const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  let question = await Question.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Delete operations successfull",
  });
});

const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  let question = await Question.findById(id);

  if (question.likes.includes(req.user.id)) {
    return next(new CustomError("You already liked this question", 400));
  }
  question.likes.push(req.user.id);
  question.likeCount = question.likes.length;
  await question.save();

  res.status(200).json({
    success: true,
    message: "Liked operations successfull",
    data: question,
  });
});

const undoLikeQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  let question = await Question.findById(id);

  if (!question.likes.includes(req.user.id)) {
    return next(new CustomError("You can not  undo  this question", 400));
  }
  const index = question.likes.indexOf(req.user.id);
  question.likes.splice(index, 1);
  question.likeCount = question.likes.length;
  await question.save();

  res.status(200).json({
    success: true,
    message: "UnLiked operations successfull",
    data: question,
  });
});

module.exports = {
  askNewQuestions,
  getAllQuestions,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion,
};
