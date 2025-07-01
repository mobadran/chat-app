import { configDotenv } from 'dotenv';
import app from '#app.js';
import { connectDB } from '#config/db.js';
import { startRefreshTokenCleanup } from '#utils/cleanupTokens.utils.js';
import fs from 'fs';
import https from 'https';

configDotenv();
const PORT = process.env.PORT || 8001;

connectDB().then(() => {
  startRefreshTokenCleanup();

  const key = fs.readFileSync('./cert/localhost-key.pem');
  const cert = fs.readFileSync('./cert/localhost.pem');

  https.createServer({ key, cert }, app).listen(PORT, () => {
    console.log(`🔐 HTTPS dev server running at https://localhost:${PORT}`);
  });
});
