import { io } from 'socket.io-client';

export const createSocket = (token: string) =>
  io(import.meta.env.VITE_BACKEND_API, {
    autoConnect: false,
    auth: {
      token: `Bearer ${token}`,
    },
  });
