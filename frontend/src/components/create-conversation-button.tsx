import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';

export default function CreateConversationButton() {
  return (
    <Dialog>
      <DialogTrigger className="btn">Create Conversation</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Conversation</DialogTitle>
          <DialogDescription>Select the users you want to chat with.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className="btn-outline">Cancel</DialogClose>
          <DialogClose className="btn btn-primary">Create</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
