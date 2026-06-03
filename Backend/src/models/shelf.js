import mongoose from "mongoose";

const shelfSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    visibility: { type: String, enum: ["private", "friends", "public"], default: "private" }
  },
  { timestamps: true }
);

export const Shelf = mongoose.model("Shelf", shelfSchema);
