# LumiBooks

LumiBooks is a premium online book store and AI reading platform. The repository is intentionally split into two root workspaces:

- `Frontend/` - Next.js App Router, TypeScript, Tailwind CSS, shadcn-style primitives, Zustand, TanStack Query, Framer Motion, Three.js, and reader interactions.
- `Backend/` - Express, MongoDB, Mongoose, JWT middleware, Google Books integration, OpenAI-powered reading features, and clean REST modules.

## Quick Start

```bash
cp .env.example .env
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and the backend runs on `http://localhost:5000`.

## Product Surface

The experience includes cinematic landing, auth flows, dashboard, search, book details, immersive reader, AI recommendation, AI librarian, community, wishlist, profile, settings, premium, support pages, genre worlds, branded error pages, and a scalable API layer.

Secrets are never committed. Add provider keys in `.env` for Clerk, OpenAI, Google Books, Cloudinary, Firebase Storage, or AWS S3.
