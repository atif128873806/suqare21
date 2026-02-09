'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
    Save,
    Globe,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Shield
} from 'lucide-react';

const AdminSettings = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        siteName: 'Square21 Marketing',
        siteDescription: 'Premium Real Estate Solutions in Islamabad & Rawalpindi',
        contactEmail: 'contact@square21.pk',
        contactPhone: '+92 300 1234567',
        address: 'Office 12, 3rd Floor, Al-Falah Plaza, G-9 Markaz, Islamabad',
        facebook: 'https://facebook.com/square21',
        instagram: 'https://instagram.com/square21',
        twitter: 'https://twitter.com/square21'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Settings Saved",
                description: "Your changes have been applied successfully.",
            });
        }, 1000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <form onSubmit={handleSave} className="space-y-8">
                {/* General Information */}
                <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-blue-600" />
                            </div>
                            <CardTitle className="text-xl font-bold font-display">General Information</CardTitle>
                        </div>
                        <CardDescription>Basic website identity and SEO settings</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="siteName" className="font-bold text-xs uppercase tracking-widest text-slate-400">Site Name</Label>
                                <Input
                                    id="siteName"
                                    name="siteName"
                                    value={settings.siteName}
                                    onChange={handleChange}
                                    className="rounded-xl border-slate-200 focus:ring-primary h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail" className="font-bold text-xs uppercase tracking-widest text-slate-400">Contact Email</Label>
                                <Input
                                    id="contactEmail"
                                    name="contactEmail"
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={handleChange}
                                    className="rounded-xl border-slate-200 focus:ring-primary h-12"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="siteDescription" className="font-bold text-xs uppercase tracking-widest text-slate-400">Site Description</Label>
                            <Textarea
                                id="siteDescription"
                                name="siteDescription"
                                value={settings.siteDescription}
                                onChange={handleChange}
                                className="rounded-xl border-slate-200 focus:ring-primary min-h-[100px]"
                                placeholder="Briefly describe your agency..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact & Socials */}
                <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                <Phone className="w-5 h-5 text-purple-600" />
                            </div>
                            <CardTitle className="text-xl font-bold font-display">Contact & Social Media</CardTitle>
                        </div>
                        <CardDescription>How clients can reach your business</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="contactPhone" className="font-bold text-xs uppercase tracking-widest text-slate-400">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="contactPhone"
                                        name="contactPhone"
                                        value={settings.contactPhone}
                                        onChange={handleChange}
                                        className="pl-11 rounded-xl border-slate-200 focus:ring-primary h-12"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="facebook" className="font-bold text-xs uppercase tracking-widest text-slate-400">Facebook URL</Label>
                                <div className="relative">
                                    <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="facebook"
                                        name="facebook"
                                        value={settings.facebook}
                                        onChange={handleChange}
                                        className="pl-11 rounded-xl border-slate-200 focus:ring-primary h-12"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instagram" className="font-bold text-xs uppercase tracking-widest text-slate-400">Instagram URL</Label>
                                <div className="relative">
                                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="instagram"
                                        name="instagram"
                                        value={settings.instagram}
                                        onChange={handleChange}
                                        className="pl-11 rounded-xl border-slate-200 focus:ring-primary h-12"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="twitter" className="font-bold text-xs uppercase tracking-widest text-slate-400">Twitter URL</Label>
                                <div className="relative">
                                    <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="twitter"
                                        name="twitter"
                                        value={settings.twitter}
                                        onChange={handleChange}
                                        className="pl-11 rounded-xl border-slate-200 focus:ring-primary h-12"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="font-bold text-xs uppercase tracking-widest text-slate-400">Physical Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="address"
                                    name="address"
                                    value={settings.address}
                                    onChange={handleChange}
                                    className="pl-11 rounded-xl border-slate-200 focus:ring-primary h-12"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-3 text-slate-500">
                        <Shield className="w-5 h-5" />
                        <span className="text-sm font-medium">Auto-save is currently disabled</span>
                    </div>
                    <div className="flex gap-4">
                        <Button type="button" variant="ghost" className="rounded-xl font-bold px-6">Discard</Button>
                        <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90 rounded-xl font-bold px-8 h-12 shadow-lg shadow-primary/25" disabled={isLoading}>
                            {isLoading ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
