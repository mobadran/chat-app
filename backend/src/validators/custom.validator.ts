import { z } from 'zod';

const ObjectId = z.string().refine(
  (value) => {
    const objectIdRegex = /^[a-f0-9]{24}$/;
    return objectIdRegex.test(value);
  },
  {
    message: 'Invalid ObjectId',
  },
);

export { ObjectId };
