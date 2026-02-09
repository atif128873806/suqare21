import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Panel - Square21 Marketing',
    description: 'Admin dashboard for managing properties and leads',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
