const user = require("../db/models/user");
const User = require("../db/models/user");

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

  if (!newUser) {
    return res.status(500).json({
      status: "Fail",
      message: "Failed to create the user",
    });
  }

  res.status(201).json(newUser);
};

module.exports = { signUp };
