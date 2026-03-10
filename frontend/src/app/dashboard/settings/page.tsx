"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Bell, TrendingUp, MapPin, BellOff, Save } from "lucide-react";
import Link from "next/link";

interface Preferences {
    receiveAll: boolean;
    investmentOnly: boolean;
    localAreaOnly: boolean;
    unsubscribed: boolean;
}

const defaultPrefs: Preferences = {
    receiveAll: true,
    investmentOnly: false,
    localAreaOnly: false,
    unsubscribed: false,
};

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [prefs, setPrefs] = useState<Preferences>(defaultPrefs);
    const [isSaving, setIsSaving] = useState(false);

    const token = (session as any)?.accessToken as string | undefined;

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    const toggle = (key: keyof Preferences) => {
        setPrefs(prev => {
            const next = { ...prev, [key]: !prev[key] };
            // Mutual exclusivity logic
            if (key === "unsubscribed" && next.unsubscribed) {
                return { receiveAll: false, investmentOnly: false, localAreaOnly: false, unsubscribed: true };
            }
            if (key !== "unsubscribed") {
                next.unsubscribed = false;
            }
            if (key === "receiveAll" && next.receiveAll) {
                next.investmentOnly = false;
                next.localAreaOnly = false;
            }
            return next;
        });
    };

    const handleSave = async () => {
        if (!token) return;
        setIsSaving(true);
        try {
            await api.updatePreferences(prefs, token);
            toast({ title: "Saved!", description: "Your notification preferences have been updated." });
        } catch (e) {
            toast({ variant: "destructive", title: "Error", description: "Failed to save preferences" });
        } finally {
            setIsSaving(false);
        }
    };

    const options = [
        {
            key: "receiveAll" as keyof Preferences,
            icon: Bell,
            iconColor: "text-primary bg-primary/10",
            title: "Receive All News",
            description: "Get notified about every market update, new project, and property news.",
        },
        {
            key: "investmentOnly" as keyof Preferences,
            icon: TrendingUp,
            iconColor: "text-green-600 bg-green-50",
            title: "Investment Opportunities Only",
            description: "Only receive notifications about investment tips and high-value opportunities.",
        },
        {
            key: "localAreaOnly" as keyof Preferences,
            icon: MapPin,
            iconColor: "text-amber-600 bg-amber-50",
            title: "Local Area Updates Only",
            description: "Only get property news and updates relevant to your preferred area.",
        },
        {
            key: "unsubscribed" as keyof Preferences,
            icon: BellOff,
            iconColor: "text-red-600 bg-red-50",
            title: "Unsubscribe from All",
            description: "Stop receiving all property alerts, news, and email notifications.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary/5 pt-24 pb-16 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-slate-600">
                            <ChevronLeft className="w-4 h-4" /> Dashboard
                        </Button>
                    </Link>
                </div>

                <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-900 text-white px-8 pt-8 pb-6">
                        <CardTitle className="text-xl font-display font-bold">Notification Preferences</CardTitle>
                        <CardDescription className="text-white/60">
                            Choose which updates you'd like to receive from Square21.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {options.map((opt) => (
                                <div
                                    key={opt.key}
                                    onClick={() => toggle(opt.key)}
                                    className={`flex items-center gap-5 p-6 cursor-pointer transition-colors hover:bg-slate-50 ${prefs[opt.key] ? "bg-primary/3" : ""}`}
                                >
                                    <div className={`w-11 h-11 rounded-2xl ${opt.iconColor} flex items-center justify-center flex-shrink-0`}>
                                        <opt.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900">{opt.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{opt.description}</p>
                                    </div>
                                    <Switch
                                        checked={prefs[opt.key]}
                                        onCheckedChange={() => toggle(opt.key)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex-shrink-0"
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {prefs.unsubscribed && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
                        <strong>Note:</strong> You will no longer receive any email or in-app notifications from Square21.
                        You can re-enable at any time.
                    </div>
                )}

                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full h-12 rounded-2xl font-bold gap-2 text-base"
                >
                    {isSaving ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                    ) : (
                        <><Save className="w-4 h-4" /> Save Preferences</>
                    )}
                </Button>
            </div>
        </div>
    );
}
