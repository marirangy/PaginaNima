import mongoose from "mongoose";

const testimonioSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  content: { type: [String], required: true }, 
}, { collection: "testimonios", timestamps: true });

export default mongoose.model("Testimonio", testimonioSchema);