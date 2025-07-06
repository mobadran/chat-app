import { useEffect, useRef, useState } from 'react';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;
    axiosPrivate
      .get('/api/v1/conversations')
      .then((response) => {
        setConversations(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch conversations:', error);
        if (error.response?.status === 401) {
          navigate('/login', { state: { from: location }, replace: true });
        }
      });
    // eslint-disable-next-line
  }, []);

  return (
    <ul>
      {conversations?.map((conversation) => <li key={conversation._id}>{conversation.name}</li>) || <p>Loading...</p>}
    </ul>
  );
}
