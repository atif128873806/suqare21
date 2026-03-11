'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Mail,
    Trash2,
    Download,
    Calendar,
    ShieldCheck,
    Users,
    Search,
    CheckCircle2,
    UsersRound
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Subscriber {
    id: string;
    email: string;
    createdAt: string;
}

export default function SubscriberManagement() {
    const { data: session } = useSession();
    const { token: authContextToken } = useAuth();
    const { toast } = useToast();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Evaluate token on mount and when auth states change
        const checkToken = () => {
            const nextAuthToken = (session as any)?.accessToken as string | undefined;
            if (nextAuthToken) {
                setToken(nextAuthToken);
                return;
            }
            if (authContextToken) {
                setToken(authContextToken);
                return;
            }
            // Fallback to localStorage just in case context is slow
            const stored = localStorage.getItem('auth_token');
            if (stored) {
                setToken(stored);
            }
        };
        checkToken();
    }, [session, authContextToken]);

    const fetchSubscribers = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await api.getSubscribers(token);
            setSubscribers(data as Subscriber[]);
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to access subscriber registry' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchSubscribers(); }, [token]);

    const handleDelete = async () => {
        if (!token || !subscriberToDelete) return;
        try {
            await api.deleteSubscriber(subscriberToDelete.id, token);
            setSubscribers(prev => prev.filter(s => s.id !== subscriberToDelete.id));
            toast({ title: 'Entry Purged', description: 'Address removed from intelligence archives.' });
            setSubscriberToDelete(null);
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove entry' });
        }
    };

    const exportCSV = () => {
        const header = ['Email', 'Subscribed At'];
        const rows = filtered.map(s => [
            s.email,
            new Date(s.createdAt).toLocaleDateString(),
        ]);
        const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'square21-subscribers.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    const filtered = subscribers.filter(s =>
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Elite Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                <div>
                    <h2 className="text-3xl font-display font-bold text-primary tracking-tight">Newsletter Registry</h2>
                    <p className="text-muted-foreground text-sm mt-2 font-medium uppercase tracking-widest flex items-center gap-2">
                        <UsersRound className="w-4 h-4 text-primary" /> Intelligence Network Subscribers
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={exportCSV} variant="outline" className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 border-primary/10 hover:bg-primary hover:text-white transition-all">
                        <Download className="w-4 h-4" /> Export Ledger
                    </Button>
                </div>
            </div>

            {/* Registry Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border border-border/50 shadow-sm bg-white rounded-[2rem] overflow-hidden group">
                    <CardContent className="p-8 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-white shadow-lg shadow-secondary/10">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-3xl font-display font-bold text-primary">{subscribers.length}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Total Audience</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-border/50 shadow-sm bg-white rounded-[2rem] overflow-hidden group">
                    <CardContent className="p-8 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/10">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-3xl font-display font-bold text-primary">{subscribers.filter(s => {
                                const week = 7 * 24 * 60 * 60 * 1000;
                                return Date.now() - new Date(s.createdAt).getTime() < week;
                            }).length}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">New this week</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subscriber Interface */}
            <Card className="border border-border/50 shadow-xl bg-white rounded-[2rem] overflow-hidden">
                <div className="p-8 flex flex-col sm:flex-row items-center gap-6 bg-slate-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="w-4 h-4 text-primary absolute left-4 top-1/2 -translate-y-1/2" />
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Find addresses by email..."
                            className="pl-12 h-12 bg-white border-border/60 rounded-xl text-sm focus:ring-primary focus:border-primary shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-20 text-center text-muted-foreground">
                            <div className="w-12 h-12 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin mx-auto mb-6" />
                            <p className="font-display italic">Accessing database...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-20 text-center text-muted-foreground italic font-display">No matching records found in the registry.</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-left">Elite Email Address</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-left">Network Joined</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filtered.map(sub => (
                                    <tr key={sub.id} className="hover:bg-secondary/[0.01] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <p className="text-sm font-bold text-primary tracking-tight">{sub.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[11px] text-primary/60 font-medium flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-primary/50" />
                                                {new Date(sub.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setSubscriberToDelete(sub)}
                                                    className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest gap-2 text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Purge Entry
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            <AlertDialog open={!!subscriberToDelete} onOpenChange={() => setSubscriberToDelete(null)}>
                <AlertDialogContent className="rounded-[2.5rem] border-none bg-white p-12 max-w-lg shadow-2xl">
                    <AlertDialogHeader>
                        <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-600 mb-8 mx-auto">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <AlertDialogTitle className="font-display text-3xl text-center text-primary tracking-tight">Purge Subscriber?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-muted-foreground mt-6 leading-relaxed font-body">
                            Removing <strong>{subscriberToDelete?.email}</strong> will terminate their access to high-priority property intelligence broadcasts.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-4 mt-10">
                        <AlertDialogCancel className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] border-primary/10">Retain Entry</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="flex-1 h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px]">Execute Purge</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
