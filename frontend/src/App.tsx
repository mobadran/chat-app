import ConversationList from '@/components/conversation-list';
import Conversation from '@/components/conversation';
import { useState } from 'react';
import Header from '@/components/header';
import SideBar from '@/components/side-bar';

function App() {
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex basis-1/3 flex-col">
        <Header />
        <ConversationList setCurrentConversation={setCurrentConversation} />
      </div>
      <Conversation currentConversation={currentConversation} />
    </div>
  );
}

export default App;
