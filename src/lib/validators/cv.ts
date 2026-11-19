// Zod schemas for CV-related validation.

import { z } from 'zod';

// Validates the text content saved for a CV
export const cvTextSchema = z.object({
  raw_text: z
    .string()
    .min(50, 'CV text is too short — make sure the PDF has readable text')
    .max(50000, 'CV text is too long (max 50,000 characters)'),
  file_name: z
    .string()
    .min(1, 'File name is required'),
});

export type CVTextInput = z.infer<typeof cvTextSchema>;
