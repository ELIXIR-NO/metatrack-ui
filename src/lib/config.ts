export const API_URL = import.meta.env.PROD
	? "https://api.metatrack.no/api"
	: "/api";

export const KEYCLOAK_URL = import.meta.env.PROD
	? "https://auth.metatrack.no"
	: "/keycloak";
