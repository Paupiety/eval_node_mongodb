const express = require("express");
const router = express.Router();
module.exports = router;

const ToDoList = require("../models/ToDoList");
const Task = require("../models/Task");
const Priority = require("../enums/priorityEnum");

//TodoList

const createTasks = async (req, res, tasks) => {
  try {
    const findtoDoList = await ToDoList.findOne({
      _id: req.params.id,
    });
    if (!!findtoDoList) {
      const newTasks = await Task.insertMany(
        tasks.map((task) => ({
          title: task.title,
          description: task.description ?? "",
          done: task.done ?? false,
          dueDate: task.dueDate,
          priority: task.priority ?? "",
          toDoListId: req.params.id,
        }))
      );
      await ToDoList.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        { $push: { tasks: { $each: newTasks.map((task) => task._id) } } }
      );
      return res.status(201).json({ message: "toDoList crée avec succés" });
    } else {
      return res
        .status(400)
        .json({ message: "La toDoList n'a pas été trouvé" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
};

router.post("/", async (req, res) => {
  try {
    const { name, tasks } = req.body;
    console.log("TASKS", tasks);
    if (name) {
      await ToDoList.create({ name: name, createdAt: Date.now() });
      if (tasks) {
        return createTasks(req, res, tasks);
      }
    } else {
      return res
        .status(400)
        .json({ message: "Le nom de la tâche est obligatoire" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const toDoLists = await ToDoList.find();
    return res.status(200).json(toDoLists);
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.get("/stats", async (req, res) => {
  try {
    const tasksByPriority = await Task.find().sort({ priority: 1 });
    res.status(200).json({ tasksByPriority });
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const toDoList = await ToDoList.findById(req.params.id);
    if (!!toDoList) {
      return res.status(200).json(toDoList);
    } else {
      return res
        .status(400)
        .json({ message: "La doToList n'a pas été trouvé" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    if (name) {
      const toDoList = await ToDoList.findOne({ _id: req.params.id });
      if (!!toDoList) {
        await ToDoList.updateOne({
          name: name,
        });
        return res.status(200).json({
          message: "La toDoList a bien été modifiée",
          todoList: toDoList.toJSON(),
        });
      } else {
        return res
          .status(400)
          .json({ message: "La doToList n'a pas été trouvé" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Le nom de la toDoList est obligatoire" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Task.deleteMany({ toDoListId: req.params.id });
    await ToDoList.findOneAndDelete({ _id: req.params.id });
    return res
      .status(400)
      .json({ message: "La toDoList a bien été supprimée" });
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

//Tasks

router.post("/:id/tasks", async (req, res) => {
  try {
    const { title, description, done, dueDate, priority } = req.body;
    if (title) {
      if (
        priority &&
        Object.values(Priority).includes(priority.toLowerCase())
      ) {
        const findtoDoList = await ToDoList.findOne({
          _id: req.params.id,
        });
        if (!!findtoDoList) {
          const newTask = await Task.create({
            title: title,
            description: description ?? "",
            done: done ?? false,
            dueDate: dueDate,
            priority: priority ?? "",
            toDoListId: req.params.id,
          });
          await ToDoList.findOneAndUpdate(
            {
              _id: req.params.id,
            },
            { $push: { tasks: newTask._id } }
          );
          return res.status(201).json({
            message: "La tâche a bien été créée",
            toDoList: findtoDoList,
            task: newTask,
          });
        }
      } else {
        return res.status(400).json({
          message: "La priorité ne peut ête que low, medium ou hight",
        });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Le titre ne peut pas être vide" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.put("/:id/tasks/:taskId", async (req, res) => {
  try {
    const { title, description, done, dueDate, priority } = req.body;
    if (title) {
      const toDoList = await ToDoList.find({ _id: req.params.id });
      if (!!toDoList) {
        const taskInToDoList = await Task.findOne({
          _id: req.params.taskId,
          toDoListId: req.params.id,
        });
        if (!!taskInToDoList) {
          const updateFields = {};
          updateFields.title = title;
          if (description) updateFields.description = description;
          if (done !== undefined) updateFields.done = done;
          if (dueDate) updateFields.dueDate = dueDate;
          if (priority && Object.values(Priority).includes(priority)) {
            updateFields.priority = priority;
          } else {
            return res.status(400).json({
              message: "La priorité ne peut ête que low, medium ou hight",
            });
          }
          await Task.findOneAndUpdate(
            {
              _id: req.params.taskId,
            },
            { $set: updateFields }
          );

          return res.status(200).json({
            message: "La tâche a bien été mise à jour",
            task: await Task.findOne({ _id: req.params.taskId }),
          });
        } else {
          return res
            .status(400)
            .json({ message: "La tâche n'a pas été trouvée" });
        }
      } else {
        return res
          .status(400)
          .json({ message: "La toDoList n'a pas été trouvée" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Le titre ne peut pas être vide" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.delete("/:id/tasks/:taskId", async (req, res) => {
  try {
    await ToDoList.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { tasks: req.params.taskId } }
    );
    await Task.findOneAndDelete({ _id: req.params.taskId });
    return res.status(200).json({ message: "La tâche a bien été supprimée" });
  } catch (e) {
    return res.status(500).json(e.message);
  }
});
