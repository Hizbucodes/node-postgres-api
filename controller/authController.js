const signUp = (req, res, next) => {
  res.json({
    status: "Success",
    message: "Signup route are working",
  });
};

module.exports = { signUp };
