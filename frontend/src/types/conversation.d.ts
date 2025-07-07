type Conversation = {
  _id: string;
  type: string;
  name: string;
  image: string;
};

type ConversationMember = {
  _id: string;
  userId: Member;
};
