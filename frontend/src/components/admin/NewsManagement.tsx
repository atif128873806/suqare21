'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Send, FileText, Globe, Clock, Newspaper, LayoutDashboard } from 'lucide-react';

interface NewsItem {
    id: string;
    title: string;
    content: string;
    image: string | null;
    category: string;
    status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
    publishedAt: string | null;
    createdAt: string;
    author: { name: string | null; email: string } | null;
}

const CATEGORIES = [
    { value: 'MARKET_UPDATE', label: 'Market Update' },
    { value: 'INVESTMENT_TIPS', label: 'Investment Tips' },
    { value: 'NEW_PROJECTS', label: 'New Projects' },
    { value: 'PROPERTY_NEWS', label: 'Property News' },
];

const emptyForm: { title: string; content: string; image: string; category: string; status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' } = { title: '', content: '', image: '', category: 'MARKET_UPDATE', status: 'DRAFT' };

export default function NewsManagement() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null);
    const [editing, setEditing] = useState<NewsItem | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [isSaving, setIsSaving] = useState(false);

    const token = (session as any)?.accessToken as string | undefined;

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const data = await api.getNews();
            setNews(data as NewsItem[]);
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to access news archives' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchNews(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    const openEdit = (item: NewsItem) => {
        setEditing(item);
        setForm({ title: item.title, content: item.content, image: item.image ?? '', category: item.category, status: item.status });
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!token || !form.title.trim() || !form.content.trim()) return;
        setIsSaving(true);
        try {
            if (editing) {
                await api.updateNews(editing.id, form, token);
                toast({ title: 'Article Updated', description: 'The publication has been successfully revised.' });
            } else {
                await api.createNews(form, token);
                toast({ title: 'Article Published', description: form.status === 'PUBLISHED' ? 'Broadcast successful. Notifications dispatched.' : 'Manuscript saved to drafts.' });
            }
            setShowForm(false);
            fetchNews();
        } catch (e) {
            toast({ variant: 'destructive', title: 'Error', description: e instanceof Error ? e.message : 'Failed to finalize publication' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!token || !newsToDelete) return;
        try {
            await api.deleteNews(newsToDelete.id, token);
            setNews(prev => prev.filter(n => n.id !== newsToDelete.id));
            toast({ title: 'Article Redacted', description: 'The entry has been permanently removed from the archives.' });
            setNewsToDelete(null);
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to redact article' });
        }
    };

    const stats = [
        { label: 'Total Publications', value: news.length, color: 'text-primary', bg: 'bg-slate-50' },
        { label: 'Active Broadcasts', value: news.filter(n => n.status === 'PUBLISHED').length, color: 'text-white', bg: 'bg-primary' },
        { label: 'Draft Manuscripts', value: news.filter(n => n.status === 'DRAFT').length, color: 'text-primary/60', bg: 'bg-slate-100' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Elite Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                <div>
                    <h2 className="text-3xl font-display font-bold text-primary tracking-tight">Editorial Control</h2>
                    <p className="text-muted-foreground text-sm mt-2 font-medium uppercase tracking-widest flex items-center gap-2">
                        <Newspaper className="w-4 h-4 text-primary" /> Global News & Intelligence Center
                    </p>
                </div>
                <Button onClick={openCreate} className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                    <Plus className="w-4 h-4" /> Compose Article
                </Button>
            </div>

            {/* Premium Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <Card key={i} className="border border-border/50 shadow-sm bg-white rounded-[2rem] overflow-hidden group">
                        <CardContent className={`p-8 ${s.bg} flex flex-col justify-center min-h-[140px]`}>
                            <p className={`text-4xl font-display font-bold ${s.color}`}>{s.value}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-2 ${s.bg === 'bg-primary' ? 'text-white/80' : 'text-muted-foreground'}`}>{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Article List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="py-20 text-center">
                        <div className="w-12 h-12 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin mx-auto mb-6" />
                        <p className="font-display italic text-muted-foreground">Accessing archives...</p>
                    </div>
                ) : news.length === 0 ? (
                    <div className="py-32 text-center bg-white rounded-[2rem] border border-dashed border-border group cursor-pointer hover:border-secondary/50 transition-colors" onClick={openCreate}>
                        <FileText className="w-16 h-16 text-muted/20 mx-auto mb-6 group-hover:text-secondary/30 transition-colors" />
                        <p className="text-muted-foreground font-display italic text-lg">No articles in the current cycle.</p>
                        <Button variant="link" className="mt-4 text-secondary font-bold uppercase tracking-widest text-xs">Initiate First Draft</Button>
                    </div>
                ) : (
                    news.map(item => (
                        <Card key={item.id} className="border border-border/40 shadow-sm bg-white rounded-[2rem] hover:shadow-xl transition-all duration-500 group overflow-hidden">
                            <CardContent className="p-8 flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-48 h-40 rounded-2xl overflow-hidden bg-primary/5 flex-shrink-0 relative">
                                    {item.image ? (
                                        <img src={item.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/30">
                                            <Newspaper className="w-10 h-10" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <Badge className={`text-[9px] font-bold uppercase tracking-[0.1em] border-none px-2 h-5 ${item.status === 'PUBLISHED' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'}`}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="min-w-0 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-0.5 bg-primary" />
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                                                </p>
                                            </div>
                                            <h3 className="text-2xl font-display font-bold text-primary group-hover:text-primary transition-colors truncate">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed max-w-2xl">{item.content}</p>
                                            <div className="flex items-center gap-4 pt-4 border-t border-border/40">
                                                <p className="text-[10px] text-primary/50 font-medium flex items-center gap-1.5 uppercase tracking-widest">
                                                    <Clock className="w-3 h-3" />
                                                    {item.publishedAt ? `Released ${new Date(item.publishedAt).toLocaleDateString('en-GB')}` : `Created ${new Date(item.createdAt).toLocaleDateString('en-GB')}`}
                                                </p>
                                                {item.author && (
                                                    <p className="text-[10px] text-primary/50 font-medium flex items-center gap-1.5 uppercase tracking-widest">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                        By {item.author.name || item.author.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                            <Button size="icon" variant="ghost" onClick={() => openEdit(item)} className="h-10 w-10 rounded-xl text-primary hover:bg-slate-100 transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => setNewsToDelete(item)} className="h-10 w-10 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Bespoke Create/Edit Dialog */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="max-w-3xl rounded-[2.5rem] bg-white p-10 shadow-2xl border-none max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="mb-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                                <LayoutDashboard className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">Publication Studio</p>
                                <DialogTitle className="font-display text-3xl text-primary tracking-tight">{editing ? 'Revise Article' : 'Compose News'}</DialogTitle>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-8 font-body">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Headlining Title</label>
                                <Input
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Enter compelling headline..."
                                    className="h-14 rounded-2xl border-border/60 font-medium text-lg placeholder:text-muted/30"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Category Allocation</label>
                                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                                    <SelectTrigger className="h-14 rounded-2xl border-border/60">
                                        <SelectValue className="font-medium" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-xl">
                                        {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value} className="rounded-xl my-1">{c.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Manuscript Content</label>
                            <textarea
                                value={form.content}
                                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                placeholder="Describe the market implications..."
                                rows={8}
                                className="w-full p-6 rounded-[2rem] border border-border/60 bg-white text-sm font-medium leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Visual Asset (URL)</label>
                                <Input
                                    value={form.image}
                                    onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                                    placeholder="https://exclusive-asset-uri..."
                                    className="h-14 rounded-2xl border-border/60"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Broadcast Status</label>
                                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as any }))}>
                                    <SelectTrigger className="h-14 rounded-2xl border-border/60">
                                        <SelectValue className="font-medium" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-xl">
                                        <SelectItem value="DRAFT" className="rounded-xl my-1">Archive as Draft</SelectItem>
                                        <SelectItem value="PUBLISHED" className="rounded-xl my-1 text-primary font-bold">Live Publication</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {form.status === 'PUBLISHED' && (
                            <div className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-6 flex items-start gap-4 animate-in fade-in zoom-in-95 duration-500">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                                    <Send className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">High-Priority Direct Broadcast</p>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                        Committing this article will instantly trigger global push notifications and electronic mail digests to all registered elite members.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-6 border-t border-border/40">
                            <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] border-primary/10">Discard Changes</Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving || !form.title.trim() || !form.content.trim()}
                                className="flex-1 h-14 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-bold uppercase tracking-widest text-[10px] gap-3 shadow-lg shadow-secondary/20 transition-all hover:-translate-y-1"
                            >
                                {isSaving ? (
                                    <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Processing...</>
                                ) : (
                                    <>{form.status === 'PUBLISHED' ? <><Globe className="w-4 h-4" /> Execute Broadcast</> : <><FileText className="w-4 h-4" /> Record Draft</>}</>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Redaction Confirmation */}
            <AlertDialog open={!!newsToDelete} onOpenChange={() => setNewsToDelete(null)}>
                <AlertDialogContent className="rounded-[2.5rem] border-none bg-white p-12 max-w-lg shadow-2xl">
                    <AlertDialogHeader>
                        <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-600 mb-8 mx-auto">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <AlertDialogTitle className="font-display text-3xl text-center text-primary tracking-tight">Redact Publication?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-muted-foreground mt-6 leading-relaxed font-body text-base">
                            Confirming this operation will permanently scrub <strong>"{newsToDelete?.title}"</strong> from the public domain and internal records. This action is terminal.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-4 mt-10">
                        <AlertDialogCancel className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] border-primary/10">Retain Entry</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="flex-1 h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-red-100">Execute Redaction</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
