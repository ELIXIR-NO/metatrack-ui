import { createContext } from "react";

export const AuthContext = createContext({
	isAuthenticated: false,
	token: null as string | null,
	loading: false,
	login: () => {},
	logout: () => {},
});
