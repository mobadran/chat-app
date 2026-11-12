import ConversationMember from '#models/conversationMember.model.js';
import Message from '#models/message.model.js';
import mongoose from 'mongoose';

export function createMessage(
  user: { username: string; userId: string; displayName: string; avatar: string },
  msg: { conversationId: string; content: string; clientMessageId: string },
) {
  return Message.findOneAndUpdate(
    {
      conversationId: new mongoose.Types.ObjectId(msg.conversationId),
      senderId: new mongoose.Types.ObjectId(user.userId),
      clientMessageId: msg.clientMessageId,
    },
    {
      $setOnInsert: {
        conversationId: msg.conversationId,
        senderId: user.userId,
        clientMessageId: msg.clientMessageId,
        senderInfo: {
          username: user.username,
          displayName: user.displayName || user.username,
          avatar: user.avatar,
        },
        content: msg.content,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

export function userInConversation(conversationId: string, userId: string) {
  return ConversationMember.findOne({ conversationId, userId });
}
