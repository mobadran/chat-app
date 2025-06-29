import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';

export default function ErrorDialog({ message, open, onOpenChange }: { message: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className="text-center text-red-500">{message}</p>
        </DialogDescription>
        <DialogClose className="btn">Got It</DialogClose>
      </DialogContent>
    </Dialog>
  );
}
