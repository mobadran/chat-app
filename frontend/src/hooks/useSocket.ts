import { useEffect, useRef, useState } from 'react';
import { createSocket } from '@/lib/socket';
import { useAuth } from '@/context/auth-provider';
import useRefreshToken from '@/hooks/useRefreshToken';
import { Socket } from 'socket.io-client';

export default function useSocket() {
  const { accessToken } = useAuth();
  const refresh = useRefreshToken();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let active = true;

    const setupSocket = async () => {
      let token = accessToken;

      // Initial refresh if token is missing (e.g., on page reload)
      if (!token) {
        token = await refresh();
        if (!token || !active) return;
      }

      console.log('Creating socket,', token);
      const socket = createSocket(token);
      socketRef.current = socket;

      socket.on('connect', () => setConnected(true));
      socket.on('disconnect', () => setConnected(false));

      // If server says "unauthorized", refresh and reconnect
      socket.on('unauthorized', async () => {
        const newToken = await refresh();
        if (newToken && active) {
          socket.auth = {
            token: `Bearer ${newToken}`,
          };
          socket.connect(); // reconnect with fresh token
        }
      });

      socket.connect();
    };

    setupSocket();

    return () => {
      active = false;
      socketRef.current?.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  return { socket: socketRef.current, connected };
}
