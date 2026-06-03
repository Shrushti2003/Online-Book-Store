import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, index: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatarUrl: String,
    shelves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shelf" }],
    wishlist: [
      {
        id: String,
        title: String,
        author: String,
        genre: String,
        thumbnail: String,
        description: String,
        rating: Number,
        previewLink: String,
        savedAt: { type: Date, default: Date.now }
      }
    ],
    readingHistory: [
      {
        id: String,
        title: String,
        author: String,
        genre: String,
        thumbnail: String,
        description: String,
        rating: Number,
        viewedAt: { type: Date, default: Date.now }
      }
    ],
    readingStreak: { type: Number, default: 0 },
    preferences: {
      genres: [String],
      mood: String,
      language: { type: String, default: "en" }
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
