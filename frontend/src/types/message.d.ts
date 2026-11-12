export type Message = {
  _id: string;
  clientMessageId?: string;
  status?: 'sending' | 'sent' | 'failed';
  content: string;
  conversationId: string;
  senderInfo: {
    username: string;
    displayName: string;
    avatar: string;
  };
  createdAt: string;
};
