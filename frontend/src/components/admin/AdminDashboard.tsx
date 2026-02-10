'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useProperties } from '@/hooks/useProperties';
import { useLeads } from '@/hooks/useLeads';
import PropertyList from './PropertyList';
import PropertyForm, { PropertyFormData } from './PropertyForm';
import LeadManagement from './LeadManagement';
import ChatbotLogs from './ChatbotLogs';
import AdminSettings from './AdminSettings';
import { Property } from '@/types/property';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
    Building2,
    Home,
    Users,
    MessageSquare,
    Settings,
    Plus,
    Search,
    LogOut,
    Menu,
    X,
    LayoutDashboard,
    Edit,
    Trash2,
    Eye,
    TrendingUp,
    Clock,
    MapPin
} from 'lucide-react';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [showPropertyModal, setShowPropertyModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    const { token } = useAuth();
    const { toast } = useToast();

    // Fetch real data from API
    const { properties, isLoading: isLoadingProperties, refetch: refetchProperties } = useProperties({ autoFetch: true });
    const { leads, isLoading: leadsLoading, updateLeadStatus, refetch: refetchLeads } = useLeads({ autoFetch: true });

    // Chatbot data
    const [chatConversations, setChatConversations] = useState<any[]>([]);
    const [chatLeads, setChatLeads] = useState<any[]>([]);
    const [isChatbotLoading, setIsChatbotLoading] = useState(false);

    // Fetch chatbot data when tab becomes active
    useEffect(() => {
        if (activeTab === 'chatbot' && token) {
            fetchChatbotData();
        }
    }, [activeTab, token]);

    const fetchChatbotData = async () => {
        if (!token) return;
        setIsChatbotLoading(true);
        try {
            const [convos, leads] = await Promise.all([
                api.getChatConversations(token),
                api.getChatLeads(token)
            ]);
            setChatConversations(convos as any[]);
            setChatLeads(leads as any[]);
        } catch (error) {
            console.error('Error fetching chatbot data:', error);
        } finally {
            setIsChatbotLoading(false);
        }
    };

    const stats = [
        { icon: Building2, label: 'Total Properties', value: properties.length, color: 'bg-blue-500', trend: '+2 this week' },
        { icon: Home, label: 'Available', value: properties.filter(p => p.status === 'AVAILABLE').length, color: 'bg-green-500', trend: '85% occupancy' },
        { icon: Users, label: 'New Leads', value: leads.filter(l => l.status === 'NEW').length, color: 'bg-amber-500', trend: 'High activity' },
        { icon: MessageSquare, label: 'Total Leads', value: leads.length, color: 'bg-purple-500', trend: '+12% vs last month' },
    ];

    // Property CRUD handlers
    const handlePropertySubmit = async (data: PropertyFormData) => {
        if (!token) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Authentication required"
            });
            return;
        }

        try {
            if (selectedProperty) {
                await api.updateProperty(selectedProperty.id, data, token);
                toast({ title: "Success", description: "Property updated successfully" });
            } else {
                await api.createProperty(data, token);
                toast({ title: "Success", description: "Property created successfully" });
            }

            setShowPropertyModal(false);
            setSelectedProperty(null);
            refetchProperties();
        } catch (error) {
            console.error('Error saving property:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : 'Failed to save property'
            });
        }
    };

    const handleDeleteProperty = async () => {
        if (!token || !selectedProperty) return;

        try {
            await api.deleteProperty(selectedProperty.id, token);
            toast({ title: "Success", description: "Property deleted successfully" });
            setShowDeleteDialog(false);
            setSelectedProperty(null);
            refetchProperties();
        } catch (error) {
            console.error('Error deleting property:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : 'Failed to delete property'
            });
        }
    };

    const handleUpdateLeadStatus = async (id: string, status: string) => {
        if (!token) return;
        try {
            await updateLeadStatus(id, status);
            toast({ title: "Status Updated", description: `Lead status changed to ${status}` });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update lead status"
            });
        }
    };

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'properties', icon: Building2, label: 'Properties' },
        { id: 'leads', icon: Users, label: 'Leads' },
        { id: 'chatbot', icon: MessageSquare, label: 'Chatbot' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    const getStatusBadge = (status: string) => {
        const styles = {
            available: 'bg-green-100 text-green-700 border-green-200',
            rented: 'bg-amber-100 text-amber-700 border-amber-200',
            sold: 'bg-gray-100 text-gray-700 border-gray-200',
        };
        const s = status.toLowerCase();
        return <Badge variant="outline" className={styles[s as keyof typeof styles] || ''}>{status}</Badge>;
    };

    const getImageSrc = (image: string | { src: string; height: number; width: number; blurDataURL?: string }) => {
        return typeof image === 'string' ? image : image.src;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full shadow-2xl'}`}>
                <div className="flex flex-col h-full uppercase">
                    {/* Logo Section */}
                    <div className="p-8 pb-4">
                        <Link href="/" className="flex items-center gap-3">
                            <img src="/logo.png" alt="Square21 Logo" className="w-12 h-12 object-contain" />
                            <div>
                                <h1 className="text-slate-900 font-display text-xl font-bold tracking-tight">
                                    Square<span className="text-primary">21</span>
                                </h1>
                                <p className="text-slate-400 text-[10px] font-bold tracking-widest mt-0.5">ADMINISTRATION</p>
                            </div>
                        </Link>
                    </div>

                    <div className="px-6 py-6">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center">
                                    <Users className="w-5 h-5 text-slate-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 truncate">Administrator</p>
                                    <p className="text-[10px] text-slate-500 truncate lowercase">admin@square21.pk</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-1.5 mb-8">
                            <p className="text-[10px] font-bold text-slate-400 mb-4 px-4 tracking-widest">MAIN MENU</p>
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === item.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
                                    <span className="font-semibold text-sm">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Footer Section of Sidebar */}
                    <div className="mt-auto p-6">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                        >
                            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            <span className="font-semibold text-sm">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 sticky top-0 z-30 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                        <div>
                            <h2 className="text-slate-900 text-lg font-bold capitalize flex items-center gap-2">
                                {activeTab}
                                {activeTab === 'dashboard' && <Badge className="bg-primary/10 text-primary border-none text-[10px] px-2 py-0">LIVE</Badge>}
                            </h2>
                            <p className="text-slate-400 text-xs hidden sm:block">Welcome back to your administration portal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input
                                placeholder="Quick search..."
                                className="pl-9 h-10 w-64 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl text-sm"
                            />
                        </div>
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors uppercase tracking-tight"
                        >
                            Public Site <span className="opacity-50">↗</span>
                        </Link>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-8 max-w-7xl mx-auto w-full flex-1">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Hero Welcome */}
                            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-bold font-display">Performance Overview</h2>
                                        <p className="text-slate-400 max-w-md">Your real estate platform is performing well today. Check out the latest stats below.</p>
                                    </div>
                                    <Button className="bg-white text-slate-900 hover:bg-slate-100 h-12 px-6 rounded-2xl font-bold transition-transform hover:scale-105 active:scale-95">
                                        Download Report
                                    </Button>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
                                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[50px]" />
                            </div>

                            {/* Stats Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden bg-white rounded-3xl">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col gap-4">
                                                <div className={`w-14 h-14 rounded-2xl ${stat.color} p-0.5 shadow-lg group-hover:scale-110 transition-transform`}>
                                                    <div className="w-full h-full bg-white/20 rounded-[14px] flex items-center justify-center">
                                                        <stat.icon className="w-7 h-7 text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <p className="text-slate-500 text-xs font-medium">{stat.label}</p>
                                                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Recent Properties */}
                                <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
                                    <div className="p-8 pb-4 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-display text-xl font-bold text-slate-900">Featured Properties</h3>
                                            <p className="text-slate-400 text-xs font-medium">Recently added listings</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5 font-bold" onClick={() => setActiveTab('properties')}>
                                            View All
                                        </Button>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            {properties.slice(0, 4).map((property) => (
                                                <div key={property.id} className="p-4 flex items-center gap-5 hover:bg-slate-50 rounded-2xl transition-colors group cursor-pointer">
                                                    <div className="relative w-20 h-14 rounded-xl overflow-hidden shadow-sm">
                                                        <img
                                                            src={getImageSrc(property.images[0])}
                                                            alt={property.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-slate-900 truncate text-sm">{property.title}</p>
                                                        <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {property.location.includes(' | ') ? property.location.split(' | ')[0] : property.location}
                                                        </p>
                                                    </div>
                                                    <div className="text-right hidden sm:block">
                                                        <p className="font-bold text-slate-900 text-sm">PKR {property.price.toLocaleString()}</p>
                                                        {getStatusBadge(property.status)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Activity */}
                                <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
                                    <div className="p-8 pb-4">
                                        <h3 className="font-display text-xl font-bold text-slate-900">Recent Leads</h3>
                                        <p className="text-slate-400 text-xs font-medium">Latest customer inquiries</p>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="space-y-5">
                                            {leads.slice(0, 5).map((lead) => (
                                                <div key={lead.id} className="flex gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500">
                                                        {lead.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0 space-y-0.5">
                                                        <p className="text-sm font-bold text-slate-900 truncate">{lead.name}</p>
                                                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(lead.createdAt).toLocaleDateString()}
                                                        </p>
                                                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-slate-200 text-slate-500 uppercase tracking-tighter">
                                                            {lead.source}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                            {leads.length === 0 && <p className="text-center text-slate-400 text-sm py-10 italic">No new leads captured</p>}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'properties' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <PropertyList
                                properties={properties}
                                isLoading={isLoadingProperties}
                                onEdit={(property) => {
                                    setSelectedProperty(property);
                                    setShowPropertyModal(true);
                                }}
                                onDelete={(property) => {
                                    setSelectedProperty(property);
                                    setShowDeleteDialog(true);
                                }}
                                onCreate={() => {
                                    setSelectedProperty(null);
                                    setShowPropertyModal(true);
                                }}
                            />
                        </div>
                    )}

                    {activeTab === 'leads' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <LeadManagement
                                leads={leads}
                                isLoading={leadsLoading}
                                onUpdateStatus={handleUpdateLeadStatus}
                            />
                        </div>
                    )}

                    {activeTab === 'chatbot' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ChatbotLogs
                                conversations={chatConversations}
                                chatLeads={chatLeads}
                                isLoading={isChatbotLoading}
                            />
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                            <AdminSettings />
                        </div>
                    )}
                </div>
            </main>

            {/* Property Form Modal */}
            {showPropertyModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] overflow-y-auto animate-in fade-in duration-300">
                    <div className="min-h-full flex items-center justify-center p-0 lg:p-8">
                        <div className="bg-white rounded-none lg:rounded-[2.5rem] border-none w-full max-w-5xl shadow-2xl relative animate-in zoom-in-95 duration-300 my-auto">
                            <button
                                onClick={() => setShowPropertyModal(false)}
                                className="absolute right-6 top-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors z-[70]"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                            <div className="p-8 lg:p-12">
                                <div className="mb-10">
                                    <h2 className="text-4xl font-bold font-display text-slate-900">
                                        {selectedProperty ? 'Edit Property' : 'Publish Property'}
                                    </h2>
                                    <p className="text-slate-400 mt-2 font-medium">Fill in the details below to update your catalog.</p>
                                </div>
                                <PropertyForm
                                    property={selectedProperty || undefined}
                                    onSubmit={handlePropertySubmit}
                                    onCancel={() => {
                                        setShowPropertyModal(false);
                                        setSelectedProperty(null);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && selectedProperty && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-300">
                    <Card className="max-w-md w-full p-8 border-none shadow-2xl bg-white rounded-[2rem] animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Delete Listing?</h3>
                        <p className="text-slate-500 mb-8 font-medium">
                            Are you sure you want to delete <span className="text-slate-900 font-bold">"{selectedProperty.title}"</span>? This action is permanent and cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setSelectedProperty(null);
                                }}
                                className="flex-1 h-12 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteProperty}
                                className="flex-1 h-12 rounded-xl font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
                            >
                                Delete
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
