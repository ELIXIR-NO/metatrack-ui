import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
	url: "https://keycloak.elixir-uit.sigma2.no",
	realm: "metatrack",
	clientId: "metatrack-spa",
});
