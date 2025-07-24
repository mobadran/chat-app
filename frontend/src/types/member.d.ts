type Member = {
  _id: string;
  username: string;
  email: string;
  displayName: string;
};
type UserData = {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
};
