import { Settings } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Dialog } from '@radix-ui/react-dialog';

export default function SideBar() {
  const { userData } = useAuth();
  return (
    <nav className="bg-sidebar flex flex-col items-center gap-4 p-4">
      <Dialog>
        <DialogTrigger>
          <img src={userData?.avatar || NO_PFP} alt="Profile" className="h-8 w-8 rounded-full border" />
        </DialogTrigger>
        <DialogContent>
          <img src={userData?.avatar || NO_PFP} alt="Profile" className="h-8 w-8 rounded-full border" />
        </DialogContent>
      </Dialog>
      <Settings strokeWidth={1} className="text-muted-foreground h-8 w-8" />
    </nav>
  );
}
