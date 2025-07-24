import ConversationList from '@/components/conversation-list';
import Conversation from '@/components/conversation';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import SideBar from '@/components/side-bar';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable';
import { axiosPrivate } from '@/api/axios';
import { useAuth } from '@/context/auth-provider';
import { useQuery } from '@tanstack/react-query';

function App() {
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [conversationListSize, setConversationListSize] = useState(20);
  const { updateUserData } = useAuth();
  const { data: userData, isSuccess } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => axiosPrivate.get('/api/v1/users/me').then((response) => response.data),
  });

  useEscCloseConvo(setCurrentConversation);

  useEffect(() => {
    if (isSuccess && userData) {
      updateUserData(userData);
    }
    // eslint-disable-next-line
  }, [isSuccess, userData]);

  return (
    <div className="flex h-screen">
      <SideBar />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={0} maxSize={33} defaultSize={20} onResize={(size) => setConversationListSize(size)}>
          <div className="flex flex-col">
            <Header />
            <ConversationList setCurrentConversation={setCurrentConversation} />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <Conversation
            currentConversation={currentConversation}
            conversationSize={conversationListSize}
            key={currentConversation}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function useEscCloseConvo(setCurrentConversation: React.Dispatch<React.SetStateAction<string | null>>) {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCurrentConversation(null);
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [setCurrentConversation]);
}

export default App;
