import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    googleBooksId: { type: String, index: true },
    title: { type: String, required: true },
    authors: [String],
    description: String,
    categories: [String],
    thumbnail: String,
    rating: Number,
    previewLink: String,
    language: String
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
