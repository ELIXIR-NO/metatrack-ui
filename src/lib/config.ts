export const API_URL = import.meta.env.PROD
	? "https://api.elixir-uit.sigma2.no"
	: "/api";

export const KEYCLOAK_URL = import.meta.env.PROD
	? "https://keycloak.elixir-uit.sigma2.no"
	: "/keycloak";
