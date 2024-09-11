import { z } from "zod";

export const markSpamSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number should not exit 10 digits"),
});

export type SpamSchemaType = z.infer<typeof markSpamSchema>;
