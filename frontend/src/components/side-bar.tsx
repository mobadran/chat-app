import { Settings, UploadIcon } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Dialog } from '@radix-ui/react-dialog';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { queryClient } from '@/api/query-client';

export default function SideBar() {
  const { userData } = useAuth();
  return (
    <nav className="bg-sidebar flex flex-col items-center gap-4 p-4">
      <ChangeAvatar userData={userData} />
      <Settings strokeWidth={1} className="text-muted-foreground h-8 w-8" />
    </nav>
  );
}

function ChangeAvatar({ userData }: { userData: UserData | null }) {
  const axiosPrivate = useAxiosPrivate();
  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    axiosPrivate
      .post('/api/v1/users/me/avatar', formData)
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
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        <img src={userData?.avatar || NO_PFP} alt="Profile" className="h-8 w-8 rounded-full border" />
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center gap-4">
        <DialogTitle>Change User Data</DialogTitle>
        <DialogDescription>Upload a new profile picture</DialogDescription>
        <div className="group relative h-24 w-24">
          <img src={userData?.avatar || NO_PFP} alt="Profile" className="h-24 w-24 rounded-full border" />
          <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
            <UploadIcon className="text-white" />
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}
