import { useEffect, useState } from "react";
import { keycloak } from "../lib/keycloak";
import { AuthContext } from "./auth-context";

export function KeycloakProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		if (initialized) return;
		setInitialized(true);

		keycloak
			.init({
				onLoad: "check-sso",
				pkceMethod: "S256",
				checkLoginIframe: false,
			})
			.then((authenticated) => {
				setIsAuthenticated(authenticated);
				setToken(keycloak.token ?? null);

				setInterval(() => {
					keycloak.updateToken(30).then((refreshed) => {
						if (refreshed) {
							setToken(keycloak.token ?? null);
						}
					});
				}, 10000);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [initialized]);

	const login = () =>
		keycloak.login({
			redirectUri: `${window.location.origin}/dashboard`,
		});

	const logout = () =>
		keycloak.logout({
			redirectUri: window.location.origin,
		});

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, token, loading, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}
