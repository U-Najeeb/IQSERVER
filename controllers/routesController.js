const Route = require("../models/routeModel");
const User = require("../models/userModel.js");
const AppError = require("../util/AppError.js");
const { catchAsync } = require("../util/catchAsync.js");
const timeFormatter = require("../util/TimeFormatter.js");

exports.getRoute = async function (req, res, next) {
  const { id } = req.params;
  const route = await Route.findById({ _id: id }).populate("driver");
  res.status(200).json({ message: "Routes Found", route });
};

exports.createRoute = catchAsync(async function (req, res, next) {
  const {
    driver,
    passengers,
    shiftTime,
    typeOfRoute,
    shiftDate,
    office,
    estimatedTime,
    totalDistance,
  } = req.body;
  const newRoute = await Route.create({
    driver,
    passengers,
    shiftTime,
    typeOfRoute,
    shiftDate,
    estimatedTime,
    totalDistance,
    office,
  });
  res
    .status(201)
    .json({ status: "Success", message: "Route Created!", newRoute });
});

exports.updateRoute = async function (req, res, next) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "4e406fae10msha520bc48a25c07ap1ec728jsn72c0fe096524",
      "X-RapidAPI-Host": "indian-fuel.p.rapidapi.com",
    },
  };

  // const response = await fetch('https://indian-fuel.p.rapidapi.com/fuel/data', options);
  // const data = await response.json();

  // const petrol = data?.length ? data?.filter((state) => state.city == "Srinagar")[0].petrol : 100
  const petrol = 100;

  const { id } = req.params;

  const { fuelConsumed } = req.body;
  let costOfTravel;
  costOfTravel = fuelConsumed > 0 ? Math.round(fuelConsumed * petrol) : 0;

  console.log(costOfTravel);

  const route = await Route.findByIdAndUpdate(
    { _id: id },
    { ...req.body, costOfTravel },
    {
      new: true,
      runValidators: true,
    }
  ).populate("passengers");
  if (!route) {
    return res.status(404).json({ msg: "No route found!" });
  }
  res.status(200).json({ msg: "Route Updated!", route });
};

exports.deleteRoute = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  await Route.findByIdAndDelete({ _id: id });
  res.status(204).json({ message: "Route Deleted!" });
});

exports.getAllRoutes = catchAsync(async function (req, res, next) {
  const allRoutes = await Route.find({}).populate("driver");
  res.status(200).json({
    message: "All Routes Found",
    count: allRoutes.length,
    allRoutes,
  });
});

exports.getAllNonActiveRoutes = catchAsync(async function (req, res, next) {
  const nonActiveroutes = await Route.find({
    routeStatus: "notStarted",
  }).populate("driver");
  res.status(200).json({
    message: "All Non Active Routes Found",
    count: nonActiveroutes.length,
    nonActiveroutes,
  });
});

exports.getRosteredPassenger = catchAsync(async function (req, res, next) {
  const aggregateData = await Route.aggregate([
    {
      $unwind: "$passengers",
    },
    {
      $group: {
        _id: "$passengers",
      },
    },
  ]);
  const passengersIDS = aggregateData.map((passenger) => passenger._id);

  const passengers = await User.find({
    _id: { $in: passengersIDS },
    role: { $ne: "driver" },
  })
    .select("-cabDetails")
    .sort("fName");
  res.status(200).json({
    message: "Passenger Roastered!",
    totalRoastered: passengers.length,
    roasterd: passengers,
  });
});

exports.pendingPassengers = catchAsync(async function (req, res, next) {
  const aggregateData = await Route.aggregate([
    {
      $unwind: "$passengers",
    },
    {
      $group: {
        _id: "$passengers",
      },
    },
  ]);

  const passengersIDS = aggregateData.map((passenger) => passenger._id);

  const pendingPassengers = await User.find({
    _id: { $nin: passengersIDS },
    role: { $ne: "driver" },
  }).select("-cabDetails");
  res.status(200).json({
    message: "Pending Passengers!",
    totalNonRoastered: pendingPassengers.length,
    pendingPassengers,
  });
});

exports.getRouteByDriver = catchAsync(async function (req, res, next) {
  const { did } = req.params;
  const routes = await Route.find({ driver: did }).populate("passengers");
  res.status(200).json({ message: "Routes Found!", routes });
});

exports.getEmployeeRoute = catchAsync(async function (req, res, next) {
  const { eid } = req.params;

  const formattedTime = timeFormatter(new Date());

  const routes = await Route.find({
    routeStatus: "notStarted",
    passengers: { $in: eid },
    shiftTime: { $gt: formattedTime },
  })
    .sort({ shiftTime: 1 })
    .limit(1)
    .populate({
      path: "passengers",
      select: "-cabDetails",
    })
    .populate({
      path: "driver",
      select: "cabDetails fName lName phone profilePicture",
    });

  res
    .status(200)
    .json({ message: "Employee Route Found!", count: routes.length, routes });
});

// exports.cancelCab = catchAsync(async (req, res, next) => {
//   const user = req.user;
//   const formattedTime = timeFormatter(new Date());
//   let currentUserRoute = await Route.find({ passengers: user._id });
//   currentUserRoute.filter((route) => route.shiftTime >= formattedTime);

//   console.log(currentUserRoute);
//   // const indexToRemove = currentUserRoute[0].passengers.findIndex(
//   //   (passenger) => passenger._id === user._id
//   // );

//   // if (indexToRemove !== -1) {
//   //   const removedUser = currentUserRoute[0].passengers.splice(
//   //     indexToRemove,
//   //     1
//   //   )[0];
//   //   console.log(removedUser);
//   //   const newRoute = await Route.findByIdAndUpdate(
//   //     currentUserRoute[0]._id,
//   //     { passengers: currentUserRoute[0].passengers },
//   //     {
//   //       new: true,
//   //       runValidators: true,
//   //     }
//   //   );
//   //   console.log(newRoute);
//   // } else {
//   //   console.log("User not found in passengers array.");
//   // }

//   // console.log(updatedPassengers);
// });
