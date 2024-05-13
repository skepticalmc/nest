import useBots from "@/hooks/useBots";
import Bot from "./bot";
import { FC, useState } from "react";
import { Divider, Input } from "@nextui-org/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Spinner } from "../layout";

const Bots: FC<{ creatorId?: string, searchBar?: boolean }> = ({ creatorId, searchBar }) => {
    const [search, setSearch] = useState("");
    let { data: bots = [], isLoading } = useBots(creatorId);
    if (searchBar) bots = bots.filter((bot: Record<string, any>) => 
        bot.summary.toLowerCase().includes(search.toLowerCase()) ||
        bot.description.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return (<Spinner />);
    return (
        <div>
            {searchBar && (
                <>
                    <Input
                        value={search}
                        onValueChange={setSearch}
                        size="sm"
                        placeholder="Search"
                        type="search"
                        startContent={<FaMagnifyingGlass size={18} />}
                    />
                    <Divider className="my-2" />
                </>
            )}
            <div className="grid grid-cols-2 gap-2">
                {bots.map((bot: Record<string, any>) => (
                    <Bot key={bot.botId} bot={bot} />
                ))}
            </div>
        </div>
    );
};

export default Bots;