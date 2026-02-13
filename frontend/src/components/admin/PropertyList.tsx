'use client';

import { useState } from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, Plus } from 'lucide-react';
import { formatPrice } from '@/data/properties';

interface PropertyListProps {
    properties: Property[];
    isLoading: boolean;
    onEdit: (property: Property) => void;
    onDelete: (property: Property) => void;
    onCreate: () => void;
}

const PropertyList = ({ properties, isLoading, onEdit, onDelete, onCreate }: PropertyListProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProperties = properties.filter(p => {
        const location = p.location.includes(' | ') ? p.location.split(' | ')[0] : p.location;
        return (
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const getStatusBadge = (status: string) => {
        const styles = {
            AVAILABLE: 'bg-green-500/10 text-green-500',
            RENTED: 'bg-blue-500/10 text-blue-500',
            SOLD: 'bg-gray-500/10 text-gray-500',
        };
        return <Badge className={styles[status as keyof typeof styles] || ''}>{status}</Badge>;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search properties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <Button onClick={onCreate} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Property
                </Button>
            </div>

            {/* Properties List */}
            {filteredProperties.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <p className="text-muted-foreground">No properties found</p>
                </div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                        {filteredProperties.map((property) => {
                            const getImageSrc = (image: string | { src: string } | undefined | null) => {
                                if (!image) return '/placeholder.svg';
                                return typeof image === 'string' ? image : image.src;
                            };
                            const location = property.location.includes(' | ')
                                ? property.location.split(' | ')[0]
                                : property.location;

                            return (
                                <div key={property.id} className="bg-card rounded-lg border border-border p-4">
                                    <div className="flex gap-3 mb-3">
                                        {property.images && property.images[0] && (
                                            <img
                                                src={getImageSrc(property.images[0])}
                                                alt={property.title}
                                                className="w-20 h-16 object-cover rounded-md flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm line-clamp-1">{property.title}</p>
                                            <p className="text-xs text-muted-foreground">{location}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                        <div>
                                            <span className="text-xs text-muted-foreground">Type:</span>
                                            <Badge variant="outline" className="capitalize ml-1 text-xs">
                                                {property.type.toLowerCase()}
                                            </Badge>
                                        </div>
                                        <div>
                                            <span className="text-xs text-muted-foreground">Purpose:</span>
                                            <span className="capitalize ml-1 text-xs">{property.purpose.toLowerCase()}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-muted-foreground">Price:</span>
                                            <span className="font-medium ml-1 text-xs">{formatPrice(property.price)}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-muted-foreground">Status:</span>
                                            <span className="ml-1">{getStatusBadge(property.status)}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2 border-t border-border">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(property)}
                                            className="flex-1 text-xs h-8"
                                        >
                                            <Edit className="w-3 h-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDelete(property)}
                                            className="flex-1 text-xs h-8 hover:bg-destructive hover:text-destructive-foreground"
                                        >
                                            <Trash2 className="w-3 h-3 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50 border-b border-border">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-sm font-medium">Property</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium">Type</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium">Purpose</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium">Price</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
                                        <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredProperties.map((property) => {
                                        const getImageSrc = (image: string | { src: string } | undefined | null) => {
                                            if (!image) return '/placeholder.svg';
                                            return typeof image === 'string' ? image : image.src;
                                        };

                                        const location = property.location.includes(' | ')
                                            ? property.location.split(' | ')[0]
                                            : property.location;

                                        return (
                                            <tr key={property.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        {property.images && property.images[0] && (
                                                            <img
                                                                src={getImageSrc(property.images[0])}
                                                                alt={property.title}
                                                                className="w-16 h-12 object-cover rounded-md"
                                                            />
                                                        )}
                                                        <div>
                                                            <p className="font-medium line-clamp-1">{property.title}</p>
                                                            <p className="text-sm text-muted-foreground">{location}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline" className="capitalize">
                                                        {property.type.toLowerCase()}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm capitalize">
                                                        {property.purpose.toLowerCase()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="font-medium">{formatPrice(property.price)}</span>
                                                    <span className="text-xs text-muted-foreground block">
                                                        {property.priceType === 'monthly' ? '/month' : property.priceType === 'yearly' ? '/year' : ''}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {getStatusBadge(property.status)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => onEdit(property)}
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => onDelete(property)}
                                                            title="Delete"
                                                            className="hover:text-destructive"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Summary */}
            <div className="text-sm text-muted-foreground">
                Showing {filteredProperties.length} of {properties.length} properties
            </div>
        </div>
    );
};

export default PropertyList;
