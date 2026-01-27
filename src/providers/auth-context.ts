import { createContext } from "react";
import { MeResponse } from "@/lib/types";

export const AuthContext = createContext({
	isAuthenticated: false,
	token: null as string | null,
	loading: false,
	login: () => {},
	logout: () => {},
});

type AuthContextType = {
	user: MeResponse | null;
	loading: boolean;
};

export const UserContext = createContext<AuthContextType>({
	user: null,
	loading: true,
});
