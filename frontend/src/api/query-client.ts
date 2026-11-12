import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/notifications';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => toast.error('Could not load data', { description: getErrorMessage(error) }),
  }),
});
