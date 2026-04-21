export type Invoices = {
	success: boolean;
	data: {
		invoice_uid: string;
		billing_period: string;
		total_amount: string;
		paid_at: string;
		details: {
			additionalProperty: string;
		};
		used_credits: string;
	}[];
	total: 1;
	offset: 1;
	limit: 1;
};
