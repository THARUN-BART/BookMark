import { z } from "zod";

export const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(50, "Folder name cannot exceed 50 characters"),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(50, "Folder name cannot exceed 50 characters"),
});
