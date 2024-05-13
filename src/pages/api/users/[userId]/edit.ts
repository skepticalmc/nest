import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        await serverAuth(req, res);
        const { userId } = req.query;
        if (userId && typeof userId === "string") {
            const { bio } = req.body;

            const updatedUser = await prisma.user.update({
                where: { userId },
                data: {
                    bio,
                },
            });

            return res.status(200).json(updatedUser);
        } else throw "User ID is required.";
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    };
};