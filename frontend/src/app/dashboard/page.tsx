"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
    Bell,
    Building2,
    ChevronRight,
    Globe,
    LogOut,
    Newspaper,
    Settings,
    User,
    ExternalLink,
    MessageCircle,
} from "lucide-react";

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [news, setNews] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);

    const token = (session as any)?.accessToken as string | undefined;
    const user = session?.user;
    const unread = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
            router.push("/");
        }
    }, [status, session, router]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [newsData, notifData] = await Promise.all([
                    api.getNews() as Promise<any[]>,
                    token ? api.getNotifications(token) as Promise<any[]> : Promise.resolve([]),
                ]);
                setNews(newsData.filter((n: any) => n.status === "PUBLISHED").slice(0, 5));
                setNotifications(notifData);
            } catch (e) {
                console.error(e);
            } finally {
                setNewsLoading(false);
            }
        };
        if (status === "authenticated") loadData();
    }, [status, token]);

    const markRead = async (id: string) => {
        if (!token) return;
        try {
            await api.markNotificationAsRead(id, token);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
        } catch { }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-4">
            <div className="section-container space-y-10">

                {/* Elite Welcome Header */}
                <div className="relative group overflow-hidden rounded-[2rem] bg-primary p-8 lg:p-12 text-white shadow-2xl border border-white/5">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden border-2 border-secondary/30 bg-primary-foreground/5 p-1">
                                    {user?.image ? (
                                        <img src={user.image} alt="" className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl font-display font-bold text-secondary">
                                            {user?.name?.[0] || user?.email?.[0] || "U"}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-1.5 rounded-lg shadow-lg">
                                    <User className="w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <p className="text-secondary text-xs font-bold uppercase tracking-[0.2em] mb-1">Elite Member Portal</p>
                                <h1 className="text-3xl lg:text-4xl font-display font-bold tracking-tight mb-1">
                                    Welcome back, <span className="text-white/90">{user?.name?.split(' ')[0] || "Client"}</span>
                                </h1>
                                <p className="text-white/40 text-sm font-medium tracking-wide">{(user as any)?.role || 'PREMIUM USER'} · {user?.email}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-2xl">
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Notifications</p>
                                <p className="text-xl font-display font-bold text-secondary flex items-center gap-2">
                                    {unread} <span className="text-xs text-white/60 font-sans tracking-normal">Unread</span>
                                </p>
                            </div>
                            <Link href="/dashboard/settings">
                                <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-xl px-8 h-12 gap-2 font-bold shadow-lg shadow-secondary/20 transition-all hover:-translate-y-1">
                                    <Settings className="w-4 h-4" /> Account Settings
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-secondary/10 to-transparent pointer-events-none" />
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />
                    <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-secondary opacity-40" />
                </div>

                {/* Action Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Building2, label: "Exclusive Listings", desc: "View Prime Properties", href: "/properties" },
                        { icon: Newspaper, label: "Market Intel", desc: "Latest Property News", href: "#news" },
                        { icon: Globe, label: "Area Insights", desc: "CDA Sector Reports", href: "/reports" },
                        { icon: LogOut, label: "Logout", desc: "End Current Session", href: "#", onClick: () => signOut({ callbackUrl: "/" }), danger: true },
                    ].map((action, i) => (
                        <div key={i} className="group relative">
                            {action.onClick ? (
                                <button
                                    onClick={action.onClick}
                                    className="w-full text-left bg-white border border-border/60 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group"
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${action.danger ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white' : 'bg-secondary/5 text-secondary group-hover:bg-secondary group-hover:text-white'}`}>
                                        <action.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-display text-lg font-bold text-primary group-hover:text-secondary transition-colors">{action.label}</h3>
                                    <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{action.desc}</p>
                                </button>
                            ) : (
                                <Link
                                    href={action.href}
                                    className="block bg-white border border-border/60 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-secondary/5 text-secondary flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                                        <action.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-display text-lg font-bold text-primary group-hover:text-secondary transition-colors">{action.label}</h3>
                                    <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{action.desc}</p>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Bespoke News Feed */}
                    <div className="lg:col-span-2 space-y-6" id="news">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <h2 className="text-2xl font-display font-bold text-primary tracking-tight">Market Intelligence</h2>
                            <Link href="/news" className="text-secondary text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                The full insight <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="space-y-6">
                            {newsLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-40 bg-muted/20 animate-pulse rounded-[2rem]" />
                                ))
                            ) : news.length === 0 ? (
                                <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-border">
                                    <Newspaper className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground font-display italic">Awaiting fresh intelligence...</p>
                                </div>
                            ) : (
                                news.map((item: any) => (
                                    <Card key={item.id} className="border-none shadow-none bg-transparent group cursor-pointer">
                                        <CardContent className="p-0 flex flex-col sm:flex-row gap-6">
                                            <div className="sm:w-64 h-48 rounded-[2rem] overflow-hidden bg-primary/5 flex-shrink-0 relative">
                                                {item.image ? (
                                                    <img src={item.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-primary text-white">
                                                        <Building2 className="w-10 h-10 opacity-20" />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-secondary/90 backdrop-blur-md text-white border-none py-1 px-3 text-[10px] font-bold uppercase tracking-widest">
                                                        {item.category?.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex-1 py-2">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="w-6 h-0.5 bg-secondary" />
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                        {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl lg:text-2xl font-display font-bold text-primary mb-3 leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                                                    {item.content}
                                                </p>
                                                <Button variant="link" className="text-secondary p-0 h-auto gap-2 font-bold text-xs uppercase tracking-widest hover:no-underline">
                                                    Read Strategy <ExternalLink className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Elite Notifications & Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white border border-border/60 rounded-[2rem] overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-border bg-slate-50/50 flex items-center justify-between">
                                <h3 className="font-display font-bold text-primary flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-secondary" />
                                    Alerts
                                </h3>
                                {unread > 0 && (
                                    <Badge className="bg-secondary text-white text-[10px] h-5">{unread} NEW</Badge>
                                )}
                            </div>
                            <div className="p-2">
                                {notifications.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground text-xs italic">No new signals.</div>
                                ) : (
                                    <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto pr-1">
                                        {notifications.map((n: any) => (
                                            <div
                                                key={n.id}
                                                onClick={() => !n.isRead && markRead(n.id)}
                                                className={`p-4 rounded-2xl transition-all cursor-pointer hover:bg-slate-50 ${!n.isRead ? "bg-secondary/[0.03]" : "opacity-80"}`}
                                            >
                                                <h4 className={`text-sm font-bold mb-1 flex items-center gap-2 ${n.isRead ? 'text-primary/70' : 'text-primary'}`}>
                                                    {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0 animate-pulse" />}
                                                    {n.title}
                                                </h4>
                                                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{n.message}</p>
                                                <p className="text-[9px] text-secondary font-bold uppercase tracking-widest mt-2">
                                                    {new Date(n.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Premium Contact Module */}
                        <div className="bg-primary rounded-[2rem] p-8 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="font-display text-xl font-bold mb-2">Direct Access</h3>
                                <p className="text-white/50 text-sm mb-6 font-medium">Need immediate property consultation? Contact your broker directly.</p>
                                <a href="https://wa.me/923083333818" target="_blank" rel="noopener noreferrer">
                                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-xl h-12 font-bold gap-2">
                                        <MessageCircle className="w-5 h-5 text-white/50" /> WhatsApp Us
                                    </Button>
                                </a>
                            </div>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary/10 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
