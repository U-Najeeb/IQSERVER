const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    ofEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ofRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
    isPresent: {
      type: Boolean,
      default: false,
    },
    Driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
