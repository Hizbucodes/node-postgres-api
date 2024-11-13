const User = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const user = require("../db/models/user");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signUp = catchAsync(async (req, res, next) => {
  const body = req.body;

  if (!["SELLER", "BUYER"].includes(body.role)) {
    throw new AppError("Invalid User Role", 400);
  }

  const newUser = await User.create({
    role: body.role,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  if (!newUser) {
    return next(new AppError("Failed to create the user", 400));
  }

  const result = newUser.toJSON();

  delete result.deletedAt;
  delete result.password;

  result.token = generateToken({
    id: result.id,
    email: result.email,
  });

  res.status(201).json(result);
});

const signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError("Please provide email and password to proceed", 400)
    );
  }

  const result = await User.findOne({ where: { email } });

  if (!result || !(await bcrypt.compare(password, result.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = generateToken({
    id: result.id,
    email: result.email,
  });

  return res.json({
    status: "Success",
    token,
  });
});

const authentication = catchAsync(async (req, res, next) => {
  // 1. get the token from headers
  let idToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
  }

  if (!idToken) {
    return next(new AppError("Please login to get access", 401));
  }
  // 2. token verification
  const tokenDetails = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
  // 3. get the user details from the database and add to req object
  const freshUser = await user.findByPk(tokenDetails.id);

  if (!freshUser) {
    return next(new AppError("User no lobger exists", 400));
  }

  req.user = freshUser;

  return next();
});

module.exports = { signUp, signIn, authentication };
