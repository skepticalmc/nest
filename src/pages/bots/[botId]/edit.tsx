import { Spinner } from "@/components/layout";
import useBot from "@/hooks/useBot";
import useExternalBot from "@/hooks/useExternalBot";
import { Avatar, Button, Divider, Input, Textarea } from "@nextui-org/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { FaInfo, FaList } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { toast } from "sonner";

const EditBotPage = () => {
    const [prefix, setPrefix] = useState("");
    const [summary, setSummary] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { botId } = router.query;

    const { data: bot, isLoading: botLoading } = useBot(botId as string);
    const { data: externalBot, isLoading } = useExternalBot(botId as string);
    useEffect(() => {
        setPrefix(bot?.prefix);
        setSummary(bot?.summary);
        setDescription(bot?.description);
    }, [
        bot?.prefix,
        bot?.summary,
        bot?.description,
    ]);

    const { data: session, status } = useSession();
    const profile = session?.profile;

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        try {
            setLoading(true);
            e.stopPropagation();
            e.preventDefault();

            await axios.post(`/api/bots/${botId}/edit`, {
                prefix,
                summary,
                description,
            });

            toast.success(`Updated!`);
            router.push(`/bots/${botId}`);
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
    ]);
    if (bot?.creatorId !== profile?.id) return null;
    if (botLoading || isLoading || status === "loading") return (<Spinner />);
    return (
        <div className="page">
            <div className="flex items-center gap-2">
                <Avatar
                    isBordered
                    name={externalBot?.name}
                    src={externalBot?.iconUrl}
                    color="success"
                /> 
                <h1>Edit {externalBot?.name}</h1>
            </div>
            <Divider className="my-4" />
            <form onSubmit={handleSubmit}>
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

export default EditBotPage;