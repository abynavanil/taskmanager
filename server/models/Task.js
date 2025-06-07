import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  color: {
    type: String,
    default: "#000000", // default color
  },
  date: {
    type: String, // ISO string (e.g., "2025-06-05")
    required: true,
  },
  repeat: {
    enabled: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },
    days: {
      type: [String], // Optional: For weekly repeat like ["Mon", "Wed"]
      default: [],
    }
  },
  tags: {
    type: [String],
    default: [],
  }
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);