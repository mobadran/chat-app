import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export default function ConversationList() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => axiosPrivate.get('/api/v1/conversations').then((response) => response.data),
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    console.error('Failed to fetch conversations:', data?.error);
    if (data?.error?.response?.status === 401) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }

  return (
    <ul>
      {data?.map((conversation: Conversation) => (
        <li key={conversation._id}>
          <Link to={`/conversations/${conversation._id}`}>{conversation.name}</Link>
        </li>
      )) || <p>No conversations found</p>}
    </ul>
  );
}
