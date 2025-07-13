import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { createSocket } from '@/lib/socket';
import { useAuth } from '@/context/auth-provider';
import useRefreshToken from '@/hooks/useRefreshToken';

type SocketContextType = {
  socket: Socket | null;
  connected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuth();
  const refresh = useRefreshToken();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let active = true;

    const setupSocket = async () => {
      let token = accessToken;
      if (!token) {
        token = await refresh();
        if (!token || !active) return;
      }

      const socket = createSocket(token);
      socketRef.current = socket;

      socket.on('connect', () => setConnected(true));
      socket.on('disconnect', () => setConnected(false));

      socket.on('unauthorized', async () => {
        const newToken = await refresh();
        if (newToken && active) {
          socket.auth = { token: `Bearer ${newToken}` };
          socket.connect();
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
  }, [accessToken]);

  return <SocketContext.Provider value={{ socket: socketRef.current, connected }}>{children}</SocketContext.Provider>;
}

// eslint-disable-next-line
export default function useSocket() {
  return useContext(SocketContext);
}
