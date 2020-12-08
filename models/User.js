const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Schema } = mongoose;
const Question = require("./Question");

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
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
});

//Methods
UserSchema.methods.generateJwtFromUser = function () {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
  const payload = {
    id: this.id,
    name: this.name,
  };
  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE,
  });

  return token;
};

UserSchema.methods.getResetPasswordToken = function () {
  const randomHexString = crypto.randomBytes(15).toString("hex");
  // console.log(randomHexString);
  const { RESET_PASSWORD_EXPIRE } = process.env;
  const resetPassToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");

  this.resetPasswordToken = resetPassToken;
  this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);
};

//Pre Hooks
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

//Post Hooks
// User delete olunce Questionlarda delete olsun
UserSchema.post("remove", async function () {
  await Question.deleteMany({
    user: this._id,
  });
});

module.exports = mongoose.model("User", UserSchema);
