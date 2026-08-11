import { useQueries } from "@tanstack/react-query";
import { getTaxon } from "@/lib/api-keycloak";
import type { Sample } from "@/lib/types";

export function useEnrichedSamples(samples: Sample[], enabled = true) {
	if (!enabled) {
		return samples;
	}

	const uniqueTaxIds = [
		...new Set(samples.map((s) => s.taxId).filter(Boolean)),
	];
	const uniqueHostTaxIds = [
		...new Set(samples.map((s) => s.hostTaxId).filter(Boolean)),
	];

	const taxonQueries = useQueries({
		queries: uniqueTaxIds.map((id) => ({
			queryKey: ["taxon", id],
			queryFn: () => getTaxon(String(id)),
			enabled: !!id,
		})),
	});

	const hostTaxonQueries = useQueries({
		queries: uniqueHostTaxIds.map((id) => ({
			queryKey: ["taxon", id],
			queryFn: () => getTaxon(String(id)),
			enabled: !!id,
		})),
	});

	const taxonMap = new Map(
		uniqueTaxIds.map((id, index) => [id, taxonQueries[index]?.data?.name ?? ""])
	);

	const hostTaxonMap = new Map(
		uniqueHostTaxIds.map((id, index) => [
			id,
			hostTaxonQueries[index]?.data?.name ?? "",
		])
	);

	return samples.map((sample) => ({
		...sample,
		taxonName: taxonMap.get(sample.taxId) ?? "",
		hostTaxonName: hostTaxonMap.get(sample.hostTaxId) ?? "",
	}));
}
