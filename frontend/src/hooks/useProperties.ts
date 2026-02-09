'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Property } from '@/types/property';

interface UsePropertiesOptions {
    filters?: {
        type?: string;
        purpose?: string;
        minPrice?: number;
        maxPrice?: number;
        location?: string;
        search?: string;
    };
    autoFetch?: boolean;
}

export function useProperties(options: UsePropertiesOptions = {}) {
    const { filters, autoFetch = true } = options;
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProperties = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getProperties(filters);
            setProperties(data as Property[]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch properties');
            console.error('Error fetching properties:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchProperties();
        }
    }, [JSON.stringify(filters), autoFetch]);

    return {
        properties,
        isLoading,
        error,
        refetch: fetchProperties,
    };
}

export function useProperty(id: string) {
    const [property, setProperty] = useState<Property | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperty = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await api.getProperty(id);
                setProperty(data as Property);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch property');
                console.error('Error fetching property:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProperty();
        }
    }, [id]);

    return {
        property,
        isLoading,
        error,
    };
}
