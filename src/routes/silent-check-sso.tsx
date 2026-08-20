import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/silent-check-sso")({
	component: SilentCheckSso,
});

function SilentCheckSso() {
	useEffect(() => {
		window.parent.postMessage(window.location.href, window.location.origin);
	}, []);
}
