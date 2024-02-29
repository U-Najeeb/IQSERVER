const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    passengers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    shiftTime: {
      type: String,
      required: true,
    },
    shiftDate: {
      type: String,
      required: true,
    },
    office: {
      type: String,
      required: true,
    },
    typeOfRoute: {
      type: String,
      enum: ["pickup", "drop"],
      required: true,
    },
    estimatedTime: {
      type: Number,
    },
    fuelConsumed: {
      type: Number,
      default: 0
    },
    costOfTravel: {
      type: Number,
      default: 0
    },
    routeStatus: {
      type: String,
      enum: ["notStarted", "inProgress", "completed"],
      default: "notStarted",
    },
    totalDistance: { type: Number },
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;
