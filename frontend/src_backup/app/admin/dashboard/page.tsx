'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('square21_token');
        if (!token) {
            router.push('/admin/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-zinc-50 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter">DASHBOARD</h1>
                        <p className="text-zinc-500">Welcome back, Admin.</p>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('square21_token');
                            router.push('/admin/login');
                        }}
                        className="px-6 py-2 bg-zinc-200 text-zinc-800 font-bold rounded-full hover:bg-red-600 hover:text-white transition-all text-sm"
                    >
                        Log Out
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DashboardStat title="Active Properties" value="12" color="bg-zinc-950" />
                    <DashboardStat title="New Leads" value="4" color="bg-red-600" />
                    <DashboardStat title="Chatbot Sessions" value="28" color="bg-zinc-800" />
                </div>

                <div className="mt-12 p-8 bg-white rounded-3xl border border-zinc-100 min-h-[400px]">
                    <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                    <p className="text-zinc-400 italic">No recent activity to show.</p>
                </div>
            </div>
        </div>
    );
}

function DashboardStat({ title, value, color }: { title: string; value: string; color: string }) {
    return (
        <div className="p-8 bg-white rounded-3xl border border-zinc-100 hover:shadow-xl hover:shadow-zinc-100 transition-all">
            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">{title}</h3>
            <div className="flex items-end justify-between">
                <span className="text-4xl font-bold">{value}</span>
                <div className={`w-10 h-1 h-1 ${color} rounded-full mb-2`}></div>
            </div>
        </div>
    );
}
