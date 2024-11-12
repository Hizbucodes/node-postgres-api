const User = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signUp = async (req, res, next) => {
  const body = req.body;

  if (!["SELLER", "BUYER"].includes(body.role)) {
    return res.status(400).json({
      status: "Fail",
      message: "Invalid User Role",
    });
  }

  const newUser = await User.create({
    role: body.role,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  const result = newUser.toJSON();

  delete result.deletedAt;
  delete result.password;

  result.token = generateToken({
    id: result.id,
    email: result.email,
  });

  if (!result) {
    return res.status(500).json({
      status: "Fail",
      message: "Failed to create the user",
    });
  }

  res.status(201).json(result);
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "Fail",
      message: "Please provide email and password to proceed",
    });
  }

  const result = await User.findOne({ where: { email } });

  if (!result || !(await bcrypt.compare(password, result.password))) {
    return res.status(401).json({
      status: "Fail",
      message: "Incorrect email or password",
    });
  }

  const token = generateToken({
    id: result.id,
    email: result.email,
  });

  return res.json({
    status: "Success",
    token,
  });
};

module.exports = { signUp, signIn };
