import { createContext, useContext, useEffect, useState } from "react";
import { MeResponse } from "@/lib/types";
import { getMe } from "@/lib/auth-client";
import { AuthContext } from "./auth-context";

type UserContextType = {
	user: MeResponse | null;
	loading: boolean;
};

const UserContext = createContext<UserContextType>({
	user: null,
	loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<MeResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const { isAuthenticated } = useContext(AuthContext);

	useEffect(() => {
		async function loadMe() {
			if (!isAuthenticated) {
				setUser(null);
				setLoading(false);
				return;
			}

			try {
				const me = await getMe();
				setUser(me);
			} catch (err) {
				console.error("Failed to load /me", err);
				setUser(null);
			} finally {
				setLoading(false);
			}
		}

		loadMe();
	}, []);

	return (
		<UserContext.Provider value={{ user, loading }}>
			{children}
		</UserContext.Provider>
	);
}

export function useAuth() {
	return useContext(UserContext);
}
