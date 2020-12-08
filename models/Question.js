const mongoose = require("mongoose");
const slugify = require("slugify");

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
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});

//Methods

QuestionSchema.methods.makeSlug = function (title) {
  return slugify(title, {
    replacement: "-", // replace spaces with replacement character, defaults to `-`
    remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    //   strict: false, // strip special characters except replacement, defaults to `false`
    //   locale: "vi", // language code of the locale to use
  });
};

//Pre Hooks

QuestionSchema.pre("save", function (next) {
  if (!this.isModified("title")) {
    next();
  }
  this.slug = this.makeSlug(this.title);
  next();
});

module.exports = mongoose.model("Question", QuestionSchema);
