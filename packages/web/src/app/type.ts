import { z } from 'zod';

export const Mode = z.enum(['View', 'Edit']);
export type Mode = z.infer<typeof Mode>;
