import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
	url: "https://auth.metatrack.no",
	realm: "metatrack",
	clientId: "metatrack-spa",
});
