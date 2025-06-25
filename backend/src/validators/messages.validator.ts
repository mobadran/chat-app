import { z } from 'zod';

const SendMessage = z.object({
  body: z.object({
    content: z.string(),
  }),
});

export default { SendMessage };
