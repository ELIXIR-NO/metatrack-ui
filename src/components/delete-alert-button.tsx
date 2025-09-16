import { Trash2 } from "lucide-react";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { deleteSelectedSamples } from "@/lib/api-client";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface DeleteAlertButtonProps {
	projectId: string;
	studyId: string;
	assayId: string;
	item: { id: string } | { id: string }[]; // aceita 1 ou várias rows
	onDeleted?: (deletedIds: string[]) => void;
}

export const DeleteAlertButton = ({
	projectId,
	studyId,
	assayId,
	item,
	onDeleted,
}: DeleteAlertButtonProps) => {
	const queryClient = useQueryClient();

	const handleDelete = async () => {
		const itemsToDelete = Array.isArray(item) ? item : [item];

		try {
			const { success, failed } = await deleteSelectedSamples(
				projectId,
				studyId,
				assayId,
				itemsToDelete
			);

			const now = new Date();
			const formattedDate = now.toLocaleString();

			if (success.length > 0) {
				onDeleted?.(success);
				toast.success("Sample has been deleted", {
					description: `${formattedDate}.`,
					action: {
						label: "Undo",
						onClick: () => console.log("Undo"),
					},
				});
				queryClient.invalidateQueries({
					queryKey: ["samples", projectId, studyId, assayId],
				});
			}

			if (failed.length > 0) {
				console.error("Failed to delete:", failed);
				toast.error(failed, {
					action: {
						label: "Undo",
						onClick: () => console.log("Undo"),
					},
				});
			}
		} catch (error: any) {
			const message = error?.message || "Error to delete";

			toast.error(message, {
				action: {
					label: "Undo",
					onClick: () => console.log("Undo"),
				},
			});
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					className="flex w-full gap-2 px-0 text-left text-red-500 hover:text-red-500"
				>
					<Trash2 />
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your{" "}
						<strong>sample(s)</strong> from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
