import ConversationMember from '#models/conversationMember.model.js';
import { IUser } from '#models/user.model.js';
import { IConversation } from '#models/conversation.model.js';

export const getConversationNameAndAvatar = async (conversation: IConversation, userId: string) => {
  if (conversation.name === null || conversation.type === 'direct') {
    const users = await ConversationMember.find({ conversationId: conversation._id, userId: { $ne: userId } }).populate(
      'userId',
      'username displayName avatar',
    );

    const name = users.map((u) => (u.userId as IUser).displayName).join(', ');
    const avatar = (users[0].userId as IUser).avatar;
    return { name, avatar };
  }

  return { name: conversation.name, avatar: null };
};
