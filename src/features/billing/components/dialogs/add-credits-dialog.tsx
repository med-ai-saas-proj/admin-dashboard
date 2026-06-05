import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Dialog,
	DialogHeader,
	DialogTrigger,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/shadcn/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/shadcn/field";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { toScaledAmount } from "@/features/billing/utils/billing-amount-calculation";
import { useAddCredits } from "@/features/billing/hooks/use-add-credits";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAdminOrganizationDetailsStore } from "@/features/admin-organization-details/store/admin-organization-details";

const createAmountSchema = (messages: { minValue: string }) =>
	z.number().min(0, messages.minValue);

const createAddCreditSchema = (messages: { descriptionMax: string }) =>
	z.object({
		description: z.string().max(255, messages.descriptionMax).optional(),
	});

type AddCreditFormData = z.infer<ReturnType<typeof createAddCreditSchema>>;
type AddCreditDialogProps = {
	triggerElement: React.ReactNode;
};

const AddCreditDialog = ({ triggerElement }: AddCreditDialogProps) => {
	const { t } = useTranslation("billing");
	const { t: tDialog } = useTranslation("dialog");
	const { t: tCommon } = useTranslation("common");
	const { orgId } = useParams<{
		orgId: string;
	}>();
	const storedOrganizationId = useAdminOrganizationDetailsStore(
		(state) => state.organizationId
	);

	const validationMessages = useMemo(
		() => ({
			minValue: t("validation.amount.min"),
			descriptionMax: t("validation.description.max"),
		}),
		[t]
	);
	const amountSchema = useMemo(
		() => createAmountSchema(validationMessages),
		[validationMessages]
	);
	const addCreditSchema = useMemo(
		() => createAddCreditSchema(validationMessages),
		[validationMessages]
	);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AddCreditFormData>({
		resolver: zodResolver(addCreditSchema),
		defaultValues: {
			description: "",
		},
	});

	const { mutate: addCredit } = useAddCredits();
	const [openDialog, setOpenDialog] = useState(false);
	const [amountInput, setAmountInput] = useState("");

	const parsedAmount = useMemo(() => Number(amountInput), [amountInput]);
	const amountValidation = useMemo(
		() => amountSchema.safeParse(parsedAmount),
		[amountSchema, parsedAmount]
	);
	const scaledAmount = useMemo(
		() => toScaledAmount(amountInput),
		[amountInput]
	);

	const onSubmit = async (data: AddCreditFormData) => {
		if (!amountValidation.success) {
			return;
		}

		addCredit(
			{
				organizationId: orgId || storedOrganizationId || "",
				amount: scaledAmount,
				description: data.description ?? "",
			},
			{
				onSuccess: (data) => {
					toast(
						`${tDialog("billing.credit.successMessage", {
							amount: Number(amountInput).toFixed(2),
							totalCredits: Number(data.data.amount).toFixed(2),
						})}`
					);
					setOpenDialog(false);
				},
				onError: () => {
					toast(tCommon("error"));
				},
			}
		);
	};

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogTrigger asChild>{triggerElement}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("dialogs.addCredit.title")}</DialogTitle>
					<DialogDescription>
						{t("dialogs.addCredit.description")}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel>{t("dialogs.addCredit.fields.amount")}</FieldLabel>
							<Input
								type="text"
								inputMode="decimal"
								placeholder={t("dialogs.addCredit.fields.amountPlaceholder")}
								value={amountInput}
								onChange={(event) => setAmountInput(event.target.value)}
							/>
							<FieldError
								errors={
									!amountValidation.success
										? [
												{
													message: amountValidation.error.issues[0]?.message,
												},
											]
										: undefined
								}
							/>
						</Field>
						<Field>
							<FieldLabel>{t("common.description")}</FieldLabel>
							<Input {...register("description")} />
							<FieldError errors={[errors.description]} />
						</Field>
						<Field>
							<FieldLabel>{t("dialogs.addCredit.fields.scale")}</FieldLabel>
							<Input
								value={scaledAmount.scale}
								readOnly
								disabled
								aria-readonly="true"
							/>
						</Field>
						<Field>
							<FieldLabel>
								{t("dialogs.addCredit.fields.finalScaledValue")}
							</FieldLabel>
							<Input
								value={scaledAmount.value}
								readOnly
								disabled
								aria-readonly="true"
							/>
						</Field>
					</FieldGroup>
					<Field orientation="horizontal" className="justify-end mt-6">
						<DialogFooter>
							<Button
								type="submit"
								className="bg-primary hover:bg-primary/80"
								disabled={!amountValidation.success}
							>
								{t("dialogs.addCredit.actions.submit")}
							</Button>
							<DialogClose asChild>
								<Button variant="outline">{tCommon("action.cancel")}</Button>
							</DialogClose>
						</DialogFooter>
					</Field>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddCreditDialog;
