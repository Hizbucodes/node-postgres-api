require("dotenv").config({ path: `${process.cwd()}/.env` });

const express = require("express");
const PORT = process.env.APP_PORT || 4000;

const authRoute = require("./routes/authRoute");

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "First Rest API in NodeJS",
  });
});

// all routes will be here
app.use("/api/v1/auth", authRoute);

// when there is no route match
app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "Fail",
    message: "Route not Found",
  });
});

app.listen(PORT, () => {
  console.log("Running on Port: ", PORT);
});
