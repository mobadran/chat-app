import CreateConversationButton from '@/components/create-conversation-button';
import { useAuth } from '@/context/auth-provider';

export default function Header() {
  const { userData } = useAuth();
  return (
    <header className="bg-sidebar flex items-center justify-between gap-2 p-4">
      {/* <h1>Chat App</h1> */}
      <p>{userData?.displayName}</p>
      <div>
        <CreateConversationButton />
      </div>
    </header>
  );
}
