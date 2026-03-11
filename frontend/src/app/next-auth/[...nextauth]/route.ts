import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { api } from "@/lib/api";

const authOptions = {
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
        error: '/login', // Redirect back to login on error
    },
    secret: process.env.NEXTAUTH_SECRET,
    // Suppress internal /api/auth/_log 404 noise in production
    logger: {
        error(code: string, ...message: unknown[]) {
            if (code === "CLIENT_FETCH_ERROR") return;
            console.error(code, ...message);
        },
        warn(code: string) {
            console.warn(code);
        },
        debug(code: string, ...message: unknown[]) {
            if (process.env.NODE_ENV === "development") {
                console.debug(code, ...message);
            }
        },
    },
};

const handler = NextAuth(authOptions);

export async function GET(req: any, context: any) {
    return handler(req, context);
}

export async function POST(req: any, context: any) {
    return handler(req, context);
}

