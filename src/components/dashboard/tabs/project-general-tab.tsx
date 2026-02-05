import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Project } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { updateProject } from "@/lib/api-keycloak";
import { Textarea } from "@/components/ui/textarea";

export function ProjectGeneralTab({ project }: { project: Project }) {
	const queryClient = useQueryClient();
	const [name, setName] = useState(project.name);
	const [description, setDescription] = useState(project.description ?? "");

	const mutation = useMutation({
		mutationFn: () => updateProject(project.id!, { name, description }),
		onSuccess: () => {
			toast.success("Project updated");
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
		onError: () => {
			toast.error("Failed to update project");
		},
	});

	return (
		<div className="max-w-xl space-y-4">
			<Input id="name" value={name} onChange={(e) => setName(e.target.value)} />

			<Textarea
				placeholder="Description"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>

			<Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
				Save changes
			</Button>
		</div>
	);
}
