import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/lib/api";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter an email and password");
                }

                try {
                    // Use a direct fetch or axios, assuming your backend URL is NEXT_PUBLIC_API_URL or similar.
                    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                    const res = await fetch(`${backendUrl}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.message || "Invalid credentials");
                    }

                    if (data && data.user && data.access_token) {
                        return {
                            id: data.user.id,
                            name: data.user.name,
                            email: data.user.email,
                            role: data.user.role,
                            accessToken: data.access_token,
                            backendUser: data.user
                        } as any;
                    }
                    return null;
                } catch (error: any) {
                    console.error("Credentials Auth Error:", error);
                    // NextAuth throws the error message to the client
                    throw new Error(error.message || "Authentication failed");
                }
            }
        })
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
            // For credentials, it's already handled in authorize callback
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
        error: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export async function GET(req: any, context: any) {
    return handler(req, context);
}

export async function POST(req: any, context: any) {
    return handler(req, context);
}
