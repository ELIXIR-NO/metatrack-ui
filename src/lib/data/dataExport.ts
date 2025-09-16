const DownloadTSV = <T extends Record<string, any>>(
	data: T[],
	fileName: string
) => {
	const convertToDelimited = (data: T[], delimiter: string) => {
		if (!data || data.length === 0) {
			return "";
		}

		const header = Object.keys(data[0]).join(delimiter);
		const rows = data.map((row) =>
			Object.values(row)
				.map((value) => (typeof value === "string" ? `"${value}"` : value))
				.join(delimiter)
		);
		return [header, ...rows].join("\n");
	};

	const delimiter = "\t";
	const content = convertToDelimited(data, delimiter);

	const blob = new Blob([content], {
		type: "text/plain;charset=utf-8;",
	});

	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.setAttribute("href", url);
	link.setAttribute("download", `${fileName}.${"tsv"}`);
	link.click();
	URL.revokeObjectURL(url);
};

export default DownloadTSV;
