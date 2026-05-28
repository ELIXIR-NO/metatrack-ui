import { api } from "./api-keycloak";
import type { MeResponse } from "./types";

export function getMe(): Promise<MeResponse> {
	return api("whoami") as Promise<MeResponse>;
}
