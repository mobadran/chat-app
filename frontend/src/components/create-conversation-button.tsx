import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { DialogClose } from '@radix-ui/react-dialog';
import CreateConversationUserList from './create-conversation-user-list';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CreateConversationButton() {
  const axiosPrivate = useAxiosPrivate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [name, setName] = useState('');
  const createConversation = () => {
    if (selectedItems.length === 0) return;
    axiosPrivate
      .post('/api/v1/conversations', {
        members: selectedItems,
        name,
        type: selectedItems.length === 1 ? 'direct' : 'group',
      })
      .then(() => {
        setSelectedItems([]);
        setName('');
      });
  };
  return (
    <Dialog>
      <DialogTrigger className="btn">Create Conversation</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Conversation</DialogTitle>
          <DialogDescription>Select the users you want to chat with.</DialogDescription>
        </DialogHeader>
        <Input placeholder="Conversation name" value={name} onChange={(e) => setName(e.target.value)} />
        <CreateConversationUserList selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
        <DialogFooter>
          <DialogClose className="btn-outline h-10">Cancel</DialogClose>
          <Button className="text-md h-10" onClick={createConversation}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
