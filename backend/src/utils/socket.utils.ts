import ConversationMember from '#models/conversationMember.model.js';
import Message from '#models/message.model.js';

export function createMessage(user: { username: string; userId: string; displayName: string }, msg: { conversationId: string; content: string }) {
  return Message.create({
    conversationId: msg.conversationId,
    senderId: user.userId,
    senderInfo: {
      username: user.username,
      displayName: user.displayName || user.username,
    },
    content: msg.content,
  });
}

export function userInConversation(conversationId: string, userId: string) {
  return ConversationMember.findOne({ conversationId, userId });
}
