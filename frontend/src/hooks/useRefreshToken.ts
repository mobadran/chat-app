import axios from '@/api/axios';
import { useAuth } from '@/context/auth-provider';

export default function useRefreshToken() {
  const { setAccessToken } = useAuth();
  const refresh = async () => {
    try {
      const response = await axios.get('/api/v1/auth/refresh', {
        withCredentials: true,
      });
      setAccessToken(response.data.accessToken);
      console.log('✅ Refreshed');
      return response.data.accessToken;
    } catch (error) {
      console.error('❌ Refresh token failed:', error);
      return null;
    }
  };
  return refresh;
}
