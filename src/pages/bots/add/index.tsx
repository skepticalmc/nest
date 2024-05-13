import { getExternalBot } from "@/utils/api";
import { Button, Divider, Input, Link, Textarea } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useState } from "react";
import { FaInfo, FaList, FaMessage, FaRobot } from "react-icons/fa6";
import { toast } from "sonner";

const internalBotIdDoc = "https://www.guilded.gg/Nest/groups/3NBVjMj3/channels/95e73a70-81bc-4a39-a51b-897782a38be4/docs/427315";

const AddBot = () => {
    const [botId, setBotId] = useState("");
    const [prefix, setPrefix] = useState("");
    const [summary, setSummary] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        try {
            setLoading(true);
            e.stopPropagation();
            e.preventDefault();

            await getExternalBot(botId)
            .then(async ({ bot: externalBotData }) => {
                await axios.post(`/api/bots`, {
                    userId: externalBotData.userId,
                    botId,
                    prefix,
                    summary,
                    description,
                });

                await toast.success(`Bot submitted!`);
                router.push(`/bots/${botId}`);
            })
            .catch(() => toast.error(`This bot does not exist, or is not published.`, {
                description: `Please check your Bot ID to make sure it's right. Is this really your bot?`,
            }));
        } catch (error) {
            toast.error(`Something went wrong.`);
        } finally {
            setLoading(false);
        };
    }, [
        botId,
        prefix,
        summary,
        description,
        router,
    ]);
    return (
        <div className="page">
            <h1>Add Bot</h1>
            <Divider className="my-2" />
            <form onSubmit={handleSubmit}>
                <Input
                    isRequired
                    label="Internal Bot ID"
                    description={
                        <p className="flex items-center gap-1">
                            <span>This is used to identify your Guilded bot.</span>
                            <Link 
                                isExternal
                                showAnchorIcon
                                className="text-xs" 
                                href={internalBotIdDoc}
                            >What is a Internal Bot ID?</Link>
                        </p>
                    }
                    variant="bordered"
                    value={botId}
                    onValueChange={setBotId}
                    startContent={<FaRobot />}
                    minLength={36}
                    maxLength={36}
                    isDisabled={loading}
                />
                <Input
                    isRequired
                    label="Prefix"
                    description="Default prefix that your bot responds to."
                    variant="bordered"
                    value={prefix}
                    onValueChange={setPrefix}
                    startContent={<FaMessage />}
                    isDisabled={loading}
                    minLength={1}
                    maxLength={3}
                />
                <Textarea
                    isRequired
                    label="Summary"
                    description="Summarise your Guilded bot in a few words."
                    variant="bordered"
                    value={summary}
                    onValueChange={setSummary}
                    startContent={<FaInfo />}
                    minRows={3}
                    minLength={100}
                    maxLength={128}
                    isDisabled={loading}
                />
                <Textarea
                    isRequired
                    label="Description"
                    description="Full description of your Guilded bot, Markdown is supported."
                    variant="bordered"
                    value={description}
                    onValueChange={setDescription}
                    startContent={<FaList />}
                    minRows={6}
                    minLength={300}
                    isDisabled={loading}
                />
                <Button 
                    variant="bordered" 
                    color="success" 
                    className="w-full"
                    type="submit"
                    isDisabled={loading}
                >
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default AddBot;