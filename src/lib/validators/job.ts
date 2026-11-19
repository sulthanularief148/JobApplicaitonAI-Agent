// Zod schema for the job analysis form input.

import { z } from 'zod';

export const jobInputSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(200),
  company: z.string().min(1, 'Company name is required').max(200),
  location: z.string().max(200).optional().default(''),
  description: z
    .string()
    .min(50, 'Job description must be at least 50 characters')
    .max(20000, 'Job description is too long (max 20,000 characters)'),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type JobInput = z.infer<typeof jobInputSchema>;
