import { z } from "zod";

export const createBookmarkSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  favicon: z.string().url().optional().or(z.literal("")),
  previewImage: z.string().url().optional().or(z.literal("")),
  isFavorite: z.boolean().optional(),
});

export const updateBookmarkSchema = z.object({
  url: z.string().url("Must be a valid URL").optional(),
  title: z.string().min(1, "Title cannot be empty").optional(),
  description: z.string().optional(),
  favicon: z.string().url().optional().or(z.literal("")),
  previewImage: z.string().url().optional().or(z.literal("")),
  isFavorite: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});
