const mongoose = require("mongoose");
const Question = require("./Question");

const { Schema } = mongoose;

const AnswerSchema = new Schema({
  content: {
    type: String,
    minlength: [20, "Please provide a content with min lenght 20"],
    required: [true, "Please provide a content"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  question: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Question",
  },
});

//Methods

AnswerSchema.methods.makeSlug = function (title) {};

//Pre Hooks

AnswerSchema.pre("save", async function (next) {
  if (!this.isModified("user")) next();
  try {
    // console.log(this.question);
    const question = await Question.findById(this.question);
    // console.log(question);
    question.answers.push(this._id);
    question.answerCount = question.answers.length;
    await question.save();
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Answer", AnswerSchema);
