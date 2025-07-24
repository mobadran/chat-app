import ConversationList from '@/components/conversation-list';

import { useEffect, useState } from 'react';
import Header from '@/components/header';
import SideBar from '@/components/side-bar';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable';
import { axiosPrivate } from '@/api/axios';
import { useAuth } from '@/context/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

function App() {
  const location = useLocation();
  const [conversationListSize, setConversationListSize] = useState(30);
  const { updateUserData } = useAuth();
  const { data: userData, isSuccess } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => axiosPrivate.get('/api/v1/users/me').then((response) => response.data),
  });

  useEscCloseConvo();

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
            <ConversationList />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div key={location.pathname} className="h-full">
            <Outlet context={{ conversationListSize }} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function useEscCloseConvo() {
  const navigate = useNavigate();
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate('/');
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [navigate]);
}

export default App;
