import { api } from "./api-keycloak";
import { MeResponse } from "./types";

export function getMe(): Promise<MeResponse> {
	return api("whoami") as Promise<MeResponse>;
}
