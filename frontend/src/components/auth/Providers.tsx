"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider attribute="class" forcedTheme="light">
            <SessionProvider basePath="/next-auth">
                <AuthProvider>{children}</AuthProvider>
            </SessionProvider>
        </NextThemesProvider>
    );
}
