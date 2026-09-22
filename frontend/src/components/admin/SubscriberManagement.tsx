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
    UsersRound,
    Send,
    Eye,
    ArrowLeft,
    Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Subscriber {
    id: string;
    email: string;
    createdAt: string;
}

type TabType = 'subscribers' | 'compose';

export default function SubscriberManagement() {
    const { data: session } = useSession();
    const { token: authContextToken } = useAuth();
    const { toast } = useToast();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('subscribers');

    // Newsletter compose state
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [sendResult, setSendResult] = useState<{ sent: number; failed: number; total: number } | null>(null);

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const checkToken = () => {
            const nextAuthToken = (session as any)?.accessToken as string | undefined;
            if (nextAuthToken) { setToken(nextAuthToken); return; }
            if (authContextToken) { setToken(authContextToken); return; }
            const stored = localStorage.getItem('auth_token');
            if (stored) setToken(stored);
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
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load subscribers' });
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
            toast({ title: 'Removed', description: 'Subscriber removed successfully.' });
            setSubscriberToDelete(null);
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove subscriber' });
        }
    };

    const handleSendNewsletter = async () => {
        if (!token || !subject.trim() || !body.trim()) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'Subject and body are required.' });
            return;
        }
        setIsSending(true);
        setSendResult(null);
        try {
            const result = await api.sendNewsletter(subject, body, token) as any;
            setSendResult({ sent: result.sent, failed: result.failed, total: result.total });
            toast({ title: 'Newsletter Sent', description: result.message });
        } catch {
            toast({ variant: 'destructive', title: 'Failed', description: 'Failed to send newsletter. Check your Resend configuration.' });
        } finally {
            setIsSending(false);
        }
    };

    const exportCSV = () => {
        const header = ['Email', 'Subscribed At'];
        const rows = filtered.map(s => [s.email, new Date(s.createdAt).toLocaleDateString()]);
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header + Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
                <div>
                    <h2 className="text-3xl font-display font-bold text-primary tracking-tight">Newsletter</h2>
                    <p className="text-muted-foreground text-sm mt-1">Manage subscribers and send newsletters via Resend</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setActiveTab('subscribers')}
                        variant={activeTab === 'subscribers' ? 'default' : 'outline'}
                        className="h-10 px-5 rounded-lg text-xs font-semibold gap-2"
                    >
                        <Users className="w-4 h-4" /> Subscribers
                    </Button>
                    <Button
                        onClick={() => setActiveTab('compose')}
                        variant={activeTab === 'compose' ? 'default' : 'outline'}
                        className="h-10 px-5 rounded-lg text-xs font-semibold gap-2"
                    >
                        <Send className="w-4 h-4" /> Compose
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border border-border/50 shadow-sm bg-white rounded-2xl">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-display font-bold text-primary">{subscribers.length}</p>
                            <p className="text-xs text-muted-foreground font-medium">Total Subscribers</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-border/50 shadow-sm bg-white rounded-2xl">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-display font-bold text-primary">{subscribers.filter(s => Date.now() - new Date(s.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000).length}</p>
                            <p className="text-xs text-muted-foreground font-medium">New This Week</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-border/50 shadow-sm bg-white rounded-2xl">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-display font-bold text-primary">{sendResult?.sent ?? '—'}</p>
                            <p className="text-xs text-muted-foreground font-medium">Last Send</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ===== SUBSCRIBERS TAB ===== */}
            {activeTab === 'subscribers' && (
                <Card className="border border-border/50 shadow-lg bg-white rounded-2xl overflow-hidden">
                    <div className="p-6 flex flex-col sm:flex-row items-center gap-4 border-b border-border/50">
                        <div className="relative flex-1 w-full max-w-md">
                            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by email..."
                                className="pl-10 h-10 rounded-lg text-sm"
                            />
                        </div>
                        <Button onClick={exportCSV} variant="outline" size="sm" className="h-10 px-4 rounded-lg text-xs font-semibold gap-2">
                            <Download className="w-4 h-4" /> Export CSV
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="p-16 text-center text-muted-foreground">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-secondary" />
                                <p className="text-sm">Loading subscribers...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="p-16 text-center text-muted-foreground text-sm">No subscribers found.</div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-muted/40">
                                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">Email</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filtered.map(sub => (
                                        <tr key={sub.id} className="hover:bg-muted/20 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                                                        <Mail className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-sm font-medium text-primary">{sub.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(sub.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setSubscriberToDelete(sub)}
                                                    className="h-8 px-3 rounded-lg text-xs gap-1.5 text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-3 h-3" /> Remove
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Card>
            )}

            {/* ===== COMPOSE TAB ===== */}
            {activeTab === 'compose' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Compose Form */}
                    <Card className="border border-border/50 shadow-lg bg-white rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-border/50">
                            <h3 className="text-lg font-semibold text-primary">Compose Newsletter</h3>
                            <p className="text-xs text-muted-foreground mt-1">Will be sent to {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Subject</label>
                                <Input
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="e.g. New Properties in I-10 — March 2026"
                                    className="h-11 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Body</label>
                                <Textarea
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                    placeholder="Write your newsletter content here. HTML tags are supported (e.g. <b>bold</b>, <br>, <ul><li>item</li></ul>)."
                                    className="min-h-[250px] rounded-lg text-sm leading-relaxed resize-y"
                                />
                                <p className="text-[11px] text-muted-foreground mt-2">Supports basic HTML: &lt;b&gt;, &lt;i&gt;, &lt;br&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a href=&quot;...&quot;&gt;</p>
                            </div>

                            {sendResult && (
                                <div className={`p-4 rounded-xl text-sm ${sendResult.failed > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
                                    <p className="font-semibold">Sent {sendResult.sent} of {sendResult.total} emails{sendResult.failed > 0 ? ` (${sendResult.failed} failed)` : ''}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={() => setShowPreview(!showPreview)}
                                    variant="outline"
                                    className="h-11 px-5 rounded-lg text-xs font-semibold gap-2"
                                >
                                    <Eye className="w-4 h-4" /> {showPreview ? 'Hide' : 'Preview'}
                                </Button>
                                <Button
                                    onClick={handleSendNewsletter}
                                    disabled={isSending || !subject.trim() || !body.trim() || subscribers.length === 0}
                                    className="h-11 px-6 rounded-lg text-xs font-semibold gap-2 bg-secondary hover:bg-secondary/90 text-white flex-1"
                                >
                                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {isSending ? 'Sending...' : `Send to ${subscribers.length} Subscribers`}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Live Preview */}
                    <Card className="border border-border/50 shadow-lg bg-white rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-border/50">
                            <h3 className="text-lg font-semibold text-primary">Email Preview</h3>
                            <p className="text-xs text-muted-foreground mt-1">How subscribers will see your newsletter</p>
                        </div>
                        <div className="p-6 bg-[#f4f4f4]">
                            <div className="max-w-[500px] mx-auto bg-white rounded-xl overflow-hidden shadow-md">
                                {/* Header */}
                                <div className="bg-[#0a0a0f] px-8 py-6 text-center">
                                    <h1 className="text-white text-lg font-bold tracking-wide">Square<span className="text-secondary">21</span> Marketing</h1>
                                </div>
                                {/* Body */}
                                <div className="px-8 py-8">
                                    <h2 className="text-[#0a0a0f] text-xl font-bold mb-4">
                                        {subject || <span className="text-muted-foreground italic">Your subject line...</span>}
                                    </h2>
                                    <div
                                        className="text-[#374151] text-sm leading-7 prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: body || '<p class="text-muted-foreground italic">Your newsletter content will appear here...</p>' }}
                                    />
                                </div>
                                {/* CTA */}
                                <div className="px-8 pb-6">
                                    <span className="inline-block bg-secondary text-white px-6 py-3 rounded-lg text-sm font-semibold">Browse Properties</span>
                                </div>
                                {/* Footer */}
                                <div className="bg-[#f9fafb] px-8 py-5 border-t border-gray-200 text-center">
                                    <p className="text-[#9ca3af] text-[11px]">
                                        You received this because you subscribed to Square21 Marketing updates.
                                        <br />
                                        <span className="text-secondary">square21marketing.com</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Delete Dialog */}
            <AlertDialog open={!!subscriberToDelete} onOpenChange={() => setSubscriberToDelete(null)}>
                <AlertDialogContent className="rounded-2xl border-none bg-white p-8 max-w-md shadow-2xl">
                    <AlertDialogHeader>
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4 mx-auto">
                            <Trash2 className="w-7 h-7" />
                        </div>
                        <AlertDialogTitle className="text-xl text-center text-primary">Remove Subscriber?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-muted-foreground mt-2 text-sm">
                            Remove <strong>{subscriberToDelete?.email}</strong> from the newsletter list. They will no longer receive emails.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                        <AlertDialogCancel className="flex-1 h-11 rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl">Remove</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
