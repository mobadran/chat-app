export type Message = {
  _id: string;
  content: string;
  conversationId: string;
  senderInfo: {
    username: string;
    displayName: string;
    avatar: string;
  };
};
