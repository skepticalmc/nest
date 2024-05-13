import fetcher from "@/lib/fetcher";
import useSWR from "swr";

const useBots = (creatorId?: string) => {
    const url = creatorId 
    ? `/api/bots?creatorId=${creatorId}`
    : `/api/bots`;
    const { data, error, isLoading, mutate } = useSWR(url, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate,
    };
};

export default useBots;