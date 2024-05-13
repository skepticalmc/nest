import useExternalBot from "@/hooks/useExternalBot";
import { Card, CardBody, CardHeader, Chip, Divider, Image, Link } from "@nextui-org/react";
import { FC } from "react";
import { FaChevronCircleUp } from "react-icons/fa";
import { Spinner } from "../layout";

const Bot: FC<{ bot: Record<string, any> }> = ({ bot }) => {
    const { data: externalBot, isLoading } = useExternalBot(bot?.botId);
    
    if (isLoading) return (<Spinner />);
    return (
        <Card as={Link} href={`/bots/${bot?.botId}`} isPressable={true}>
            <CardHeader className="flex justify-between">
                <div className="flex gap-3">
                    <Image
                        src={externalBot?.iconUrl || "/images/default.png"}
                        alt={externalBot?.name}
                        height={60}
                        width={60}
                        radius="sm"
                    />
                    <div className="flex flex-col">
                        <h1 className="text-md">{externalBot?.name}</h1>
                        <Chip startContent={<FaChevronCircleUp size={18} />} variant="flat" color="success">{bot?.votes.length}</Chip>
                    </div>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <p>{bot?.summary}</p>
            </CardBody>
        </Card>
    );
};

export default Bot;