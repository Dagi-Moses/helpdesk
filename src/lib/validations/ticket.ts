import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(3, "Title needs at least 3 characters"),
  description: z.string().min(10, "Give a bit more detail (10+ characters)"),
  categoryId: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
});
export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const commentSchema = z.object({
  body: z.string().min(1, "Comment can't be empty"),
  isInternal: z.boolean().optional(),
});
export type CommentInput = z.infer<typeof commentSchema>;
