import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/auth-client";
import { MeResponse } from "@/lib/types";

export function useUser() {
	return useQuery<MeResponse>({
		queryKey: ["me"],
		queryFn: getMe,
	});
}
