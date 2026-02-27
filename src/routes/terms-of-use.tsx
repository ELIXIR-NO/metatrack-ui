import { createFileRoute } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";

import termsOfUse from "@/content/terms-of-use.md?raw";

export const Route = createFileRoute("/terms-of-use")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mx-auto max-w-6xl px-6 py-12">
			<article className="prose prose-neutral max-w-none">
				<ReactMarkdown
					components={{
						p: ({ node, ...props }) => <p className="mb-2" {...props} />,
						a: ({ node, ...props }) => (
							<a
								className="text-blue-600 hover:underline"
								target="_blank"
								rel="noopener noreferrer"
								{...props}
							/>
						),
						ul: ({ node, ...props }) => (
							<ul className="ml-6 list-disc" {...props} />
						),
						li: ({ node, ...props }) => <li className="my-2" {...props} />,
						hr: ({ node, ...props }) => (
							<hr className="my-4 border-gray-300" {...props} />
						),
					}}
				>
					{termsOfUse}
				</ReactMarkdown>
			</article>
		</div>
	);
}
