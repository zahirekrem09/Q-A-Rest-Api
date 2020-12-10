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
  let query = Question.find();
  const populate = true;
  const populateValue = {
    path: "user",
    select: "name profile_image",
  };
  if (req.query.search) {
    const searchObject = {};

    const regex = new RegExp(req.query.search, "i");

    searchObject["title"] = regex;
    query = query.where(searchObject);
  }

  if (populate) {
    query = query.populate(populateValue);
  }

  //paginate
  const total = await Question.countDocuments();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit; // end page
  const pagination = {};

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    };
  }
  query = query.skip(startIndex).limit(limit);

  const questions = await query;

  // filter search TODO:

  //TODO: Search content and users

  res.status(200).json({
    success: true,
    data: questions,
    count: questions.length,
    pagination: pagination,
  });
});

const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const question = await Question.findById(id);

  res.status(200).json({
    success: true,
    data: question,
  });
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
