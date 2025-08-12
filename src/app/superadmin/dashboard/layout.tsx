'use client';

import { useState } from 'react';
import { SuperAdminDataProvider } from '@/contexts/providers/SuperAdminDataProvider';
import SuperAdminHeader from '@/app/components/header';
import SuperAdminSidebar from '@/app/components/sidebar';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <SuperAdminDataProvider>
            <div className="flex flex-col min-h-screen">
                <SuperAdminHeader
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    role="superadmin"
                />
                <div className="flex flex-1 overflow-hidden">
                    {sidebarOpen && (
                        <div className="w-64 border-r border-gray-200">
                            <SuperAdminSidebar onSelectMenu={(key) => console.log(key)} />
                        </div>
                    )}
                    <main className="flex-1 p-4 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SuperAdminDataProvider>
    );
}
