<div align="center">

# 📚 LumiBooks

### Modern Full-Stack Online Book Store & Digital Reading Platform

A full-stack online bookstore built with **Next.js, TypeScript, Express.js, MongoDB, Clerk Authentication, Google Books API, Cloudinary, and Tailwind CSS.**

Designed to provide a seamless digital reading experience with secure authentication, category-based book discovery, responsive design, and an intuitive user interface.

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)

</p>

<p align="center">

<a href="https://lumibooks.vercel.app">
<img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_Website-success?style=for-the-badge">
</a>

<a href="https://github.com/Shrushti2003">
<img src="https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github">
</a>

<a href="https://www.linkedin.com/in/shrushti-swarnakar/">
<img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin">
</a>

<a href="https://leetcode.com/u/Shrushti2003/">
<img src="https://img.shields.io/badge/LeetCode-Profile-FFA116?style=for-the-badge&logo=leetcode">
</a>

</p>

</div>

---

# 🌐 Live Demo

### 🚀 https://lumibooks.vercel.app

---

# 📖 About the Project

LumiBooks is a modern full-stack online bookstore that enables users to discover, explore, and read books through a clean, responsive, and user-friendly interface.

The application integrates the Google Books API to provide an extensive collection of books while offering secure authentication with Clerk and a scalable backend powered by Express.js and MongoDB. Users can browse books by category, search for titles, view detailed book information, and enjoy a smooth digital reading experience across desktop and mobile devices.

This project was built to strengthen full-stack development skills, REST API design, secure authentication, database management, and responsive UI development while following modern web development best practices.

---

# ✨ Features

### 📚 Book Features

- Browse books across multiple categories
- Search books by title
- Explore featured and trending books
- View detailed book information
- Digital reading experience
- Responsive book browsing
- Clean and modern interface

### 👤 User Features

- Secure Authentication with Clerk
- User Registration & Login
- Protected Routes
- Personalized Dashboard
- Responsive Design

### ⚙️ Backend Features

- RESTful API Architecture
- MongoDB Database Integration
- Cloudinary Image Management
- Secure Authentication
- Scalable Folder Structure
- Error Handling & Validation

---

# 🛠 Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form
- Framer Motion

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Clerk Authentication
- Cloudinary

## APIs & Services

- Google Books API
- Git & GitHub
- Vercel
- Postman

---

# 📷 Application Screenshots

## 🏠 Landing Page

![Landing Page](./screenshots/landing-page.png)

A modern landing page introducing LumiBooks with featured content and secure authentication options.

---

## 🏡 Home Page

![Home](./screenshots/home.png)

Browse featured books, trending collections, and discover your next favorite read.

---

## 📊 Dashboard

![Dashboard](./screenshots/dashboard.png)

A personalized dashboard providing quick access to books and account features.

---

## 📚 Browse Categories

![Browse Categories](./screenshots/browse-categories.png)

Explore books across multiple genres with an intuitive browsing experience.

---

## 📖 Browse Categories Grid

![Browse Categories Grid](./screenshots/browse-categories-grid.png)

Responsive grid layout designed for seamless navigation through large collections.

---

## 📘 Book Details

![Book Details](./screenshots/book-details.png)

View complete book information including author details, descriptions, ratings, and additional metadata.

---

## 📖 Reading Page

![Reading Page](./screenshots/reading%20page.png)

A distraction-free reading interface designed to provide a smooth digital reading experience.

---

## 🔥 Trending Books

![Trending Books](./screenshots/trending.png)

Stay updated with the latest popular and trending books available on the platform.

---

## 🔐 Sign In

![Sign In](./screenshots/sign-in.png)

Secure user authentication powered by Clerk.

---

## 📝 Sign Up

![Sign Up](./screenshots/sign-up.png)

Simple and secure registration process for new users.

---

# 📂 Project Structure

```text
LumiBooks
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── server.js
│
├── frontend
│   ├── app
│   ├── components
│   ├── hooks
│   ├── lib
│   ├── public
│   ├── styles
│   ├── utils
│   └── package.json
│
├── screenshots
├── README.md
└── package.json
```

---

# ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/Shrushti2003/YOUR_REPOSITORY_NAME.git
```

### Navigate to the Project Directory

```bash
cd YOUR_REPOSITORY_NAME
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

# ▶️ Running the Project

### Start the Backend Server

```bash
cd backend
npm run dev
```

### Start the Frontend

```bash
cd frontend
npm run dev
```

The application will be available at:

**Frontend:** `http://localhost:3000`

**Backend:** `http://localhost:5000`

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory and configure the required environment variables.

```env
PORT=

MONGODB_URI=

JWT_SECRET=

CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

GOOGLE_BOOKS_API_KEY=

FRONTEND_URL=
```

> **Note:** Use your own credentials and API keys before running the application.

---

# 🚧 Challenges Faced

- Integrating the Google Books API while maintaining a consistent user experience.
- Implementing secure authentication and protected routes using Clerk.
- Managing asynchronous API requests and loading states efficiently.
- Building reusable and maintainable React components.
- Designing a responsive interface for desktop, tablet, and mobile devices.
- Organizing a scalable full-stack project structure.
- Handling backend validation, error handling, and API communication.

---

# 📚 Key Learnings

- Building scalable full-stack applications with Next.js and Express.js.
- Designing RESTful APIs following industry best practices.
- Managing authentication and route protection using Clerk.
- Working with MongoDB and Mongoose for efficient database operations.
- Integrating third-party APIs into production-ready applications.
- Creating reusable UI components for better maintainability.
- Improving responsive design and overall user experience.
- Writing cleaner, modular, and maintainable code.

---

# 🚀 Future Improvements

- Wishlist and favorite books.
- Reading progress tracking.
- Book reviews and ratings.
- Advanced search and filtering.
- User profile customization.
- Reading statistics dashboard.
- Email notifications.
- Offline reading support.
- Dark mode.
- Personalized book recommendations.

---

# 👩‍💻 Author

**Shrushti Swarnakar**

Full Stack Developer passionate about building modern, scalable, and user-centric web applications.

- 🌐 **Live Demo:** https://lumibooks.vercel.app
- 💻 **GitHub:** https://github.com/Shrushti2003
- 💼 **LinkedIn:** https://www.linkedin.com/in/shrushti-swarnakar/
- 🧩 **LeetCode:** https://leetcode.com/u/Shrushti2003/

---

# ⭐ Support

If you found this project helpful or interesting, consider giving it a **⭐ Star** on GitHub. Your support helps showcase the project and is greatly appreciated.

---

<div align="center">

### Thank you for visiting LumiBooks! 📚

</div>
