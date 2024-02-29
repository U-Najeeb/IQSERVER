const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: [true, "Please provide your first name"],
    },
    lName: {
      type: String,
      required: [true, "Please provide your last name"],
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number"],
      minlength: 10,
      maxlength: 13,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    role: {
      type: String,
      enum: ["admin", "employee", "driver"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    department: {
      type: String,
      default: null,
    },
    pickup: [
      { type: Number, default: null },
      { type: Number, default: null },
    ],
    cabDetails: {
      cabNumber: {
        type: String,
        default: "",
        unique: true,
      },
      seatingCapacity: {
        type: Number,
        default: null,
      },
      numberPlate: {
        type: String,
        default: "",
        unique: true,
      },
      model: {
        type: String,
        default: "",
      },
      color: {
        type: String,
        default: "",
      },
    },
    address: {
      type: String,
      required: [true, "Please provide your address"],
    },
    cancelCab: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.checkPassword = async function (
  passwordFromBody,
  passwordInDb
) {
  return await bcrypt.compare(passwordFromBody, passwordInDb);
};
const User = mongoose.model("User", userSchema);

module.exports = User;
