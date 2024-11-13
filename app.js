require("dotenv").config({ path: `${process.cwd()}/.env` });

const express = require("express");
const PORT = process.env.APP_PORT || 4000;

const authRoute = require("./routes/authRoute");
const projectRoute = require("./routes/projectRoute");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

const app = express();

app.use(express.json());

// all routes will be here
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/project", projectRoute);

// when there is no route match
app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log("Running on Port: ", PORT);
});
