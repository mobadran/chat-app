import { useState } from 'react';
import { Button } from '@/components/ui/button';

function App() {
  const [state, setState] = useState(0);
  return (
    <div className='flex flex-col items-center h-screen justify-center gap-4'>
      <h1>Chat App</h1>
      <Button onClick={() => setState(state + 1)}>{state}</Button>
    </div>
  );
}

export default App;
