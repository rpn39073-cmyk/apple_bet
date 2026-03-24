import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/apple_bet',
});

// Real-time odds simulation
let currentOdds = {
  matchId: 'match_123',
  teamA: 1.85,
  teamB: 2.15,
  draw: 3.50,
  liveTimestamp: Date.now()
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Send initial odds
  socket.emit('oddsUpdate', currentOdds);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

import { initCrashGame } from './games/crash.js';
initCrashGame(io);

// Update odds periodically
setInterval(() => {
  currentOdds = {
    ...currentOdds,
    teamA: Number((Number(currentOdds.teamA) + (Math.random() * 0.1 - 0.05)).toFixed(2)),
    teamB: Number((Number(currentOdds.teamB) + (Math.random() * 0.1 - 0.05)).toFixed(2)),
    draw: Number((Number(currentOdds.draw) + (Math.random() * 0.1 - 0.05)).toFixed(2)),
    liveTimestamp: Date.now()
  };
  io.emit('oddsUpdate', currentOdds);
}, 2000); // 2 seconds update

import { router as walletRoutes } from './routes/wallet.js';
import { router as sportsRoutes } from './routes/sports.js';

app.use('/api/wallet', walletRoutes);
app.use('/api/sports', sportsRoutes);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
