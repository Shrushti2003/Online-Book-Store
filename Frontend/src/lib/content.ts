import type { Book, GenreWorld } from "@/types/book";

export const featuredBooks: Book[] = [
  {
    id: "starlit-archive",
    title: "The Starlit Archive",
    author: "Mira Vale",
    genre: "Sci-Fi",
    mood: "Wonder",
    rating: 4.9,
    cover: "linear-gradient(145deg, #3AEFFF, #7B61FF)",
    description: "A memory architect finds a forbidden library orbiting a dying moon.",
    progress: 72
  },
  {
    id: "glass-kingdoms",
    title: "Glass Kingdoms",
    author: "Elian Wren",
    genre: "Fantasy",
    mood: "Epic",
    rating: 4.8,
    cover: "linear-gradient(145deg, #7B61FF, #FF4ECD)",
    description: "Kingdoms, legends, and impossible worlds unfold inside a crown made of light.",
    progress: 38
  },
  {
    id: "after-midnight",
    title: "After Midnight",
    author: "Noor Ash",
    genre: "Horror",
    mood: "Haunted",
    rating: 4.7,
    cover: "linear-gradient(145deg, #1E1E1E, #FF7B54)",
    description: "A quiet coastal town keeps a nightly appointment with something below the pier."
  },
  {
    id: "soft-static",
    title: "Soft Static",
    author: "June Calder",
    genre: "Romance",
    mood: "Tender",
    rating: 4.6,
    cover: "linear-gradient(145deg, #FF7B54, #FF4ECD)",
    description: "Two radio hosts fall in love through late-night confessions and almost-silences."
  }
];

export const genres: GenreWorld[] = [
  {
    slug: "fantasy",
    name: "Fantasy",
    tone: "Magical, adventurous, dreamlike",
    headline: "Kingdoms, legends, and impossible worlds await.",
    copy: "Follow luminous maps, whispered prophecies, and characters brave enough to step beyond the veil.",
    accent: "#7B61FF",
    atmosphere: "Magical particles drift through a purple and cyan twilight.",
    motion: "Floating cards and soft constellation trails"
  },
  {
    slug: "sci-fi",
    name: "Sci-Fi",
    tone: "Futuristic, intelligent, technological",
    headline: "Explore worlds beyond human imagination.",
    copy: "Holographic cities, machine dreams, and speculative futures arranged for the curious mind.",
    accent: "#3AEFFF",
    atmosphere: "Neon grids, orbital glow, and glassy data panels.",
    motion: "Holographic sweeps and precise kinetic reveals"
  },
  {
    slug: "horror",
    name: "Horror",
    tone: "Mysterious, dark, suspenseful",
    headline: "Enter stories that whisper in the dark.",
    copy: "Slow dread, sharp shadows, and endings that keep a hand on your shoulder after lights out.",
    accent: "#FF7B54",
    atmosphere: "Cinematic fog, red glows, and breathing shadows.",
    motion: "Slow fades, low parallax, and unsettling hover depth"
  },
  {
    slug: "romance",
    name: "Romance",
    tone: "Emotional, elegant, soft",
    headline: "Stories that stay with your heart.",
    copy: "Warm glances, impossible timing, second chances, and feelings written with quiet precision.",
    accent: "#FF4ECD",
    atmosphere: "Soft gradients, warm light, and elegant page turns.",
    motion: "Gentle floating motion and satin transitions"
  },
  {
    slug: "mystery",
    name: "Mystery",
    tone: "Sharp, tense, investigative",
    headline: "Every clue has a shadow.",
    copy: "Locked rooms, unreliable memories, and revelations that arrive one breath before you do.",
    accent: "#7B61FF",
    atmosphere: "Ink-dark panels, amber clues, and cinematic cuts.",
    motion: "Evidence-board reveals and crisp staggered transitions"
  },
  {
    slug: "self-help",
    name: "Self-Help",
    tone: "Grounded, clear, motivating",
    headline: "Build a better inner rhythm.",
    copy: "Practical books for focus, confidence, habits, and the quiet architecture of change.",
    accent: "#FF7B54",
    atmosphere: "Clean sunrise gradients and calm progress markers.",
    motion: "Minimal lifts, smooth counters, and focused step transitions"
  },
  {
    slug: "anime-manga",
    name: "Anime/Manga",
    tone: "Expressive, electric, playful",
    headline: "Panels that move faster than thought.",
    copy: "High-energy arcs, intimate character beats, and illustrated worlds with neon pulse.",
    accent: "#FF4ECD",
    atmosphere: "Graphic panels, kinetic streaks, and pop color sparks.",
    motion: "Snap transitions, hover bursts, and carousel motion"
  },
  {
    slug: "history",
    name: "History",
    tone: "Textured, human, cinematic",
    headline: "The past, close enough to touch.",
    copy: "Empires, revolutions, private letters, and the human decisions that changed everything.",
    accent: "#FF7B54",
    atmosphere: "Archive paper, museum lighting, and layered timelines.",
    motion: "Timeline scrolls and documentary-style fades"
  },
  {
    slug: "technology",
    name: "Technology",
    tone: "Precise, ambitious, modern",
    headline: "Read the systems shaping tomorrow.",
    copy: "AI, product craft, startups, code, hardware, and the ideas moving beneath the interface.",
    accent: "#3AEFFF",
    atmosphere: "Clean grids, command surfaces, and cyan signal lines.",
    motion: "Terminal pulses, modular reveals, and data sweeps"
  },
  {
    slug: "philosophy",
    name: "Philosophy",
    tone: "Reflective, elegant, searching",
    headline: "Questions with beautiful gravity.",
    copy: "Ancient arguments, modern doubt, and books that make thinking feel newly alive.",
    accent: "#7B61FF",
    atmosphere: "Quiet light, marble texture, and spacious composition.",
    motion: "Slow focus shifts and meditative transitions"
  },
  {
    slug: "fiction",
    name: "Fiction",
    tone: "Immersive, literary, transportive",
    headline: "Stories with enough gravity to pull you all the way in.",
    copy: "Modern classics, emotional page-turners, and literary worlds arranged for deep discovery.",
    accent: "#7B61FF",
    atmosphere: "Soft paper light, cinematic shelves, and quiet motion.",
    motion: "Smooth reveals and warm hover depth"
  },
  {
    slug: "non-fiction",
    name: "Non-Fiction",
    tone: "Useful, clear, expansive",
    headline: "Ideas, histories, and real stories that sharpen the world.",
    copy: "Explore books that explain, challenge, and expand how you understand what is real.",
    accent: "#3AEFFF",
    atmosphere: "Clean editorial panels and focused reading surfaces.",
    motion: "Measured fades and crisp section transitions"
  },
  {
    slug: "thriller",
    name: "Thriller",
    tone: "Fast, tense, propulsive",
    headline: "Every chapter turns the pressure higher.",
    copy: "Conspiracies, chases, reversals, and hooks built for one more chapter.",
    accent: "#FF7B54",
    atmosphere: "Sharp shadows, urgent highlights, and noir contrast.",
    motion: "Quick lifts and suspenseful staggered reveals"
  },
  {
    slug: "biography",
    name: "Biography",
    tone: "Human, intimate, revealing",
    headline: "Lives large enough to become maps.",
    copy: "Artists, founders, leaders, scientists, and private journeys told with human texture.",
    accent: "#FF7B54",
    atmosphere: "Archive light, portraits, and layered timelines.",
    motion: "Documentary fades and timeline reveals"
  },
  {
    slug: "business",
    name: "Business",
    tone: "Strategic, practical, ambitious",
    headline: "Better decisions for builders and operators.",
    copy: "Leadership, markets, management, and company-building books for serious momentum.",
    accent: "#3AEFFF",
    atmosphere: "Precise dashboards and refined work surfaces.",
    motion: "Modular slides and decisive hover states"
  },
  {
    slug: "entrepreneurship",
    name: "Entrepreneurship",
    tone: "Inventive, restless, tactical",
    headline: "Build the thing only you can see.",
    copy: "Startup lessons, founder stories, product strategy, and ideas for turning motion into a company.",
    accent: "#FF4ECD",
    atmosphere: "Bright worktables, launch notes, and kinetic cards.",
    motion: "Fast reveals and optimistic transitions"
  },
  {
    slug: "finance",
    name: "Finance",
    tone: "Analytical, grounded, precise",
    headline: "Understand money without the fog.",
    copy: "Personal finance, markets, behavioral finance, and durable frameworks for compounding.",
    accent: "#7B61FF",
    atmosphere: "Clean graphs, soft contrast, and ledger-like rhythm.",
    motion: "Counter motion and subtle chart sweeps"
  },
  {
    slug: "investing",
    name: "Investing",
    tone: "Patient, strategic, evidence-led",
    headline: "Think longer, read sharper, invest wiser.",
    copy: "Value investing, market history, portfolio thinking, and the psychology of risk.",
    accent: "#3AEFFF",
    atmosphere: "Signal lines, calm charts, and focused panels.",
    motion: "Smooth data sweeps and deliberate reveals"
  },
  {
    slug: "programming",
    name: "Programming",
    tone: "Technical, elegant, hands-on",
    headline: "Read better code before you write it.",
    copy: "Software craft, languages, architecture, debugging, and books for builders who care about details.",
    accent: "#3AEFFF",
    atmosphere: "Command surfaces, code grids, and luminous syntax.",
    motion: "Terminal pulses and modular reveals"
  },
  {
    slug: "web-development",
    name: "Web Development",
    tone: "Practical, modern, product-minded",
    headline: "Interfaces, systems, and patterns for the modern web.",
    copy: "Frontend, backend, performance, accessibility, and full-stack books for shipping better products.",
    accent: "#7B61FF",
    atmosphere: "Browser chrome, layout grids, and glass panels.",
    motion: "Responsive slides and interface micro-interactions"
  },
  {
    slug: "mobile-development",
    name: "Mobile Development",
    tone: "Portable, tactile, efficient",
    headline: "Build experiences people carry everywhere.",
    copy: "Native, cross-platform, interaction design, and mobile engineering books for polished apps.",
    accent: "#FF4ECD",
    atmosphere: "Device frames, touch ripples, and compact layouts.",
    motion: "Swipe-first transitions and touch-friendly lifts"
  },
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    tone: "Intelligent, speculative, practical",
    headline: "The books behind the systems changing everything.",
    copy: "AI foundations, applied agents, ethics, product strategy, and machine intelligence for curious builders.",
    accent: "#3AEFFF",
    atmosphere: "Neural light, command panels, and clean signal paths.",
    motion: "Data sweeps and precise kinetic reveals"
  },
  {
    slug: "machine-learning",
    name: "Machine Learning",
    tone: "Mathematical, applied, rigorous",
    headline: "Patterns, models, and the discipline of prediction.",
    copy: "ML theory, implementation, optimization, and applied systems for serious practitioners.",
    accent: "#7B61FF",
    atmosphere: "Model grids, equations, and luminous plots.",
    motion: "Layered reveals and smooth graph motion"
  },
  {
    slug: "data-science",
    name: "Data Science",
    tone: "Evidence-led, curious, analytical",
    headline: "Turn messy signals into clear stories.",
    copy: "Statistics, visualization, analytics, experimentation, and practical data workflows.",
    accent: "#FF7B54",
    atmosphere: "Charts, notebooks, and editorial data panels.",
    motion: "Chart sweeps and progressive disclosure"
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    tone: "Sharp, defensive, investigative",
    headline: "Read the systems before someone breaks them.",
    copy: "Security engineering, threat modeling, incident stories, privacy, and resilient design.",
    accent: "#FF4ECD",
    atmosphere: "Dark terminals, alert lines, and clean threat maps.",
    motion: "Scanner sweeps and precise hover states"
  },
  {
    slug: "cloud-computing",
    name: "Cloud Computing",
    tone: "Scalable, operational, architectural",
    headline: "Infrastructure thinking for modern systems.",
    copy: "Distributed systems, DevOps, reliability, platforms, and cloud architecture books.",
    accent: "#3AEFFF",
    atmosphere: "Network maps, service panels, and sky-light gradients.",
    motion: "Pipeline motion and service-card reveals"
  },
  {
    slug: "startups",
    name: "Startups",
    tone: "Fast, uncertain, inventive",
    headline: "Find signal before the market gets loud.",
    copy: "Product-market fit, founder psychology, strategy, growth, and hard-won lessons.",
    accent: "#FF7B54",
    atmosphere: "Launch boards, metrics, and focused workspace light.",
    motion: "Energetic but restrained transitions"
  },
  {
    slug: "academic",
    name: "Academic",
    tone: "Structured, rigorous, foundational",
    headline: "Foundations for study, research, and mastery.",
    copy: "Textbooks, references, and deep study materials across disciplines.",
    accent: "#7B61FF",
    atmosphere: "Library desks, margin notes, and calm structure.",
    motion: "Minimal reveals and focused transitions"
  },
  {
    slug: "engineering",
    name: "Engineering",
    tone: "Technical, practical, exact",
    headline: "Systems, structures, and problem-solving at scale.",
    copy: "Engineering principles, design, mechanics, electronics, and applied technical knowledge.",
    accent: "#3AEFFF",
    atmosphere: "Blueprint grids and precise measurement lines.",
    motion: "Mechanical reveals and crisp transitions"
  },
  {
    slug: "medical",
    name: "Medical",
    tone: "Careful, human, scientific",
    headline: "Medicine, health, and the human body with clarity.",
    copy: "Clinical knowledge, medical history, public health, and books for thoughtful understanding.",
    accent: "#FF4ECD",
    atmosphere: "Clean light, anatomical diagrams, and soft precision.",
    motion: "Gentle fades and clear state changes"
  },
  {
    slug: "travel",
    name: "Travel",
    tone: "Open, textured, curious",
    headline: "Places, journeys, and the feeling of elsewhere.",
    copy: "Travel writing, guides, memoirs, maps, and books that move through the world.",
    accent: "#FF7B54",
    atmosphere: "Maps, sunrise light, and layered routes.",
    motion: "Parallax routes and smooth scroll reveals"
  },
  {
    slug: "childrens-books",
    name: "Children's Books",
    tone: "Warm, bright, imaginative",
    headline: "Small books with huge doors inside.",
    copy: "Picture books, early readers, bedtime favorites, and stories for growing imaginations.",
    accent: "#FF4ECD",
    atmosphere: "Bright panels, soft shapes, and playful type.",
    motion: "Gentle bounces and soft reveal motion"
  },
  {
    slug: "manga",
    name: "Manga",
    tone: "Kinetic, expressive, serialized",
    headline: "Panels, arcs, and characters with electric momentum.",
    copy: "Beloved manga series, new volumes, character-driven sagas, and visual storytelling.",
    accent: "#FF4ECD",
    atmosphere: "Panel grids, ink contrast, and neon accents.",
    motion: "Swipe transitions and crisp panel reveals"
  },
  {
    slug: "comics",
    name: "Comics",
    tone: "Graphic, bold, cinematic",
    headline: "Sequential art with full-color impact.",
    copy: "Superheroes, indies, visual memoirs, and illustrated stories with striking rhythm.",
    accent: "#7B61FF",
    atmosphere: "Graphic panels, halftone texture, and bold contrast.",
    motion: "Panel slides and hover pops"
  },
  {
    slug: "graphic-novels",
    name: "Graphic Novels",
    tone: "Visual, literary, layered",
    headline: "Illustrated stories with novel-sized emotional range.",
    copy: "Long-form visual storytelling across memoir, fantasy, literary fiction, and history.",
    accent: "#3AEFFF",
    atmosphere: "Gallery lighting, panel rhythm, and clean frames.",
    motion: "Page-turn reveals and smooth image transitions"
  },
  {
    slug: "health-fitness",
    name: "Health & Fitness",
    tone: "Practical, energetic, sustainable",
    headline: "Build a body and rhythm that supports your life.",
    copy: "Training, nutrition, sleep, mobility, and health books with practical clarity.",
    accent: "#FF7B54",
    atmosphere: "Fresh light, progress rings, and clear controls.",
    motion: "Counter motion and touch-friendly feedback"
  },
  {
    slug: "sports",
    name: "Sports",
    tone: "Competitive, human, tactical",
    headline: "Games, pressure, legends, and the psychology of performance.",
    copy: "Sports stories, coaching, biographies, strategy, and the culture around competition.",
    accent: "#7B61FF",
    atmosphere: "Arena light, stat cards, and kinetic highlights.",
    motion: "Scoreboard reveals and quick hover lifts"
  },
  {
    slug: "productivity",
    name: "Productivity",
    tone: "Focused, calm, actionable",
    headline: "Do better work without becoming a machine.",
    copy: "Habits, focus, systems, planning, and practical books for clearer days.",
    accent: "#3AEFFF",
    atmosphere: "Clean task surfaces, soft progress, and quiet spacing.",
    motion: "Minimal lifts and smooth state transitions"
  }
];

export const dashboardInsights = [
  "You are on a 7-day reading streak.",
  "Your focus peaks during night reading sessions.",
  "Fantasy worlds dominated your week.",
  "Your next favorite book is ready."
];

export const aiMessages = [
  "You seem drawn toward emotionally intense stories lately. I would start with a world that gives you wonder first, then quietly breaks your heart.",
  "Based on your recent reads, this one has the right gravity: elegant prose, a fast emotional hook, and characters who linger.",
  "If your mood is restless, choose something with clean momentum and a little danger. The library is leaning toward sci-fi tonight."
];
