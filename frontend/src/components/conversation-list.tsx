import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';

export default function ConversationList({
  setCurrentConversation,
}: {
  setCurrentConversation: (conversationId: string) => void;
}) {
  const axiosPrivate = useAxiosPrivate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => axiosPrivate.get('/api/v1/conversations').then((response) => response.data),
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    console.error('Failed to fetch conversations:', error);
  }

  return (
    <ul className="flex flex-col gap-2">
      {data?.map((conversation: Conversation) => (
        <li key={conversation._id}>
          <button
            onClick={() => setCurrentConversation(conversation._id)}
            className="flex w-full items-center gap-2 border-b p-2 hover:cursor-pointer"
          >
            <img
              src={
                conversation.image || 'https://res.cloudinary.com/dqdmrudnh/image/upload/v1751855764/no-pfp_srllpf.jpg'
              }
              alt={conversation.name}
              className="h-10 w-10 rounded-full"
            />
            {conversation.name}
          </button>
        </li>
      )) || <p>No conversations found</p>}
    </ul>
  );
}
