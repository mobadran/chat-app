import { configDotenv } from 'dotenv';
import app from '#app.js';
import { connectDB } from '#config/db.js';
import { startRefreshTokenCleanup } from '#utils/cleanupTokens.utils.js';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { Server } from 'socket.io';
import { setupSocketIO } from '#socket.js';

configDotenv();
const PORT = process.env.PORT || 8001;

connectDB().then(() => {
  startRefreshTokenCleanup();

  // Render terminates HTTPS at its proxy, so the app should listen over HTTP
  // there. Keep the local certificates for the development server only.
  const server = process.env.NODE_ENV === 'production'
    ? http.createServer(app)
    : https.createServer(
        {
          key: fs.readFileSync('./cert/localhost-key.pem'),
          cert: fs.readFileSync('./cert/localhost.pem'),
        },
        app,
      );

  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  setupSocketIO(io);

  server.listen(PORT, () => {
    console.log(
      process.env.NODE_ENV === 'production'
        ? `HTTP server listening on port ${PORT}`
        : `🔐 HTTPS dev server running at https://localhost:${PORT}`,
    );
  });
});
