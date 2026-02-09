'use client';

import { useState } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Toaster } from '@/components/ui/toaster';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) {
        return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <>
            <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
            <Toaster />
        </>
    );
}
