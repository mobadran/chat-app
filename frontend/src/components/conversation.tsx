import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import type { Message } from '@/types/message';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function Conversation({ currentConversation }: { currentConversation: string | null }) {
  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['conversations', currentConversation],
    queryFn: () => axiosPrivate.get(`/api/v1/conversations/${currentConversation}`).then((response) => response.data),
    enabled: !!currentConversation,
  });

  const messages = useQuery({
    queryKey: ['messages', currentConversation],
    queryFn: () =>
      axiosPrivate.get(`/api/v1/conversations/${currentConversation}/messages`).then((response) => response.data),
    enabled: !!currentConversation,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: { conversationId: string; message: string }) =>
      axiosPrivate.post(`/api/v1/conversations/${data.conversationId}/messages`, { content: data.message }),
  });

  function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendMessageMutation.mutate({ conversationId: currentConversation!, message });
    setMessage('');
  }

  if (!currentConversation) {
    return <p>Select a conversation</p>;
  }

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    console.error('Failed to fetch conversation:', data?.error);
  }

  return (
    <div className="flex grow flex-col border-l">
      {/* Convo Metadata */}
      <div className="bg-sidebar flex items-center gap-2 p-2">
        <img
          src={
            data?.conversation?.image ||
            'https://res.cloudinary.com/dqdmrudnh/image/upload/v1751855764/no-pfp_srllpf.jpg'
          }
          alt=""
          className="h-8 w-8 rounded-full"
        />
        <div>
          <p>{data?.conversation?.name}</p>
          <p className="text-muted-foreground text-xs">
            {data?.conversationMembers?.length} members -{' '}
            {data?.conversationMembers
              ?.map((member: ConversationMember) => member.userId.displayName || member.userId.username)
              .join(', ')}
          </p>
        </div>
      </div>
      {/* Messages */}
      <div className="flex grow flex-col gap-2 p-2">
        {messages?.data?.map((message: Message) => (
          <div key={message._id} className="flex items-center gap-2 border-b">
            <h3 className="font-semibold">{message.senderInfo.displayName}:</h3>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      {/* Input */}
      <form onSubmit={sendMessage} className="flex items-center gap-2 p-2">
        <input
          type="text"
          className="border-input flex-1 rounded-md border p-2"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="rounded-md border p-2">
          Send
        </button>
      </form>
    </div>
  );
}
