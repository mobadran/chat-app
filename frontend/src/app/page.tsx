import Header from '@/components/header';
import Main from '@/components/main';

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <Main />
    </div>
  );
}
