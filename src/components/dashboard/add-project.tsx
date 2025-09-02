import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	createInvestigation,
	createProjectWithStudyAndAssay,
} from "@/lib/api-client";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function AddProjectDialog() {
	const [identifier, setIdentifier] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [filename, setFilename] = useState("");
	const [open, setOpen] = useState(false);

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: createProjectWithStudyAndAssay,
		onSuccess: (newProject) => {
			queryClient.setQueryData(["projects"], (old: any[] = []) => [
				newProject.project,
				...old,
			]);

			setIdentifier("");
			setTitle("");
			setDescription("");
			setFilename("");
			setOpen(false);

			const now = new Date();
			const formattedDate = now.toLocaleString();

			toast.success("Project has been created", {
				description: `${formattedDate}.`,
				action: {
					label: "Undo",
					onClick: () => console.log("Undo"),
				},
			});
		},

		onError: (error: any) => {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				"Error creating project";

			toast.error(message, {
				action: {
					label: "Undo",
					onClick: () => console.log("Undo"),
				},
			});
		},
	});

	const handleCreate = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate({
			identifier,
			title,
			description,
			filename,
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Add Project</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleCreate} className="space-y-4">
					<DialogHeader>
						<DialogTitle>Create New Project</DialogTitle>
					</DialogHeader>

					<div className="space-y-2">
						{/* Project Identifier */}
						<div className="flex items-center gap-2">
							<label htmlFor="identifier" className="font-medium">
								Project Identifier <span className="text-red-500">*</span>
							</label>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<HelpCircle className="h-4 w-4 cursor-pointer text-gray-500" />
									</TooltipTrigger>
									<TooltipContent>
										<p>
											The identifier of your project. This field is required.
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						<Input
							id="identifier"
							placeholder="Identifier"
							value={identifier}
							onChange={(e) => setIdentifier(e.target.value)}
							required
						/>

						{/* Project Title */}
						<div className="flex items-center gap-2">
							<label htmlFor="projectName" className="font-medium">
								Project Title <span className="text-red-500">*</span>
							</label>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<HelpCircle className="h-4 w-4 cursor-pointer text-gray-500" />
									</TooltipTrigger>
									<TooltipContent>
										<p>
											The main title of your project. This field is required.
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						<Input
							id="projectName"
							placeholder="Project Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>

						{/* Description */}
						<div className="flex items-center gap-2">
							<label htmlFor="description" className="font-medium">
								Description
							</label>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<HelpCircle className="h-4 w-4 cursor-pointer text-gray-500" />
									</TooltipTrigger>
									<TooltipContent>
										<p>Optional description to explain the project.</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						<Input
							id="description"
							placeholder="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>

						{/* File Name */}
						<div className="flex items-center gap-2">
							<label htmlFor="fileName" className="font-medium">
								File Name
							</label>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<HelpCircle className="h-4 w-4 cursor-pointer text-gray-500" />
									</TooltipTrigger>
									<TooltipContent>
										<p>Optional file name related to this project.</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						<Input
							id="fileName"
							placeholder="File Name"
							value={filename}
							onChange={(e) => setFilename(e.target.value)}
						/>
					</div>

					<DialogFooter className="flex justify-between">
						<DialogClose asChild>
							<Button variant="outline" type="button">
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={mutation.isPending}>
							{mutation.isPending ? "Creating Project..." : "Create Project"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
