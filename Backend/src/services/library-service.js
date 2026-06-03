import { Book } from "../models/book.js";
import { Note } from "../models/note.js";
import { Shelf } from "../models/shelf.js";

export async function getDashboard(userId) {
  const [shelves, notes] = await Promise.all([
    Shelf.find({ user: userId }).populate("books").lean(),
    Note.find({ user: userId }).sort({ createdAt: -1 }).limit(10).lean()
  ]);

  return {
    streak: 7,
    goalProgress: 82,
    achievements: ["Nova Reader", "Night Focus", "Quote Keeper"],
    shelves,
    notes
  };
}

export async function saveBook(book) {
  return Book.findOneAndUpdate({ googleBooksId: book.id }, book, { upsert: true, new: true });
}
