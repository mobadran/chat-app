import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

async function Main() {
  // const api = process.env.API_URL;
  // const chats = await fetch(`${api}/conversations`, {
  //   credentials: 'include',
  // }).then((res) => res.json());
  const chats = [
    { id: 1, name: 'Chat 1' },
    { id: 2, name: 'Chat 2' },
    { id: 3, name: 'Chat 3' },
    { id: 4, name: 'Chat 4' },
    { id: 5, name: 'Chat 5' },
    { id: 6, name: 'Chat 6' },
    { id: 7, name: 'Chat 7' },
    { id: 8, name: 'Chat 8' },
    { id: 9, name: 'Chat 9' },
    { id: 10, name: 'Chat 10' },
    { id: 11, name: 'Chat 11' },
    { id: 12, name: 'Chat 12' },
    { id: 13, name: 'Chat 13' },
    { id: 14, name: 'Chat 14' },
    { id: 15, name: 'Chat 15' },
    { id: 16, name: 'Chat 16' },
    { id: 17, name: 'Chat 17' },
    { id: 18, name: 'Chat 18' },
    { id: 19, name: 'Chat 19' },
    { id: 20, name: 'Chat 20' },
    { id: 21, name: 'Chat 21' },
    { id: 22, name: 'Chat 22' },
    { id: 23, name: 'Chat 23' },
    { id: 24, name: 'Chat 24' },
    { id: 25, name: 'Chat 25' },
    { id: 26, name: 'Chat 26' },
    { id: 27, name: 'Chat 27' },
    { id: 28, name: 'Chat 28' },
    { id: 29, name: 'Chat 29' },
    { id: 30, name: 'Chat 30' },
  ];

  return (
    <main className="container mx-auto flex min-h-0 flex-1 flex-col py-4">
      <h2 className="mb-4 text-lg font-medium">Chats</h2>
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-4">
          {chats.map((chat) => (
            <React.Fragment key={chat.id}>
              <div className="text-sm">{chat.name}</div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </main>
  );
}

export default Main;
