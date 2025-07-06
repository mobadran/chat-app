import { useParams } from 'react-router-dom';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Conversation() {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['conversations', id],
    queryFn: () => axiosPrivate.get(`/api/v1/conversations/${id}`).then((response) => response.data),
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    console.error('Failed to fetch conversation:', data?.error);
    if (data?.error?.response?.status === 401) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }

  return (
    <div>
      <h1>Conversation {id}</h1>
      <p>{data?.conversation?.name}</p>

      <h2>Members</h2>
      <ul>
        {data?.conversationMembers?.map((member: ConversationMember) => (
          <li key={member._id}>{member.userId.username}</li>
        ))}
      </ul>
    </div>
  );
}
