import cron from 'node-cron';
import RefreshToken from '#models/refreshToken.model.js';

const oneDay = 24 * 60 * 60 * 1000;
const sevenDays = 7 * 24 * 60 * 60 * 1000;

export const startRefreshTokenCleanup = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const result = await RefreshToken.deleteMany({
        $or: [
          {
            invalidatedAt: { $lt: new Date(Date.now() - oneDay) },
          },
          {
            invalidatedAt: null,
            createdAt: { $lt: new Date(Date.now() - sevenDays) },
          },
        ],
      });
      console.log(`[CLEANUP] Deleted ${result.deletedCount} invalidated refresh tokens.`);
    } catch (error) {
      console.error('[CLEANUP ERROR]', error);
    }
  });

  console.log('[CLEANUP] Refresh Token cleanup job scheduled.');
};
