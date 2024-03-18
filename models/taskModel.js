const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
  },
});
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
