import { z } from 'zod';

const UpdateUser = z.object({
  body: z.object({
    displayName: z.string().min(3).max(32),
  }),
});

export default { UpdateUser };
