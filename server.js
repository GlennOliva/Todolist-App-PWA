import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection with Error Handling
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
connectDB();

// Task Schema
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
}, { timestamps: true }); // Add timestamps for createdAt & updatedAt

const Task = mongoose.model("Task", taskSchema);

// Middleware to Validate ObjectId
const isValidObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid Task ID" });
  }
  next();
};

// 🟢 Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }); // Sort newest first
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// 🟢 Add a task
app.post("/tasks", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Task text cannot be empty" });
    }

    const newTask = new Task({ text });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Error adding task" });
  }
});

// 🟢 Update a task
app.put("/tasks/:id", isValidObjectId, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Task text cannot be empty" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Error updating task" });
  }
});

// 🟢 Delete a task
app.delete("/tasks/:id", isValidObjectId, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted", deletedTask: task });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
});


  
  
  
  

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
