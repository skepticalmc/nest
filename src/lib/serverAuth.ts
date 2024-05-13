import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "./prismadb";

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.profile.name) throw new Error("You are not logged in.");

    //const user = await prisma?.user.findUnique({
    //    where: {
    //        userId: session.profile.id,
    //    },
    //});

    return {
        //user,
        profile: session.profile,
    };
};

export default serverAuth;