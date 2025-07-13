import { configDotenv } from 'dotenv';
import app from '#app.js';
import { connectDB } from '#config/db.js';
import { startRefreshTokenCleanup } from '#utils/cleanupTokens.utils.js';
import fs from 'fs';
import https from 'https';
import { Server } from 'socket.io';
import { setupSocketIO } from '#socket.js';

configDotenv();
const PORT = process.env.PORT || 8001;

connectDB().then(() => {
  startRefreshTokenCleanup();

  const key = fs.readFileSync('./cert/localhost-key.pem');
  const cert = fs.readFileSync('./cert/localhost.pem');

  const server = https.createServer({ key, cert }, app);

  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  setupSocketIO(io);

  server.listen(PORT, () => {
    console.log(`🔐 HTTPS dev server running at https://localhost:${PORT}`);
  });
});
