import { Button } from "@/components/shadcn/button";
import AddCreditDialog from "./dialogs/add-credits-dialog";

const BillingCredit = (): React.JSX.Element => {
	return (
		<div>
			<div>
				<AddCreditDialog triggerElement={<Button>Add Credits</Button>} />
			</div>
		</div>
	);
};

export default BillingCredit;
