'use client';

import { useState } from 'react';
import { AdminDataProvider } from '../AdminDataProvider';
import Header from '@/app/components/header';
import AdminSidebar from '@/app/components/adminSidebar';
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <AdminDataProvider>
            <div className="flex flex-col min-h-screen">
                <Header
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    role="admin"
                />
                <div className="flex flex-1 overflow-hidden">
                    {sidebarOpen && (
                        <div className="w-64 border-r border-gray-200">
                            <AdminSidebar onSelectMenu={(key) => console.log(key)} />
                        </div>
                    )}
                    <main className="flex-1 p-4 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AdminDataProvider>
    );
}
