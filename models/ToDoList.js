const mongoose = require("mongoose");
const toDoListSchema = new mongoose.Schema({
  name: { type: String },
  createdAt: { type: Date },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

module.exports = mongoose.model("ToDoList", toDoListSchema);
