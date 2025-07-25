import { Settings, UploadIcon } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Dialog } from '@radix-ui/react-dialog';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { queryClient } from '@/api/query-client';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { useState } from 'react';

export default function SideBar() {
  const { userData } = useAuth();
  return (
    <nav className="bg-sidebar flex flex-col items-center gap-4 p-4">
      <UpdateData userData={userData} />
      <Settings strokeWidth={1} className="text-muted-foreground h-8 w-8" />
    </nav>
  );
}

function UpdateData({ userData }: { userData: UserData | null }) {
  const axiosPrivate = useAxiosPrivate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState(userData?.displayName || '');

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    axiosPrivate
      .post('/api/v1/users/avatar', formData)
      .then(() => {
        console.log('Successful');
        // Revalidate query
        queryClient.invalidateQueries({
          queryKey: ['user', 'me'],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    axiosPrivate
      .patch('/api/v1/users', { displayName })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ['user', 'me'],
        });
        setDialogOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger className="cursor-pointer">
        <img src={userData?.avatar || NO_PFP} alt="Profile" className="h-8 w-8 rounded-full border" />
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center gap-4">
        <DialogTitle>Change User Data</DialogTitle>
        <DialogDescription className="sr-only">Upload a new profile picture</DialogDescription>
        <div className="group relative h-24 w-24">
          <img src={userData?.avatar || NO_PFP} alt="Profile" className="h-24 w-24 rounded-full border" />
          <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
            <UploadIcon className="text-white" />
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
            }}
          />
          <Button type="submit">Update</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
