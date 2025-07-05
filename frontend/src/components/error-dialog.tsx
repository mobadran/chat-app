import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';

export default function ErrorDialog({ message, open, onOpenChange }: { message: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
        </DialogHeader>
        <DialogDescription className='text-center text-red-500'>
          {message}
        </DialogDescription>
        <DialogClose className="btn">Got It</DialogClose>
      </DialogContent>
    </Dialog>
  );
}