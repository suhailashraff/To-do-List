const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const userRouter = require("./routes/userRouter");
const taskRouter = require("./routes/taskRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

mongoose
  .connect("mongodb://0.0.0.0:27017/users")
  .then(() => console.log("DB connection successful"));

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

module.exports = app;
