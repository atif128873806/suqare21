'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
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
    Search,
    Trash2,
    UserCheck,
    UserX,
    Download,
    Users,
    Mail,
    Calendar,
    Clock,
    ShieldCheck,
    Chrome,
    ArrowRight,
} from 'lucide-react';

interface User {
    id: string;
    name: string | null;
    email: string;
    role: 'USER' | 'ADMIN';
    status: 'ACTIVE' | 'DISABLED';
    loginMethod: 'EMAIL' | 'GOOGLE';
    createdAt: string;
    lastActive: string | null;
    image: string | null;
}

export default function UserManagement() {
    const { data: session } = useSession();
    const { token: authContextToken } = useAuth();
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const nextAuthToken = (session as any)?.accessToken as string | undefined;
    const token = authContextToken || nextAuthToken;

    const fetchUsers = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await api.getUsers(token);
            setUsers(data as User[]);
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load users' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, [token]);

    const handleToggleStatus = async (user: User) => {
        if (!token) return;
        const newStatus = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
        try {
            await api.updateUserStatus(user.id, newStatus, token);
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
            toast({ title: 'Status Updated', description: `${user.name || user.email} is now ${newStatus.toLowerCase()}` });
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update user status' });
        }
    };

    const handleDelete = async () => {
        if (!token || !userToDelete) return;
        try {
            await api.deleteUser(userToDelete.id, token);
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            toast({ title: 'User Purged', description: `${userToDelete.name || userToDelete.email} has been removed from the registry` });
            setUserToDelete(null);
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete user' });
        }
    };

    const exportCSV = () => {
        const header = ['Name', 'Email', 'Role', 'Login Method', 'Status', 'Registered', 'Last Active'];
        const rows = filtered.map(u => [
            u.name ?? '',
            u.email,
            u.role,
            u.loginMethod,
            u.status,
            new Date(u.createdAt).toLocaleDateString(),
            u.lastActive ? new Date(u.lastActive).toLocaleDateString() : 'Never',
        ]);
        const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'square21-users.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const stats = [
        { label: 'Total Registry', value: users.length, color: 'bg-primary', icon: Users },
        { label: 'Active Personnel', value: users.filter(u => u.status === 'ACTIVE').length, color: 'bg-primary/80', icon: UserCheck },
        { label: 'Authenticated (G)', value: users.filter(u => u.loginMethod === 'GOOGLE').length, color: 'bg-primary/60', icon: Chrome },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Elite Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                <div>
                    <h2 className="text-3xl font-display font-bold text-primary tracking-tight">User Registry</h2>
                    <p className="text-muted-foreground text-sm mt-2 font-medium uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" /> Administrative Control Panel
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={exportCSV} variant="outline" className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 border-primary/10 hover:bg-primary hover:text-white transition-all">
                        <Download className="w-4 h-4" /> Export Ledger
                    </Button>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <Card key={i} className="border border-border/50 shadow-sm bg-white rounded-[2rem] overflow-hidden group">
                        <CardContent className="p-8 flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-3xl font-display font-bold text-primary">{s.value}</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">{s.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Elite Table Interface */}
            <Card className="border border-border/50 shadow-xl bg-white rounded-[2rem] overflow-hidden">
                <div className="p-8 flex flex-col sm:flex-row items-center gap-6 bg-slate-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="w-4 h-4 text-primary absolute left-4 top-1/2 -translate-y-1/2" />
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Find personnel by name or email..."
                            className="pl-12 h-12 bg-white border-border/60 rounded-xl text-sm focus:ring-primary focus:border-primary shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{filtered.length} Indexed Results</p>
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
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-left">Identity</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-left hidden md:table-cell">Protocol</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-left hidden lg:table-cell">Joined</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-left">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filtered.map(user => (
                                    <tr key={user.id} className="hover:bg-secondary/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/20 overflow-hidden shadow-inner font-display font-bold">
                                                        {user.image ? (
                                                            <img src={user.image} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            (user.name?.[0] ?? user.email[0]).toUpperCase()
                                                        )}
                                                    </div>
                                                    {user.status === 'ACTIVE' && (
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-primary truncate tracking-tight">{user.name ?? 'Anonymous Client'}</p>
                                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium truncate mt-0.5">
                                                        <Mail className="w-3 h-3 text-primary" /> {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 hidden md:table-cell">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    {user.loginMethod === 'GOOGLE' ? <Chrome className="w-3.5 h-3.5 text-primary" /> : <Mail className="w-3.5 h-3.5 text-primary" />}
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{user.loginMethod}</span>
                                                </div>
                                                {user.role === 'ADMIN' && (
                                                    <Badge className="text-[9px] w-fit font-bold bg-primary text-white border-none h-5 px-2">
                                                        AUTHORIZED ADMIN
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 hidden lg:table-cell">
                                            <p className="text-[11px] text-primary/60 font-medium flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-primary/50" />
                                                {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge className={`text-[9px] font-bold uppercase tracking-widest h-6 px-3 border ${user.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`} variant="outline">
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleToggleStatus(user)}
                                                    className={`h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest gap-2 ${user.status === 'ACTIVE' ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                                                >
                                                    {user.status === 'ACTIVE' ? <><UserX className="w-3.5 h-3.5" /> Suspend</> : <><UserCheck className="w-3.5 h-3.5" /> Re-Active</>}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setUserToDelete(user)}
                                                    className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest gap-2 text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Purge
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

            {/* Elite Warning - Purge Confirmation */}
            <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
                <AlertDialogContent className="rounded-[2rem] border-red-100 bg-white p-10 max-w-lg shadow-2xl">
                    <AlertDialogHeader>
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 mx-auto">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <AlertDialogTitle className="font-display text-2xl text-center text-primary">Purge User Entry?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-muted-foreground mt-4 leading-relaxed font-body">
                            You are about to permanently remove <strong>{userToDelete?.name || userToDelete?.email}</strong> from the system database. This action is terminal and cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-4 mt-8">
                        <AlertDialogCancel className="flex-1 rounded-xl h-12 font-bold uppercase tracking-widest text-xs border-primary/10">Abort Purge</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 font-bold uppercase tracking-widest text-xs shadow-lg shadow-red-200">Confirm Deletion</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
