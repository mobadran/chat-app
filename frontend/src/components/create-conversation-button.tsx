import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { DialogClose } from '@radix-ui/react-dialog';
import CreateConversationUserList from '@/components/create-conversation-user-list';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CirclePlus } from 'lucide-react';

export default function CreateConversationButton() {
  const axiosPrivate = useAxiosPrivate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDirect, setIsDirect] = useState(true);
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
      <DialogTrigger className="hover:cursor-pointer">
        <CirclePlus />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center justify-center gap-4">
          <Button variant={isDirect ? 'default' : 'outline'} onClick={() => setIsDirect(true)}>
            Direct
          </Button>
          <Button variant={isDirect ? 'outline' : 'default'} onClick={() => setIsDirect(false)}>
            Group
          </Button>
        </DialogHeader>
        {!isDirect && <Input placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />}
        {isDirect ? (
          <Input placeholder="Type to add user..." onChange={(e) => setSelectedItems([e.target.value])} />
        ) : (
          <CreateConversationUserList selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
        )}
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
