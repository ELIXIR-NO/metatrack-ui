const partners = [
	{
		name: "The Arctic University of Norway (UiT)",
		url: "https://uit.no",
		logo: "/logos/orgs/uit.svg",
	},
	{
		name: "University of Bergen (UiB)",
		url: "https://uib.no",
		logo: "/logos/orgs/uib.svg",
	},
	{
		name: "Norwegian University of Science and Technology (NTNU)",
		url: "https://ntnu.no",
		logo: "/logos/orgs/ntnu.svg",
	},
	{
		name: "University of Oslo (UiO)",
		url: "https://uio.no",
		logo: "/logos/orgs/uio.svg",
	},
	{
		name: "Norwegian University of Life Sciences (NMBU)",
		url: "https://nmbu.no",
		logo: "/logos/orgs/nmbu.svg",
	},
	{
		name: "Norwegian Institute of Public Health (FHI)",
		url: "https://fhi.no",
		logo: "/logos/partners/logo-fhi-black_new.svg",
	},
	{
		name: "Norwegian Veterinary Institute",
		url: "https://vetinst.no",
		logo: "/logos/partners/vetinst-logo-black.svg",
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

function PartnerList() {
	return (
		<ul className="mx-auto grid max-w-6xl grid-cols-2 gap-14 py-8 md:grid-cols-3 lg:grid-cols-4">
			{partners.map((p) => (
				<li key={p.name} className="flex items-center justify-center">
					<ExternalLink href={p.url}>
						<img
							src={p.logo}
							alt={p.name}
							className="h-28 object-contain transition-transform duration-200 hover:scale-105"
						/>
					</ExternalLink>
				</li>
			))}
		</ul>
	);
}

export default function Behind() {
	return (
		<>
			<h5 className="max-w-6xl text-justify text-xl leading-relaxed lg:mx-auto lg:py-4">
				The <strong>MetaTrack </strong> is developed and operated by{" "}
				<ExternalLink href="https://elixir.no">ELIXIR Norway</ExternalLink>, the
				national node of the European ELIXIR infrastructure for life science
				data.
				<br />
				<br />
				ELIXIR Norway brings together national expertise in{" "}
				<strong>
					data management, bioinformatics, and e-infrastructure
				</strong>{" "}
				through its partners at:
			</h5>

			<PartnerList />
		</>
	);
}
