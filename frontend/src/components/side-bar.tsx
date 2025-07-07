import { Settings } from 'lucide-react';

export default function SideBar() {
  return (
    <nav className="bg-sidebar flex flex-col items-center gap-4 p-4">
      <img
        src="https://res.cloudinary.com/dqdmrudnh/image/upload/v1751855764/no-pfp_srllpf.jpg"
        alt="Profile"
        className="h-8 w-8 rounded-full"
      />
      <Settings strokeWidth={1} className="text-muted-foreground h-8 w-8" />
    </nav>
  );
}
