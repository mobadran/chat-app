import ConversationList from '@/components/conversation-list';
import Conversation from '@/components/conversation';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import SideBar from '@/components/side-bar';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable';
import { axiosPrivate } from './api/axios';
import { useAuth } from './context/auth-provider';

function App() {
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [conversationListSize, setConversationListSize] = useState(20);
  const { updateUserData } = useAuth();

  useEffect(() => {
    axiosPrivate.get('/api/v1/users/me').then((response) => updateUserData(response.data));
    // eslint-disable-next-line
  }, []);

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
          <Conversation currentConversation={currentConversation} conversationSize={conversationListSize} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;
