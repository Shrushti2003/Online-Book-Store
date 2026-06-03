export function notFound(req, res) {
  res.status(404).json({ message: `No chapter exists at ${req.originalUrl}` });
}
