import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/auth-client";
import type { MeResponse } from "@/lib/types";

export function useUser(enabled: boolean = true) {
	return useQuery<MeResponse>({
		queryKey: ["me"],
		queryFn: getMe,
		enabled,
	});
}
