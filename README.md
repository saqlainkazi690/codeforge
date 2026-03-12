# EduForge — Adaptive Mastery Engine

EduForge is a gamified education platform for undergraduate students that uses Bayesian Knowledge Tracing (BKT) and Gemini AI to create personalized, adaptive learning experiences.

## 🚀 Quick Start (Mac M4 / Apple Silicon)

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment Setup:**
   - Copy `.env.example` to `.env`
   - Add your `GEMINI_API_KEY`

3. **Database Initialization:**
   ```bash
   npx prisma db push
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

## 🧠 Core Features

- **Adaptive Loop:** Real-time BKT updates after every question to target the Zone of Proximal Development.
- **AI Question Gen:** Dynamic generation of undergraduate-level questions using Gemini 3 Flash.
- **Socratic Tutor:** RAG-powered AI tutor that guides students without giving answers.
- **Gamification:** XP, levels, ELO ratings, and a badge system with AI-generated citations.
- **Real-time Events:** Live XP and level-up notifications via Socket.io.

## 🛠️ Tech Stack

- **Frontend:** React 19, Tailwind CSS 4, Framer Motion, Recharts
- **Backend:** Express (Node.js), Socket.io
- **Database:** SQLite via Prisma
- **AI:** Gemini 3 Flash (Google GenAI SDK)
- **ML:** Custom BKT implementation in TypeScript

## 🍎 Mac M4 Optimization

- **Docker:** Use `platform: linux/arm64` in `docker-compose.yml`.
- **Node:** Native arm64 support for high-performance execution.
- **Memory:** Optimized for 16GB RAM with efficient caching.

---
*Built with ❤️ for the next generation of learners.*
