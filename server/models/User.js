import mongoose from "mongoose";
// user model schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, 
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
});

export default mongoose.model("User", userSchema);