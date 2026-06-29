export const API_URL = import.meta.env.PROD
	? "https://api.metatrack.no/api"
	: "http://localhost:1234/api";

export const API_BASE_URL = import.meta.env.PROD
	? "https://api.metatrack.no"
	: "http://localhost:1234";

export const KEYCLOAK_URL = import.meta.env.PROD
	? "https://auth.metatrack.no"
	: "/keycloak";
