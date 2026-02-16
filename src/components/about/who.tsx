const serves = [
	"Research institutions and universities",
	"Diagnostic and public health laboratories",
	"Hospitals and biobanks",
	"Environmental and food safety agencies",
	"Industry and innovation partners",
	"It supports both small research projects and larger national or cross-institutional collaborations.",
];

export default function Who() {
	return (
		<>
			<h5 className="max-w-6xl text-justify text-xl leading-relaxed lg:mx-auto lg:py-4">
				MetaTrack is designed for organisations and stakeholders working with
				life-science data, including:
			</h5>
			<ul className="max-w-6xl list-disc pl-6 text-justify text-xl leading-relaxed lg:mx-auto lg:py-4">
				{serves.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		</>
	);
}
