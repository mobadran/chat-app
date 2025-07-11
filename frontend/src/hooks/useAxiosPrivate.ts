import { axiosPrivate } from '@/api/axios';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth-provider';
import useRefreshToken from '@/hooks/useRefreshToken';
import { useNavigate } from 'react-router-dom';

export default function useAxiosPrivate() {
  const { accessToken } = useAuth();
  const refresh = useRefreshToken();
  const navigate = useNavigate();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        // Handle both 401 (Unauthorized) and 403 (Forbidden) status codes
        if ((error?.response?.status === 401 || error?.response?.status === 403) && !prevRequest?._retry) {
          prevRequest._retry = true;
          try {
            const newAccessToken = await refresh();
            if (!newAccessToken) {
              navigate('/login', { replace: true });
              return Promise.reject(error);
            }
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            // If refresh token fails, redirect to login
            navigate('/login', { replace: true });
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [accessToken, refresh, navigate]);

  return axiosPrivate;
}
