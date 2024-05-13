import { fixIconUrl } from "@/utils";
import { getExternalUser } from "@/utils/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).end();

    try {
        const { userId } = req.query;
        if (userId && typeof userId === "string") {
            const { user } = await getExternalUser(userId);
            user.profilePicture = fixIconUrl(user.profilePicture);

            return res.status(200).json(user);
        } else throw "User ID is required.";
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    };
};