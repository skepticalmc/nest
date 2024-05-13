import { AuthOptions } from "next-auth";
import { CardBoard, CardBoardProfile } from "next-auth-cardboard";
import NextAuth from "next-auth/next";
import prisma from "@/lib/prismadb";

declare module "next-auth" {
    interface Session {
        profile: CardBoardProfile;
        accessToken: string;
    }
};

export const authOptions: AuthOptions = {
    providers: [
        CardBoard({
            clientId: process.env.CARDBOARD_CLIENT_ID,
            clientSecret: process.env.CARDBOARD_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account?.access_token) token.accessToken = account.access_token;
            if (profile) {
                const typedProfile = profile as CardBoardProfile;
                token.profile = typedProfile;

                const existingUser = await prisma.user.findUnique({
                    where: {
                        userId: typedProfile.id,
                    },
                });
                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            userId: typedProfile.id,
                        },
                    });
                };
            };
            
            return token;
        },
        async session({ session, token, user }) {
            session.profile = token.profile as CardBoardProfile;
            session.accessToken = token.accessToken as string;

            return session;
        },
    },
    debug: process.env.NODE_ENV == "development",
};

export default NextAuth(authOptions);