'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import NewsManagement from '@/components/admin/NewsManagement';

export default function AdminNewsPage() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session && (session.user as any)?.role !== 'ADMIN') {
            router.push('/');
        }
    }, [session, router]);

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-4">
            <div className="section-container">
                <NewsManagement />
            </div>
        </div>
    );
}
