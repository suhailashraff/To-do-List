const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(authController.protect, taskController.getTasks)
  .post(authController.protect, taskController.createTask);
router
  .route("/:id")
  .patch(authController.protect, taskController.updateTask)
  .delete(
    authController.protect,
    authController.restrictTo("user"),
    taskController.deleteTask
  );

module.exports = router;
