import { Button } from "@/components/ui/button";
import { addProjectMember } from "@/lib/api-keycloak";
import { Project } from "@/lib/types";
import { toast } from "sonner";

export function ProjectMembersTab({ project }: { project: Project }) {
	return (
		<div className="space-y-4">
			<p className="text-muted-foreground text-sm">Manage project members</p>

			<Button
				onClick={() =>
					addProjectMember(project.id!, "user-id", "OWNER")
						.then(() => toast.success("Member added"))
						.catch(() => toast.error("Error adding member"))
				}
			>
				Add member
			</Button>
		</div>
	);
}
