import fetcher from "@/lib/fetcher";
import useSWR from "swr";

const useExternalBot = (botId: string) => {
    const { data, error, isLoading, mutate } = useSWR(botId ? `/api/bots/${botId}/external` : null, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate,
    };
};

export default useExternalBot;