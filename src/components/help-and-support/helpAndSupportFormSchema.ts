import { z } from "zod";

const contactFormSchema = z.object({
	firstName: z.string().min(1).max(32),
	lastName: z.string().max(64).optional(),
	email: z.string().email(),
	subject: z.string().min(1).max(256),
	message: z.string().min(1).max(500),
});

export default contactFormSchema;
export type HelpAndSupportFormSchema = z.infer<typeof contactFormSchema>;
