const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String },
  done: { type: Boolean },
  dueDate: { type: Date, default: Date.now() },
  createdAt: { type: Date, default: Date.now() },
  priority: { type: String },
  toDoListId: { type: mongoose.Schema.Types.ObjectId, ref: "ToDoList" },
});

module.exports = mongoose.model("Task", taskSchema);
