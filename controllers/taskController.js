const Task = require("../models/taskModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const authController = require("../controllers/authController");

exports.createTask = catchAsync(async (req, res, next) => {
  const newtask = await Task.create({
    name: req.body.name,
    userId: req.user.id,
  });
  res.status(201).json({
    status: "success",
    data: {
      task: newtask,
    },
  });
});

exports.getTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ userId: req.user.id });
  if (tasks.length == 0) {
    return next(new AppError("no task found for this user", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      tasks,
    },
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const updatedTask = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  // const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });

  if (!updatedTask) {
    return next(new AppError("no task found for this user with this id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      updatedTask,
    },
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return next(new AppError("no task found for this user", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
