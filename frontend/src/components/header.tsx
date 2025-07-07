import CreateConversationButton from '@/components/create-conversation-button';

export default function Header() {
  return (
    <header className="bg-sidebar flex items-center justify-between gap-2 p-4">
      <h1>Chat App</h1>
      <CreateConversationButton />
    </header>
  );
}
