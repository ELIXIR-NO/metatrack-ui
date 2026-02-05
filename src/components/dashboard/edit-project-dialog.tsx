"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "@/lib/types";
import { ProjectGeneralTab } from "./tabs/project-general-tab";
import { ProjectMembersTab } from "./tabs/project-members-tab";

interface EditProjectDialogProps {
	project: Project | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditProjectDialog({
	project,
	open,
	onOpenChange,
}: EditProjectDialogProps) {
	if (!project) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>Edit project</DialogTitle>
				</DialogHeader>

				<Tabs defaultValue="general" className="mt-4">
					<TabsList>
						<TabsTrigger value="general">General</TabsTrigger>
						<TabsTrigger value="members">Members</TabsTrigger>
					</TabsList>

					<TabsContent value="general">
						<ProjectGeneralTab project={project} />
					</TabsContent>

					<TabsContent value="members">
						<ProjectMembersTab project={project} />
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
