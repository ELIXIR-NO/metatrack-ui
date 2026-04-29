"use server";

//import { Resend } from "resend";
import contactFormSchema, {
	HelpAndSupportFormSchema,
} from "./helpAndSupportFormSchema";
//import EmailTemplate from "./email-template";

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailToElixir(values: HelpAndSupportFormSchema) {
	const validatedValues = contactFormSchema.safeParse(values);

	if (!validatedValues.success) {
		return { error: validatedValues.error };
	}

	try {
		// MOCK: simula uma chamada assíncrona (como se estivesse enviando o email)
		await new Promise((resolve) => setTimeout(resolve, 500));

		return {
			success: true,
			data: {
				id: "mock-email-id-123",
				message: "Email mockado enviado com sucesso",
				mock: true,
			},
		};

		/*
		// NEED SET RESEND_API_KEY

		const resend = new Resend(process.env.RESEND_API_KEY);

		const { data, error } = await resend.emails.send({
			to: ["support@elixir.no"],
			from: "Pathogen Portal Norway <no-reply@pathogens.no>",
			subject: validatedValues.data.subject,
			react: EmailTemplate({
				firstName: validatedValues.data.firstName,
				lastName: validatedValues.data.lastName,
				email: validatedValues.data.email,
				message: validatedValues.data.message,
			}),
		});

		if (error) {
			return { error };
		}

		return { success: true, data };
		*/
	} catch (error) {
		return { error };
	}
}
