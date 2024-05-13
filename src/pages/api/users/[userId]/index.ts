import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).end();

    try {
        const { userId } = req.query;
        if (userId && typeof userId === "string") {
            const user = await prisma.user.findUnique({
                where: { userId },
            });

            return res.status(200).json(user);
        } else throw "User ID is required.";
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    };
};