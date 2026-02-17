const funding = [
	{
		name: "nfr logo",
		url: "https://www.forskningsradet.no",
		logo: "/logos/orgs/nfr.svg",
	},
];

function ExternalLink({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) {
	return (
		<a
			className="text-blue-600 hover:underline"
			href={href}
			target="_blank"
			rel="noopener noreferrer"
		>
			{children}
		</a>
	);
}

function FundingList() {
	return (
		<ul className="mx-auto grid max-w-6xl gap-14 py-8">
			{funding.map((p) => (
				<li
					key={p.name}
					className="flex flex-col items-center justify-center gap-4 text-2xl"
				>
					<ExternalLink href={p.url}>
						<img
							src={p.logo}
							alt={p.name}
							className="h-28 object-contain transition-transform duration-200 hover:scale-105"
						/>
					</ExternalLink>
					<div>
						Financed by the Research Council of Norway's grant{" "}
						<a
							className="text-blue-600 hover:underline"
							href="https://prosjektbanken.forskningsradet.no/project/FORISS/350529"
							target="_blank"
							rel="noopener noreferrer"
						>
							350529
						</a>
					</div>
				</li>
			))}
		</ul>
	);
}

export default function Funding() {
	return (
		<>
			<h5 className="max-w-6xl text-justify text-xl leading-relaxed lg:mx-auto lg:py-4">
				MetaTrack is <strong>funded by the Research Council of Norway</strong> (
				<a
					className="text-blue-600 hover:underline"
					href="https://www.forskningsradet.no"
					target="_blank"
					rel="noopener noreferrer"
				>
					NFR
				</a>
				) under the national research infrastructure programme, supporting
				long-term access to high-quality data and tools for the Norwegian life
				science community.
			</h5>

			<FundingList />
		</>
	);
}
