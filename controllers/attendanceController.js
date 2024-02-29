const Attendance = require("../models/attendanceModel.js");
const { catchAsync } = require("../util/catchAsync.js");
const AppError = require("../util/AppError.js");

// Creating attendance
const createAttendance = catchAsync(async (req, res) => {
  const attendanceData = req.body;
  const attendance = await Attendance.create(attendanceData);
  res.status(201).json({ attendance, message: "success" });
});

// Getting present employees
const getPresentEmployees = catchAsync(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const presentEmployees = await Attendance.find({
    isPresent: true,
    createdAt: { $gte: today },
  }).populate(["Driver", "ofEmployee", "ofRoute"]);

  res.status(200).json({ message: "Present Employees", presentEmployees });
});

// Getting absent employees
const getAbsentEmployees = catchAsync(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const absentEmployees = await Attendance.find({
    isPresent: false,
    createdAt: { $gte: today },
  }).populate(["Driver", "ofEmployee", "ofRoute"]);
  res.status(200).json({ message: "Absent Employees", absentEmployees });
});

const getAttendanceByRoute = catchAsync(async (req, res, next) => {
  const { rid } = req.params;

  const passengers = await Attendance.find({ ofRoute: rid }).populate([
    "ofEmployee",
  ]);

  res.status(200).json({ message: "Route Attendance", count: passengers.length, passengers });
});

module.exports = {
  createAttendance,
  getPresentEmployees,
  getAbsentEmployees,
  getAttendanceByRoute,
};
