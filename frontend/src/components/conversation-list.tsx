import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useLocation } from 'react-router-dom';

export default function ConversationList() {
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();

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
    <ul className="flex flex-col">
      {data?.map((conversation: Conversation) => (
        <li key={conversation._id}>
          <Link
            to={`/conversations/${conversation._id}`}
            className={`hover:bg-accent flex w-full items-center gap-2 border-b p-2 text-start ${
              location.pathname === `/conversations/${conversation._id}` ? 'bg-accent' : ''
            }`}
          >
            <img
              src={conversation.avatar || NO_PFP}
              alt={conversation.name}
              className="h-10 w-10 rounded-full border"
            />
            {conversation.name}
          </Link>
        </li>
      )) || <p>No conversations found</p>}
    </ul>
  );
}
