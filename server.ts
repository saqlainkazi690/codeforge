import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const prisma = new PrismaClient();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

// --- BKT Logic ---
// P(L_t) = P(L_{t-1} | Result) + (1 - P(L_{t-1} | Result)) * P(T)
// P(L_{t-1} | Correct) = (P(L_{t-1}) * (1 - P(S))) / (P(L_{t-1}) * (1 - P(S)) + (1 - P(L_{t-1})) * P(G))
// P(L_{t-1} | Incorrect) = (P(L_{t-1}) * P(S)) / (P(L_{t-1}) * P(S) + (1 - P(L_{t-1})) * (1 - P(G)))

function updateBKT(current: any, correct: boolean) {
  const { masteryProbability: pL, pLearn: pT, pGuess: pG, pSlip: pS } = current;
  
  let pL_given_result;
  if (correct) {
    pL_given_result = (pL * (1 - pS)) / (pL * (1 - pS) + (1 - pL) * pG);
  } else {
    pL_given_result = (pL * pS) / (pL * pS + (1 - pL) * (1 - pG));
  }
  
  const newPL = pL_given_result + (1 - pL_given_result) * pT;
  return Math.min(0.99, Math.max(0.01, newPL));
}

// --- API Routes ---

// Auth (Mock for now)
app.post('/api/auth/login', async (req, res) => {
  const { email, username } = req.body;
  let user = await prisma.user.findUnique({ where: { email }, include: { student: true } });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        username,
        student: {
          create: {
            xp: 0,
            level: 1,
            eloRating: 1000,
          }
        }
      },
      include: { student: true }
    });
  }
  res.json(user);
});

// Student Profile
app.get('/api/student/:id/profile', async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: req.params.id },
    include: { skillStates: true, achievements: true }
  });
  res.json(student);
});

// BKT Skill State
app.get('/api/student/:id/skill-state', async (req, res) => {
  const states = await prisma.skillState.findMany({
    where: { studentId: req.params.id }
  });
  res.json(states);
});

// Submit Answer & Update BKT
app.post('/api/challenge/answer', async (req, res) => {
  const { studentId, topic, correct, difficulty, timeTaken } = req.body;
  
  let skillState = await prisma.skillState.findUnique({
    where: { studentId_topic: { studentId, topic } }
  });
  
  if (!skillState) {
    skillState = await prisma.skillState.create({
      data: { studentId, topic }
    });
  }
  
  const newMastery = updateBKT(skillState, correct);
  
  await prisma.skillState.update({
    where: { id: skillState.id },
    data: {
      masteryProbability: newMastery,
      attemptCount: { increment: 1 }
    }
  });
  
  // Gamification: XP Calculation
  let xpEarned = 0;
  if (correct) {
    xpEarned = 10 * difficulty;
    // Level up logic
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (student) {
      const newXP = student.xp + xpEarned;
      const nextLevelXP = 100 * Math.pow(1.4, student.level);
      let newLevel = student.level;
      if (newXP >= nextLevelXP) {
        newLevel++;
        io.to(studentId).emit('level_up', { studentId, newLevel });
      }
      
      await prisma.student.update({
        where: { id: studentId },
        data: { xp: newXP, level: newLevel }
      });
      
      io.to(studentId).emit('xp_update', { studentId, newXP, delta: xpEarned });
    }
  }
  
  res.json({ newMastery, xpEarned });
});

// Leaderboard
app.get('/api/leaderboard/global', async (req, res) => {
  const topStudents = await prisma.student.findMany({
    take: 10,
    orderBy: { xp: 'desc' },
    include: { user: { select: { username: true } } }
  });
  res.json(topStudents.map((s, i) => ({
    rank: i + 1,
    username: s.user.username,
    xp: s.xp,
    level: s.level
  })));
});

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`EduForge running on http://localhost:${PORT}`);
  });
}

// --- Socket.io ---
io.on('connection', (socket) => {
  socket.on('join', (studentId) => {
    socket.join(studentId);
    console.log(`Student ${studentId} joined real-time channel`);
  });
});

startServer();
