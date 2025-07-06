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
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function CreateConversationButton() {
  const axiosPrivate = useAxiosPrivate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { members: string[]; name: string }) =>
      axiosPrivate.post('/api/v1/conversations', {
        members: data.members,
        name: data.name,
        type: data.members.length === 1 ? 'direct' : 'group',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setIsDialogOpen(false);
    },
  });
  const createConversation = () => {
    if (selectedItems.length === 0) return;
    mutation.mutate({ members: selectedItems, name });
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
