const mongoose = require("mongoose");

const { Schema } = mongoose;

const QuestionSchema = new Schema({
  title: {
    type: String,
    minlength: [10, "Please provide a title with min lenght 10"],
    required: [true, "Please provide a title"],
    unique: true,
  },

  content: {
    type: String,
    minlength: [20, "Please provide a content with min lenght 20"],
    required: [true, "Please provide a content"],
  },
  slug: {
    type: String,
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
});

//Methods

//Pre Hooks

module.exports = mongoose.model("Question", QuestionSchema);
