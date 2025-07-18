import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from './utils/jwt.utils.js';
import { createMessage, userInConversation } from '#utils/socket.utils.js';

export function setupSocketIO(io: Server) {
  io.use((socket, next) => {
    const rawToken = socket.handshake.auth?.token;
    const token = rawToken?.startsWith('Bearer ') ? rawToken.split(' ')[1] : rawToken;

    if (!token) return next(new Error('Unauthorized'));

    try {
      const payload = verifyAccessToken(token);
      socket.data.user = { ...payload, id: payload.userId };
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user;
    console.log(`🔗 New connection from user: ${user.username}`);
    io.emit('user-connected', user);

    socket.on('join-room', (conversationId, cb) => {
      if (!cb) return;
      if (!userInConversation(conversationId, user.userId)) {
        console.log('User', user.username, 'is not in the conversation', conversationId);
        cb(false);
        return;
      }
      console.log('User', user.username, 'joined the conversation', conversationId);
      socket.join(conversationId);
      cb(true);
    });

    socket.on('send-message', (msg, cb) => {
      if (!cb) return;
      console.log(`${user.username} says: '${msg.content}' to ${msg.conversationId}`);
      if (!socket.rooms.has(msg.conversationId)) {
        console.log('User', user.username, 'is not in the room', msg.conversationId);
        cb(false);
        return;
      }
      const message = {
        ...msg,
        senderInfo: {
          userId: user.userId,
          username: user.username,
          displayName: user.displayName || user.username,
          avatar: user.avatar,
        },
      };
      // Send to all users except sender
      socket.to(msg.conversationId).emit('new-message', message);
      // Send to sender
      cb(true, message);
      // Save the message to DB
      createMessage(user, msg).catch((err) => {
        console.error('Failed to save message:', err);
      });
    });

    socket.on('disconnect', () => {
      console.log(`${user.username} disconnected`);
      io.emit('user-disconnected', user);
    });
  });
}
