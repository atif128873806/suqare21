"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotificationBell() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<any[]>([]);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const fetchNotifications = async () => {
        if (!session?.accessToken) return;
        try {
            const data = await api.getNotifications(session.accessToken as string);
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, [session]);

    const markAsRead = async (id: string) => {
        try {
            await api.markNotificationAsRead(id, session?.accessToken as string);
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark as read");
        }
    };

    if (!session) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]" variant="destructive">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="p-2 font-bold text-sm">Notifications</div>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground italic">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                className={`flex flex-col items-start p-3 focus:bg-accent cursor-pointer ${!n.isRead ? 'bg-muted/30' : ''}`}
                                onSelect={() => !n.isRead && markAsRead(n.id)}
                            >
                                <div className="font-semibold text-xs">{n.title}</div>
                                <div className="text-[11px] text-muted-foreground line-clamp-2">{n.message}</div>
                                <div className="text-[9px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleDateString()}</div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
