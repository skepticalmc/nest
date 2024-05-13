import useExternalBot from "@/hooks/useExternalBot";
import { ErrorType } from "@/utils/types";
import { Avatar, Button, Divider } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { FaChevronCircleUp } from "react-icons/fa";
import { toast } from "sonner";

const BotVotePage = () => {
    const [disabled, setDisabled] = useState(true);
    const [countdown, setCountdown] = useState(5);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { botId } = router.query;
    const { data: externalBot } = useExternalBot(botId as string);

    const handleVote = useCallback(async () => {
        try {
            setLoading(true);

            let errored: boolean = false;
            const { data: response } = await axios.post(`/api/bots/${botId}/vote`)
            axios.post(``).then(({ data: response }) => {
                if (response.voted === false) {
                    if (response.error && response.error === ErrorType.VOTE_TOO_EARLY) {
                        errored = true;
                        return toast.error(`You cannot vote yet!`);
                    };
                    errored = true;
                    return toast.error(`Something went wrong.`);
                };
            });
            if (response.voted === false) {
                let error = "Something went wrong";
                if (response.error && response.error === ErrorType.VOTE_TOO_EARLY) error = "You cannot vote yet, you need to wait at least 12 hours past your last vote.";
                toast.error(error);
            } else {
                toast.success(`Voted!`);
                router.push(`/bots/${botId}`);
            };
        } catch (error) {
            toast.error(`Something went wrong.`);
        } finally {
            setLoading(false);
        };
    }, [botId]);
    useEffect(() => {
        if (disabled) {
            const timer = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown === 1) {
                        clearInterval(timer);
                        setDisabled(false);
                    };
                    return prevCountdown - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        };
    }, [disabled]);
    return (
        <div className="page h-full w-full top-0 left-0 justify-center">
            <div className="flex items-center gap-2">
                <Avatar
                    isBordered
                    className="transition-transform"
                    color="success"
                    name={externalBot?.name}
                    size="lg"
                    src={externalBot?.iconUrl}
                />
                <div>
                    <h1>Vote for {externalBot?.name}</h1>
                    <span className="text-foreground-500">
                        {disabled ? <p>You can vote in <strong>{countdown}</strong> seconds..</p> : "You can vote now!"}
                    </span>
                </div>
            </div>
            <Divider className="my-3" />
            <Button                 
                startContent={<FaChevronCircleUp size={18} />}
                className={`disabled:opacity-disabled hover:disabled:opacity-disabled`}
                variant="flat"
                color={disabled ? "default" : "secondary"}
                size="lg"
                disabled={disabled || loading}
                onPress={handleVote}
            >{loading ? "Voting..." : "Vote"}</Button>
        </div>
    );
};

export default BotVotePage;