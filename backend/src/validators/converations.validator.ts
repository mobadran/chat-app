import { z } from 'zod';
import { ObjectId } from '#validators/custom.validator.js';

const CreateConversation = z.object({
  body: z.object({
    type: z.enum(['direct', 'group']),
    name: z.string().optional(),
    members: z
      .array(z.string())
      .min(1)
      .refine((items) => new Set(items).size === items.length, {
        message: 'Members array cannot contain duplicate usernames.',
      }),
  }),
});

const GetConversation = z.object({
  params: z.object({
    id: ObjectId,
  }),
});

export default { CreateConversation, GetConversation };
