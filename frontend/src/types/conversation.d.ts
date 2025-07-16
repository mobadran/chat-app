type Conversation = {
  _id: string;
  type: string;
  name: string;
  avatar: string;
};

type ConversationMember = {
  _id: string;
  userId: Member;
};
