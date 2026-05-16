import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
	DialogTrigger,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Checkbox } from "@/components/shadcn/checkbox";
import { useCreateAdminApiKey } from "../../hooks/use-create-admin-api-key";

const createSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional().or(z.literal("")),
	permissions: z.string().optional().or(z.literal("")),
	disabled: z.boolean().optional(),
});

type CreateForm = z.infer<typeof createSchema>;

export const CreateAdminApiKeyDialog = ({
	projectId,
}: {
	projectId: string;
}) => {
	const [open, setOpen] = useState(false);
	const { mutate: createApiKey, isPending } = useCreateAdminApiKey();

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<CreateForm>({
		resolver: zodResolver(createSchema),
		defaultValues: {
			name: "",
			description: "",
			permissions: "",
			disabled: false,
		},
	});

	useEffect(() => {
		if (!open) {
			reset();
		}
	}, [open, reset]);

	const onSubmit = async (values: CreateForm) => {
		createApiKey(
			{
				projectId,
				name: values.name,
				description: values.description ?? "",
				permissions: (values.permissions ?? "")
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean),
			},
			{
				onSuccess: () => {
					setOpen(false);
					reset();
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default">Create API Key</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Create API Key</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<div>
						<Label className="text-sm font-medium">Name</Label>
						<Input {...register("name")} />
						{errors.name && (
							<div className="text-xs text-destructive">
								{String(errors.name.message)}
							</div>
						)}
					</div>

					<div>
						<Label className="text-sm font-medium">Description</Label>
						<Input {...register("description")} />
					</div>

					<div>
						<Label className="text-sm font-medium">
							Permissions (comma separated)
						</Label>
						<Input {...register("permissions")} />
					</div>

					<div className="flex items-center gap-2">
						<Controller
							control={control}
							name="disabled"
							render={({ field }) => (
								<Checkbox
									checked={field.value}
									onCheckedChange={(v) => field.onChange(Boolean(v))}
								/>
							)}
						/>
						<span className="text-sm">Disabled</span>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="ghost" type="button">
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={isSubmitting || isPending}>
							Create
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateAdminApiKeyDialog;
