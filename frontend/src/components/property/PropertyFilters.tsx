'use client';

import { PropertyFilter, PropertyType, PropertyPurpose } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sectors } from '@/data/properties';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PropertyFiltersProps {
  filters: PropertyFilter;
  onFilterChange: (filters: PropertyFilter) => void;
  onReset: () => void;
}

const PropertyFilters = ({ filters, onFilterChange, onReset }: PropertyFiltersProps) => {
  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: 'INDUSTRIAL', label: 'Industrial' },
    { value: 'COMMERCIAL', label: 'Commercial' },
    { value: 'RESIDENTIAL', label: 'Residential' },
  ];

  const propertyPurposes: { value: PropertyPurpose; label: string }[] = [
    { value: 'RENT', label: 'For Rent' },
    { value: 'LEASE', label: 'For Lease' },
    { value: 'SALE', label: 'For Sale' },
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-100000', label: 'Under 1 Lac' },
    { value: '100000-500000', label: '1-5 Lac' },
    { value: '500000-1000000', label: '5-10 Lac' },
    { value: '1000000-5000000', label: '10-50 Lac' },
    { value: '5000000-999999999', label: 'Above 50 Lac' },
  ];

  const handlePriceChange = (value: string) => {
    if (value === 'all') {
      const { minPrice, maxPrice, ...rest } = filters;
      onFilterChange(rest);
      return;
    }

    const [min, max] = value.split('-').map(Number);
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const currentPriceValue = filters.minPrice !== undefined && filters.maxPrice !== undefined
    ? `${filters.minPrice}-${filters.maxPrice}`
    : 'all';

  const hasActiveFilters = filters.type || filters.purpose || filters.location || filters.search || filters.minPrice || filters.maxPrice;

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Keyword Search */}
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Keyword Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              className="pl-9"
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        {/* Property Type */}
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Property Type</label>
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) => onFilterChange({ ...filters, type: value === 'all' ? undefined : value as PropertyType })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Purpose */}
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Purpose</label>
          <Select
            value={filters.purpose || 'all'}
            onValueChange={(value) => onFilterChange({ ...filters, purpose: value === 'all' ? undefined : value as PropertyPurpose })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Purposes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Purposes</SelectItem>
              {propertyPurposes.map((purpose) => (
                <SelectItem key={purpose.value} value={purpose.value}>
                  {purpose.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Location</label>
          <Select
            value={filters.location || 'all'}
            onValueChange={(value) => onFilterChange({ ...filters, location: value === 'all' ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
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

        {/* Price Range */}
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Price Range</label>
          <Select
            value={currentPriceValue}
            onValueChange={handlePriceChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Prices" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onReset} className="gap-2">
            <X className="w-4 h-4" />
            Reset Filters
          </Button>
        )}
        <Button variant="secondary" className="gap-2 px-8">
          <Search className="w-4 h-4" />
          Show Results
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilters;
