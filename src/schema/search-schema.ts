import { z } from "zod";

export const searchNameSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

export const searchNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits long")
    .max(15, "Phone number is too long"),
});

export const searchSchema = z.object({
  phoneNumber: z.string().optional(),
  name: z.string().optional(),
});
