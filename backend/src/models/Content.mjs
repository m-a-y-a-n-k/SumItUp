import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  data: String,
});

export default mongoose.model("Content", contentSchema);
