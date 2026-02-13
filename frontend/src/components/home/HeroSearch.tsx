'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { sectors } from '@/data/properties';
import { PropertyPurpose } from '@/types/property';

type SearchPurpose = 'ALL' | 'RENT' | 'SALE';

export default function HeroSearch() {
    const router = useRouter();
    const [purpose, setPurpose] = useState<SearchPurpose>('ALL');
    const [city, setCity] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [lookingFor, setLookingFor] = useState<string>('');

    const handleSearch = () => {
        const params = new URLSearchParams();

        // Convert purpose to property purpose filter
        if (purpose === 'RENT') {
            // Rent includes both RENT and LEASE
            params.append('purpose', 'RENT');
        } else if (purpose === 'SALE') {
            params.append('purpose', 'SALE');
        }
        // If ALL, don't add purpose filter

        if (location && location !== 'all') {
            params.append('location', location);
        }

        if (lookingFor && lookingFor !== 'all') {
            params.append('type', lookingFor);
        }

        router.push(`/properties?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-7xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {/* Purpose Toggle Buttons */}
            <div className="flex justify-center mb-4">
                <div className="inline-flex bg-white/95 backdrop-blur-sm rounded-full p-1 shadow-lg">
                    <button
                        onClick={() => setPurpose('ALL')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${purpose === 'ALL'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-700 hover:text-gray-900'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setPurpose('RENT')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${purpose === 'RENT'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-700 hover:text-gray-900'
                            }`}
                    >
                        Rent
                    </button>
                    <button
                        onClick={() => setPurpose('SALE')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${purpose === 'SALE'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-700 hover:text-gray-900'
                            }`}
                    >
                        Sale
                    </button>
                </div>
            </div>

            {/* Search Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
                    {/* City Dropdown */}
                    <div className="md:col-span-3">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                            <Select value={city} onValueChange={setCity}>
                                <SelectTrigger className="pl-10 h-12 border-gray-200 bg-white hover:border-primary focus:border-primary transition-colors">
                                    <SelectValue placeholder="City" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="islamabad">Islamabad</SelectItem>
                                    <SelectItem value="rawalpindi">Rawalpindi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Locations Dropdown */}
                    <div className="md:col-span-3">
                        <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger className="h-12 border-gray-200 bg-white hover:border-primary focus:border-primary transition-colors">
                                <SelectValue placeholder="Locations" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {sectors.map((sector) => (
                                    <SelectItem key={sector} value={sector}>
                                        {sector}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Looking For Dropdown */}
                    <div className="md:col-span-4">
                        <Select value={lookingFor} onValueChange={setLookingFor}>
                            <SelectTrigger className="h-12 border-gray-200 bg-white hover:border-primary focus:border-primary transition-colors">
                                <SelectValue placeholder="Looking For" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Property Types</SelectItem>
                                <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
                                <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                                <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Search Button */}
                    <div className="md:col-span-2">
                        <Button
                            onClick={handleSearch}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            <span className="hidden md:inline">Search</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
