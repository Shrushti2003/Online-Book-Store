import { z } from "zod";

export const aiRequestSchema = z.object({
  task: z.string().min(2).max(80),
  text: z.string().max(12000).optional(),
  mood: z.string().max(40).optional()
});
