import ConversationList from '@/components/conversation-list';
import Conversation from '@/components/conversation';
import { useState } from 'react';
import Header from '@/components/header';
import SideBar from '@/components/side-bar';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable';

function App() {
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [conversationSize, setConversationSize] = useState(66);
  return (
    <div className="flex h-screen">
      <SideBar />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={0} maxSize={33}>
          <div className="flex flex-col">
            <Header />
            <ConversationList setCurrentConversation={setCurrentConversation} />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          onResize={(size) => {
            setConversationSize(size);
          }}
        >
          <Conversation currentConversation={currentConversation} conversationSize={conversationSize} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;
