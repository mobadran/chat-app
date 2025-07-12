// sockets/socket-handler.ts
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from './jwt.utils.js';
import Message from '#models/message.model.js';

export function setupSocketIO(io: Server) {
  io.use((socket, next) => {
    const rawToken = socket.handshake.auth?.token;
    const token = rawToken?.startsWith('Bearer ') ? rawToken.split(' ')[1] : rawToken;

    if (!token) return next(new Error('Unauthorized'));

    try {
      const payload = verifyAccessToken(token);
      socket.data.user = payload;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connect', (socket: Socket) => {
    const user = socket.data.user;
    console.log(`🔗 New connection from user: ${user.username}`);

    socket.on('send-message', (msg) => {
      console.log(`${user.username} says: '${msg.content}' to ${msg.conversationId}`);
      io.emit('new-message', {
        ...msg,
        senderInfo: {
          userId: user.userId,
          username: user.username,
          displayName: user.displayName || user.username,
        },
      });
      // Save the message to DB
      Message.create({
        conversationId: msg.conversationId,
        senderId: user.userId,
        senderInfo: {
          username: user.username,
          displayName: user.displayName || user.username,
        },
        content: msg.content,
      });
    });

    socket.on('disconnect', () => {
      console.log(`${user.username} disconnected`);
    });
  });
}
