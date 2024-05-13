import { fixIconUrl } from "@/utils";
import { getExternalBot } from "@/utils/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).end();

    try {
        const { botId } = req.query;
        if (botId && typeof botId === "string") {
            const { bot } = await getExternalBot(botId);
            bot.iconUrl = fixIconUrl(bot.iconUrl);

            return res.status(200).json(bot);
        } else throw "Bot ID is required.";
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    };
};