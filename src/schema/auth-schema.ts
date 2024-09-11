import { z } from "zod";

const nameRegex = /^[A-Za-z\s]+$/;

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(nameRegex, "Name can only contain letters and spaces"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "More than 10 digits not allowed"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email().optional(),
});

export const loginSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number cannot exceed 10 characters"),
});

export type SignUpType = z.infer<typeof signupSchema>;
export type LoginType = z.infer<typeof loginSchema>;
export type ContactType = z.infer<typeof contactSchema>;
