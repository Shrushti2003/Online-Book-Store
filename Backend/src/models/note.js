import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    quote: String,
    note: String,
    page: Number,
    color: { type: String, default: "#FF4ECD" }
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
