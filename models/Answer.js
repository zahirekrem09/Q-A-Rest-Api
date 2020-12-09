const mongoose = require("mongoose");

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

AnswerSchema.pre("save", function (next) {});

module.exports = mongoose.model("Answer", AnswerSchema);
