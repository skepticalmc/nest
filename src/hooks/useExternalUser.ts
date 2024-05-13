import fetcher from "@/lib/fetcher";
import useSWR from "swr";

const useExternalUser = (userId: string) => {
    const { data, error, isLoading, mutate } = useSWR(userId ? `/api/users/${userId}/external` : null, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate,
    };
};

export default useExternalUser;