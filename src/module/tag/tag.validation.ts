import { z } from "zod";

export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(30, "Tag name cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9-_]+$/, "Tag name can only contain letters, numbers, hyphens, and underscores"),
});

export const updateTagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(30, "Tag name cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9-_]+$/, "Tag name can only contain letters, numbers, hyphens, and underscores"),
});
