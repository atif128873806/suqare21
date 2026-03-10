import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { api } from "@/lib/api";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }: any) {
            if (account?.provider === "google") {
                try {
                    const googleId = profile?.sub || user?.id;
                    if (!googleId) {
                        throw new Error("Missing googleId (profile.sub or user.id)");
                    }

                    const response = await api.syncUser({
                        email: user.email!,
                        name: user.name || undefined,
                        image: user.image || undefined,
                        googleId: googleId,
                        loginMethod: 'GOOGLE',
                    });

                    // Store the backend token in the user object for the session
                    (user as any).accessToken = response.access_token;
                    (user as any).backendUser = response.user;
                    return true;
                } catch (error: any) {
                    console.error("Error syncing user with backend:", error);
                    // Log to a file we can read
                    try {
                        const fs = require('fs');
                        const logData = `[${new Date().toISOString()}] Login Error: ${error.message}\n` +
                            `Data sent: ${JSON.stringify({ email: user.email, name: user.name, id: user.id, sub: profile?.sub })}\n` +
                            `Stack: ${error.stack}\n\n`;
                        fs.appendFileSync('/tmp/auth_error.log', logData);
                    } catch (e) { }
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.accessToken = (user as any).accessToken;
                token.role = (user as any).backendUser?.role || 'USER';
                token.id = (user as any).backendUser?.id;
            }
            return token;
        },
        async session({ session, token }: any) {
            (session as any).accessToken = token.accessToken;
            (session as any).user.role = token.role;
            (session as any).user.id = token.id;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
