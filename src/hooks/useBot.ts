import fetcher from "@/lib/fetcher";
import useSWR from "swr";

const useBot = (botId: string) => {
    const { data, error, isLoading, mutate } = useSWR(botId ? `/api/bots/${botId}` : null, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate,
    };
};

export default useBot;