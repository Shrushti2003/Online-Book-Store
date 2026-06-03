import { asyncHandler } from "../utils/async-handler.js";
import { getDashboard } from "../services/library-service.js";
import { User } from "../models/user.js";

export const dashboard = asyncHandler(async (req, res) => {
  const userId = req.user?.sub ?? req.user?.id;
  const data = await getDashboard(userId);
  res.json(data);
});

export const readingProgress = asyncHandler(async (_req, res) => {
  res.json({
    message: "Continue where your imagination paused.",
    progress: [
      { bookId: "starlit-archive", percentage: 72 },
      { bookId: "glass-kingdoms", percentage: 38 }
    ]
  });
});

function publicBook(payload) {
  return {
    id: payload.id,
    title: payload.title,
    author: payload.author,
    genre: payload.genre,
    thumbnail: payload.thumbnail,
    description: payload.description,
    rating: payload.rating,
    previewLink: payload.previewLink
  };
}

async function getUser(req) {
  const email = req.user?.email ?? `${req.user?.sub ?? req.user?.id}@lumibooks.local`;
  return User.findOneAndUpdate(
    { email },
    { $setOnInsert: { email, name: req.user?.name ?? "Lumi Reader", clerkId: req.user?.sub } },
    { upsert: true, new: true }
  );
}

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await getUser(req);
  res.json({ books: user.wishlist ?? [] });
});

export const saveWishlistBook = asyncHandler(async (req, res) => {
  const user = await getUser(req);
  const book = publicBook(req.body);
  user.wishlist = [book, ...(user.wishlist ?? []).filter((item) => item.id !== book.id)];
  await user.save();
  res.status(201).json({ books: user.wishlist });
});

export const removeWishlistBook = asyncHandler(async (req, res) => {
  const user = await getUser(req);
  user.wishlist = (user.wishlist ?? []).filter((item) => item.id !== req.params.id);
  await user.save();
  res.json({ books: user.wishlist });
});

export const getReadingHistory = asyncHandler(async (req, res) => {
  const user = await getUser(req);
  res.json({ books: user.readingHistory ?? [] });
});

export const trackReadingHistory = asyncHandler(async (req, res) => {
  const user = await getUser(req);
  const book = publicBook(req.body);
  user.readingHistory = [book, ...(user.readingHistory ?? []).filter((item) => item.id !== book.id)].slice(0, 50);
  await user.save();
  res.status(201).json({ books: user.readingHistory });
});
