import { useQuery } from "@tanstack/react-query";
import { getLifetimeValue } from "../services/get-lifetime-value";

export const useGetLifetimeValue = () => {
	return useQuery({
		queryKey: ["lifetime-value"],
		queryFn: getLifetimeValue,
	});
};
