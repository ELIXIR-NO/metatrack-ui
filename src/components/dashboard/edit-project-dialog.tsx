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
import { useState } from "react";

interface EditProjectDialogProps {
	project: Project | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialTab?: "general" | "members";
}

export function EditProjectDialog({
	project,
	open,
	onOpenChange,
	initialTab = "general",
}: EditProjectDialogProps) {
	const [activeTab, setActiveTab] = useState<"general" | "members">(initialTab);
	const [prevOpen, setPrevOpen] = useState(open);

	if (open && !prevOpen) {
		setPrevOpen(true);
		setActiveTab(initialTab);
	} else if (!open && prevOpen) {
		setPrevOpen(false);
	}

	if (!project) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl" aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>Edit project</DialogTitle>
				</DialogHeader>

				<Tabs
					value={activeTab}
					onValueChange={(val: string) =>
						setActiveTab(val as "general" | "members")
					}
					className="mt-4"
				>
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
