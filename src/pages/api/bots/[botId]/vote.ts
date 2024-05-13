import serverAuth from "@/lib/serverAuth";
import { ErrorType } from "@/utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        const { botId } = req.query;

        if (botId && typeof botId === "string") {
            const bot = await prisma?.bot.findUnique({
                where: { botId },
            });

            const { profile } = await serverAuth(req, res);
            const hasVotedRecently = () => {
                const lastUserVote = bot?.votes.find((vote) => vote.userId === profile.id);
                if (!lastUserVote) return false;

                const difference = new Date().getTime() - new Date(lastUserVote.createdAt).getTime();
                const hours = Math.floor(difference / (1000 * 60 * 60));

                return hours < 12;
            };

            if (!hasVotedRecently()) {
                await prisma?.bot.update({
                    where: { botId },
                    data: {
                        votes: {
                            push: {
                                userId: profile.id,
                            },
                        },
                    },
                });
                return res.status(200).json({ voted: true });
            } else {
                return res.status(400).json({
                    error: ErrorType.VOTE_TOO_EARLY,
                });
            };
        };
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    };
};