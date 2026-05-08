import { useQuery } from "@tanstack/react-query";
import { getAdminMe } from "../services/get-admin-me";

export const useGetAdminMe = () => {
	return useQuery({
		queryKey: ["admin-me"],
		queryFn: getAdminMe,
	});
};
