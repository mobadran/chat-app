import CreateConversationButton from '@/components/create-conversation-button';

export default function Header() {
  return (
    <header className='p-4 flex justify-between items-center'>
      <h1>Chat App</h1>
      <CreateConversationButton />
    </header>
  );
}
