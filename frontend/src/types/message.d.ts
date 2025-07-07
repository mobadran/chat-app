export type Message = {
  _id: string;
  content: string;
  senderInfo: {
    username: string;
    displayName: string;
  };
};
