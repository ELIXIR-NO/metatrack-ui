import { User } from "./types";

const API_URL = "http://localhost:8080";

export async function login(user: User) {
	const res = await fetch(`${API_URL}/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username: user.username,
			password: user.password,
		}),
	});

	if (!res.ok) {
		throw new Error("Login failed");
	}

	const data = await res.json();

	localStorage.setItem("access_token", data.access_token);

	return data;
}

export async function register(userData: User) {
	const res = await fetch(`${API_URL}/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userData),
	});

	if (!res.ok) {
		let errorMessage = "Registration failed";
		try {
			const data = await res.json();
			errorMessage = data?.message || errorMessage;
		} catch {}
		throw new Error(errorMessage);
	}

	try {
		return await res.json();
	} catch {
		return { message: "User registered successfully" };
	}
}

export async function logout() {
	const refresh_token = localStorage.getItem("refresh_token");

	const response = await fetch(`${API_URL}/auth/logout`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ refresh_token }),
	});

	localStorage.removeItem("access_token");
	localStorage.removeItem("refresh_token");

	if (
		response.ok &&
		response.headers.get("Content-Type")?.includes("application/json")
	) {
		return response.json();
	}

	return null;
}

export async function fetchUserInfo() {
	const accessToken = localStorage.getItem("access_token");

	if (!accessToken) {
		throw new Error("No access token found");
	}

	const response = await fetch(`${API_URL}/api/v1/me`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch user info");
	}

	return response.json();
}
