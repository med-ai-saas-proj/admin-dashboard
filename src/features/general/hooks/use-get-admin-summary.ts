import { useQuery } from "@tanstack/react-query";
import { getAdminSummary } from "../services/get-admin-summary";

export const useGetAdminSummary = () => {
	return useQuery({
		queryKey: ["admin-summary"],
		queryFn: getAdminSummary,
	});
};
