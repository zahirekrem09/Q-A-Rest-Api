const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide a email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    minlength: [6, "Please provide a password with min lenght 6"],
    required: [true, "Please provide a password"],
    select: false,
  },

  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
  },
  about: {
    type: String,
  },
  place: {
    type: String,
  },
  website: {
    type: String,
  },

  profile_image: {
    type: String,
    default: "default.jpg",
  },

  blocked: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", function (next) {
  //code write(pass hash)
  // console.log(this);

  //update for user
  if (!this.isModified("password")) {
    next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      // Store hash in your password DB.
      if (err) next(err);
      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);
