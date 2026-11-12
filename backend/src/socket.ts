import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '#utils/jwt.utils.js';
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

    socket.on('send-message', async (msg, cb) => {
      if (!cb) return;
      if (!msg?.conversationId || !msg?.content?.trim() || !msg?.clientMessageId) {
        cb(false);
        return;
      }
      if (!socket.rooms.has(msg.conversationId) || !(await userInConversation(msg.conversationId, user.userId))) {
        cb(false);
        return;
      }
      try {
        // Persist first so every delivery includes MongoDB's canonical _id.
        const savedMessage = await createMessage(user, msg);
        const message = savedMessage.toObject();
        socket.to(msg.conversationId).emit('new-message', message);
        cb(true, message);
      } catch (err) {
        console.error('Failed to save message:', err);
        cb(false);
      }
    });

    socket.on('disconnect', () => {
      console.log(`${user.username} disconnected`);
      io.emit('user-disconnected', user);
    });
  });
}
