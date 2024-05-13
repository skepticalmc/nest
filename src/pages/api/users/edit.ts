import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        const { profile } = await serverAuth(req, res);
        const { bio } = req.body;

        const updatedUser = await prisma.user.update({
            where: {
                userId: profile.id,
            },
            data: {
                bio,
            },
        });

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    };
};