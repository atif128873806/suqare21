import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Lead } from '@/types/lead';

interface UseLeadsOptions {
    autoFetch?: boolean;
}

export function useLeads(options: UseLeadsOptions = { autoFetch: true }) {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const fetchLeads = async () => {
        if (!token) return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getLeads(token) as Lead[];
            setLeads(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch leads');
        } finally {
            setIsLoading(false);
        }
    };

    const updateLeadStatus = async (id: string, status: string) => {
        if (!token) return;

        try {
            await api.updateLeadStatus(id, status, token);
            await fetchLeads(); // Refresh leads
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        if (options.autoFetch && token) {
            fetchLeads();
        }
    }, [token]);

    return {
        leads,
        isLoading,
        error,
        refetch: fetchLeads,
        updateLeadStatus,
    };
}
