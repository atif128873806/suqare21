'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { sectors } from '@/data/properties';
import { PropertyPurpose } from '@/types/property';

type SearchPurpose = 'ALL' | 'RENT' | 'SALE';

export default function HeroSearch() {
    const router = useRouter();
    const [purpose, setPurpose] = useState<SearchPurpose>('ALL');
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
        <div className="w-full animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {/* Purpose Toggle */}
            <div className="flex justify-center mb-3 sm:mb-4">
                <div className="inline-flex bg-white/[0.06] backdrop-blur-md rounded-full p-0.5 sm:p-1 border border-white/[0.1]">
                    {(['ALL', 'RENT', 'SALE'] as const).map(p => (
                        <button
                            key={p}
                            onClick={() => setPurpose(p)}
                            className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-medium transition-all duration-300 ${purpose === p
                                ? 'bg-secondary text-white shadow-md'
                                : 'text-white/50 hover:text-white/80'
                                }`}
                        >
                            {p === 'ALL' ? 'All' : p === 'RENT' ? 'Rent' : 'Sale'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white/[0.06] backdrop-blur-md rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 border border-white/[0.1]">
                <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
                    {/* Location */}
                    <div className="flex-1 min-w-0">
                        <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger
                                className="h-10 sm:h-11 bg-white/[0.06] border-white/[0.08] text-white/80 text-sm hover:bg-white/[0.1] focus:ring-secondary/50 transition-all rounded-lg"
                                aria-label="Select location"
                            >
                                <SelectValue placeholder="Location" />
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

                    {/* Property Type */}
                    <div className="flex-1 min-w-0">
                        <Select value={lookingFor} onValueChange={setLookingFor}>
                            <SelectTrigger
                                className="h-10 sm:h-11 bg-white/[0.06] border-white/[0.08] text-white/80 text-sm hover:bg-white/[0.1] focus:ring-secondary/50 transition-all rounded-lg"
                                aria-label="Select property type"
                            >
                                <SelectValue placeholder="Property Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
                                <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                                <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Search Button */}
                    <Button
                        onClick={handleSearch}
                        className="h-10 sm:h-11 px-5 sm:px-6 bg-secondary hover:bg-secondary/90 text-white text-sm font-semibold rounded-lg shadow-lg shadow-secondary/20 hover:shadow-secondary/30 transition-all duration-300 flex items-center justify-center gap-2 shrink-0"
                        aria-label="Search properties"
                    >
                        <Search className="w-4 h-4" />
                        <span>Search</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
