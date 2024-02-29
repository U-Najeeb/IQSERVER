const { processImage } = require("../util/imageProcessing");
const User = require("../models/userModel");
const AppError = require("../util/AppError");
const { catchAsync } = require("../util/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signingFunc = (payload) => {
  return jwt.sign({ payload }, process.env.JWT_SECRET);
};

const signUp = catchAsync(async (req, res) => {
  const {
    fName,
    lName,
    email,
    password,
    address,
    role,
    department,
    phone,
    pickup,
    cabDetails,
    profilePicture,
  } = req.body;

  const processedImage = await processImage(fName, lName, profilePicture?.split(",")[1]);
  const newUser = await User.create({
    fName,
    lName,
    email,
    password,
    phone,
    address,
    department,
    role,
    pickup,
    cabDetails,
    profilePicture: processedImage,
  });
  const token = signingFunc(newUser._id);

  //   if (newUser.role === "employee") {
  //     const emplyoyee = {
  //       name: newUser.name,
  //       email: newUser.email,
  //       phone: newUser.email,
  //       address: newUser.address,
  //     };

  //     return res.status(201).json({
  //       message: "User Registered",
  //       emplyoyee,
  //       token,
  //     });
  //   }
  res.cookie("jwt", token, {
    secure: true,
    httpOnly: false,
    sameSite: "none",
  });

  res.status(201).json({
    message: "User Registered",
    newUser,
    token,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signingFunc(user._id);

  res.cookie("jwt", token, {
    secure: true,
    httpOnly: false,
    sameSite: "none",
  });

  res.status(200).json({
    message: "Logged in successfully",
    user,
    token,
  });
});

const validateToken = catchAsync(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token)
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById({ _id: decoded.payload });

  if (!currentUser) {
    return next(new AppError(`Invalid Token.`, 401));
  }
  res.status(200).json({ message: "User already logged in", currentUser });
});
module.exports = { signUp, login, validateToken };
