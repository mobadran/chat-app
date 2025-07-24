import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    console.error('Failed to fetch conversations:', error);
  }

  return (
    <ul className="flex flex-col gap-2">
      {data?.map((conversation: Conversation) => (
        <li key={conversation._id}>
          <button
            onClick={() => setCurrentConversation(conversation._id)}
            className="flex w-full items-center gap-2 border-b p-2 text-start hover:cursor-pointer"
          >
            <img
              src={conversation.avatar || NO_PFP}
              alt={conversation.name}
              className="h-10 w-10 rounded-full border"
            />
            {conversation.name}
          </button>
        </li>
      )) || <p>No conversations found</p>}
    </ul>
  );
}
