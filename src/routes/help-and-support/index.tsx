import { createFileRoute } from "@tanstack/react-router";
import HelpAndSupportForm from "../../components/help-and-support/help-and-support-form";

export const Route = createFileRoute("/help-and-support/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mx-auto max-w-6xl px-6 py-12">
			<div className="text-medium pb-6 text-justify font-normal">
				We are happy for any input and suggestions about the MetaTrack website.
				Contact us at{" "}
				<a
					className="visited:text-destructive text-blue-500"
					href="mailto:support@elixir.no"
				>
					support@elixir.no
				</a>{" "}
				or use the contact form below.
			</div>
			<HelpAndSupportForm />
		</div>
	);
}
