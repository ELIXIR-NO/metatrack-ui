import { createContext, useContext, useState, useEffect } from "react";
import { fetchUserInfo, logout } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { User } from "@/lib/types";

type AuthUser = User | null;

const AuthContext = createContext<{
	user: AuthUser;
	loading: boolean;
	setUser: (u: AuthUser) => void;
	logoutUser: () => Promise<void>;
}>({
	user: null,
	loading: true,
	setUser: () => {},
	logoutUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser>(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		fetchUserInfo()
			.then((data) => setUser(data))
			.catch(() => setUser(null))
			.finally(() => setLoading(false));
	}, []);

	const logoutUser = async () => {
		try {
			await logout();
			setUser(null);
			navigate({ to: "/" });
		} catch (err) {
			console.error("Logout failed", err);
		}
	};

	return (
		<AuthContext.Provider value={{ user, loading, setUser, logoutUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
