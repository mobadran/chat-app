import axios from '@/api/axios';
import { useAuth } from '@/context/auth-provider';

let refreshPromise: Promise<string | null> | null = null;

export default function useRefreshToken() {
  const { setAccessToken } = useAuth();

  const refresh = async (): Promise<string | null> => {
    // If a refresh is already in progress, return the same promise
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const response = await axios.get('/api/v1/auth/refresh', {
          withCredentials: true,
        });

        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        console.log('✅ Refreshed');
        return newAccessToken;
      } catch (error) {
        console.error('❌ Refresh token failed:', error);
        return null;
      } finally {
        refreshPromise = null; // Reset the promise once done
      }
    })();

    return refreshPromise;
  };

  return refresh;
}
