import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).end();

    try {
        const { botId } = req.query;
        if (botId && typeof botId === "string") {
            const bot = await prisma.bot.findUnique({
                where: { botId },
            });

            return res.status(200).json(bot);
        } else throw "Bot ID is required.";
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    };
};