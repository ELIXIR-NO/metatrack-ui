export default function EmailTemplate({
	firstName,
	lastName,
	email,
	message,
}: {
	firstName: string;
	lastName?: string;
	email: string;
	message: string;
}) {
	const fullName = lastName ? `${firstName} ${lastName}`.trim() : firstName;
	return (
		<div className="flex flex-col space-y-4">
			<h1 className="text-2xl font-bold">Request from Pathogen Portal</h1>
			<h2 className="text-lg font-bold">Requester details</h2>
			<ul className="list-disc">
				<li>
					<span className="font-bold">Name: </span>
					{fullName}
				</li>
				<li>
					<span>email ID: </span>
					{email}
				</li>
			</ul>
			<div>{message}</div>
		</div>
	);
}
