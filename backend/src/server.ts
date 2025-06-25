import { configDotenv } from 'dotenv';
import app from '#app.js';
import { connectDB } from '#config/db.js';
import { startRefreshTokenCleanup } from '#utils/cleanupTokens.utils.js';

configDotenv();
const PORT = process.env.PORT || 8001;

connectDB().then(() => {
  startRefreshTokenCleanup();
  app.listen(PORT, () => {
    console.log(`Local URL: http://localhost:${PORT}`);
  });
});
