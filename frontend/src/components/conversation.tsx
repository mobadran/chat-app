import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useSocket from '@/context/socket-provider';
import type { Message } from '@/types/message';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { formatMessageTimestamp } from '@/lib/utils';

export default function Conversation({
  currentConversation,
  conversationSize,
}: {
  currentConversation: string | null;
  conversationSize: number;
}) {
  const axiosPrivate = useAxiosPrivate();
  const { socket, connected: socketConnected } = useSocket();
  const [message, setMessage] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { newMessages, sendMessage } = useMessages(currentConversation!);

  const conversation = useQuery({
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

  useEffect(() => {
    if (!socketConnected || !socket || !currentConversation) return;
    socket.emit('join-room', currentConversation, (success: boolean) => {
      if (!success) {
        console.error('Failed to join room');
        return;
      }
    });
    // eslint-disable-next-line
  }, [currentConversation, socketConnected]);

  const allMessages = [...(messages.data || []), ...newMessages];

  function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendMessage(message);
    setMessage('');
  }

  if (!currentConversation) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <MessageSquare className="text-muted-foreground h-10 w-10" />
        <p>Select a conversation</p>
      </div>
    );
  }

  if (conversation.isLoading) {
    return (
      <div className="flex h-screen flex-col justify-center">
        <div className="bg-sidebar flex items-center gap-2 p-2">
          <img
            src={'https://res.cloudinary.com/dqdmrudnh/image/upload/v1751855764/no-pfp_srllpf.jpg'}
            alt="Conversation"
            className="h-8 w-8 rounded-full"
          />
          <div>
            <Skeleton className="mb-2 h-3 w-24" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>
        <div className="flex w-full grow flex-col gap-2 overflow-hidden p-4">
          {Array.from({ length: 40 }).map((_, index) => (
            <Skeleton key={index} style={{ width: `${Math.random() * (90 - 40 + 1) + 40}%` }} className="h-6" />
          ))}
        </div>
      </div>
    );
  }

  if (conversation.isError) {
    console.error('Failed to fetch conversation:', conversation.data?.error);
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p>Error loading conversation</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-col border-l pb-14">
      {/* Convo Metadata */}
      <div className="bg-sidebar flex items-center gap-2 p-2">
        <img
          src={
            conversation?.data?.conversation?.avatar ||
            'https://res.cloudinary.com/dqdmrudnh/image/upload/v1751855764/no-pfp_srllpf.jpg'
          }
          alt={conversation?.data?.conversation?.name}
          className="h-8 w-8 rounded-full border"
        />
        <div>
          <p>{conversation?.data?.conversation?.name}</p>
          <p className="text-muted-foreground text-xs">
            {conversation?.data?.conversationMembers?.length} members -{' '}
            {conversation?.data?.conversationMembers
              ?.map((member: ConversationMember) => member.userId.displayName || member.userId.username)
              .join(', ')}
          </p>
        </div>
      </div>
      {/* Messages */}
      <div className="flex grow flex-col gap-2 overflow-y-auto p-5 pb-8">
        {allMessages?.map((message: Message, index: number) => (
          <div key={index} className="flex gap-2 border-b">
            <img
              src={
                message.senderInfo.avatar ||
                'https://res.cloudinary.com/dqdmrudnh/image/upload/v1751855764/no-pfp_srllpf.jpg'
              }
              alt={message.senderInfo.displayName}
              className="h-10 w-10 rounded-full border"
            />
            <div className="flex grow flex-col">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-nowrap">{message.senderInfo.displayName}</h3>
                <p className="text-muted-foreground text-xs">{formatMessageTimestamp(message.createdAt)}</p>
              </div>
              <p className="mb-2 break-all">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        style={{
          left: `calc(${conversationSize}% + 64px)`,
        }}
        className="bg-accent fixed right-8 bottom-2 flex items-center gap-2 rounded-4xl px-6 py-3"
      >
        <MessageInput buttonRef={buttonRef} message={message} setMessage={setMessage} />
        <button type="submit" className="self-end rounded-md border p-2" ref={buttonRef}>
          <Send />
        </button>
      </form>
    </div>
  );
}

function useMessages(conversationId: string) {
  const { socket } = useSocket();
  const [newMessages, setNewMessages] = useState<Message[]>([]);

  useEffect(() => {
    function handleNewMessage(message: Message) {
      if (message.conversationId !== conversationId) return;
      setNewMessages((prev) => [...prev, message]);
    }
    if (!socket) return;
    socket.on('new-message', handleNewMessage);
    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [socket, conversationId]);

  // Reset new messages when conversation changes
  useEffect(() => {
    setNewMessages([]);
  }, [conversationId]);

  const sendMessage = (content: string) => {
    if (socket && conversationId && content.trim()) {
      socket.emit(
        'send-message',
        {
          conversationId,
          content,
        },
        (success: boolean, message: Message) => {
          if (!success) {
            console.error('Failed to send message');
            return;
          } else {
            setNewMessages((prev) => [...prev, message]);
          }
        },
      );
    }
  };

  return { newMessages, sendMessage };
}

function MessageInput({
  buttonRef,
  message,
  setMessage,
}: {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  message: string;
  setMessage: (message: string) => void;
}) {
  return (
    <textarea
      className="border-input h-auto flex-1 resize-none rounded-md border p-2"
      rows={1}
      placeholder="Type a message..."
      value={message}
      onInput={(e) => {
        const getLineCount = (text: string) => {
          const lines = text.split('\n');
          return lines.length;
        };
        setMessage(e.currentTarget.value);
        const lineCount = getLineCount(e.currentTarget.value);
        if (lineCount > 9) return;
        e.currentTarget.style.height = 44 + (lineCount - 1) * 24 + 'px';
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          e.currentTarget.style.height = 'auto';
          buttonRef?.current?.click();
        }
      }}
    ></textarea>
  );
}
