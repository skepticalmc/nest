import useBot from "@/hooks/useBot";
import useExternalBot from "@/hooks/useExternalBot";
import { Avatar, Button, Divider, Link, LinkIcon, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/router";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/darcula';
import useExternalUser from "@/hooks/useExternalUser";
import { FaChevronCircleUp } from "react-icons/fa";
import { Spinner } from "@/components/layout";
import { useSession } from "next-auth/react";
import { FaPencil } from "react-icons/fa6";

const BotPage = () => {
    const router = useRouter();
    const { botId } = router.query;

    const { data: session, status } = useSession();
    const profile = session?.profile;

    const { data: bot, isLoading: botLoading } = useBot(botId as string);
    const { data: externalBot, isLoading } = useExternalBot(botId as string);
    const { data: creator, isLoading: creatorLoading } = useExternalUser(bot?.creatorId);

    if (botLoading || isLoading || creatorLoading || status === "loading") return (<Spinner />);
    return (
        <div className="page">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar
                        isBordered
                        className="transition-transform"
                        color="success"
                        name={externalBot?.name}
                        size="lg"
                        src={externalBot?.iconUrl}
                    />
                    <div>
                        <h1>{externalBot?.name}</h1>
                        <p className="text-foreground-500">{bot?.summary}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        as={Link} 
                        href={`/bots/${botId}/vote`}
                        startContent={<FaChevronCircleUp className="text-success" />}
                        variant="bordered"
                    >Vote ({bot?.votes.length})</Button>
                    {bot?.creatorId === profile?.id ? (
                        <Button
                            variant="bordered"
                            as={Link}
                            href={`/bots/${botId}/edit`}
                            startContent={<FaPencil />}
                        >Edit</Button>
                    ) : (<></>)}
                    <Tooltip content={`Created by ${creator?.name}`} placement="left">
                        <Avatar
                            isBordered
                            as={Link}
                            href={`/users/${creator?.id}`}
                            className="transition-transform"
                            color="success"
                            name={creator?.name}
                            size="lg"
                            src={creator?.profilePicture}
                        />
                    </Tooltip>
                </div>
            </div>
            <Divider className="my-4" />

            <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a(props: any) {
                        const { ...rest } = props;
                        return (<Link {...rest} />)
                    },
                    code(props: any) {
                        const { children, className, node, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                            <SyntaxHighlighter
                                {...rest}
                                PreTag="div"
                                language={match[1]}
                                style={dark}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code {...rest} className={`${className} bg-default-100 rounded p-1`}>
                                {children}
                            </code>
                        );
                    },
                }}
            >{bot?.description}</Markdown>
        </div>
    );
};

export default BotPage;