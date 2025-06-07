import Task from "../models/Task.js";

// GET all tasks for user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks." });
  }
};

// POST create task
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      color,
      date,
      repeat,
      tags
    } = req.body;

    const newTask = new Task({
      title,
      description,
      status,
      color,
      date,
      repeat,
      tags,
      user: req.user,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: "Failed to create task." });
  }
};

// PUT update task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    status,
    color,
    date,
    repeat,
    tags
  } = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user },
      {
        title,
        description,
        status,
        color,
        date,
        repeat,
        tags,
      },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "Failed to update task." });
  }
};

// DELETE task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.user });

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task." });
  }
};