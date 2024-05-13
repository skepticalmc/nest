import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";
import { getExternalBot } from "@/utils/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET" && req.method !== "POST") return res.status(405).end();

    try {
        if (req.method === "GET") {
            const { creatorId } = req.query;
            let bots;
            
            if (creatorId && typeof creatorId === "string") {
                bots = await prisma.bot.findMany({
                    where: { creatorId },
                    include: {
                        creator: true,
                    },
                    orderBy: {
                        votes: {
                            _count: "desc",
                        },
                    },
                });
            } else {
                bots = await prisma.bot.findMany({
                    include: {
                        creator: true,
                    },
                    orderBy: {
                        votes: {
                            _count: "desc",
                        },
                    },
                });
            };
            return res.status(200).json(bots);
        } else if (req.method === "POST") {
            const { profile } = await serverAuth(req, res);
            const { userId, botId, prefix, summary, description } = req.body;

            const { bot: externalBot } = await getExternalBot(botId);
            if (externalBot.createdBy !== profile.id) throw "User does not own this bot.";

            const bot = await prisma.bot.create({
                data: {
                    userId,
                    botId,
                    prefix,
                    summary,
                    description,
                    creatorId: profile.id,
                },
            });
            return res.status(200).json(bot);
        };
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    };
};