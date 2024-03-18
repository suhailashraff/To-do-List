const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  phoneNumber: {
    type: String,
    // required: true,
    validate: [validator.isMobilePhone, "please enter a valid number"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },

      message: "password are not same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordRestExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

usersSchema.pre("save", async function (next) {
  //only run this function if password is modified
  if (!this.isModified("password")) return next();

  //hash the password with cost of 10
  this.password = await bcrypt.hash(this.password, 10);

  //delete confirmpassword field
  this.passwordConfirm = undefined;
  next();
});

usersSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

usersSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

usersSchema.methods.correctPassword = async function (
  candidatePassword,
  userpassword
) {
  return await bcrypt.compare(candidatePassword, userpassword);
};

usersSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changeTimestamp;
  }
  //false means not changed
  return false;
};

usersSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordRestExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", usersSchema);
module.exports = User;
