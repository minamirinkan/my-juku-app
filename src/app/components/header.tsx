'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
    onToggleSidebar: () => void;
    role: 'superadmin' | 'admin' | 'customer' | 'teacher';
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, role }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const dashboardPath =
        role === 'superadmin'
            ? '/superadmin/dashboard'
            : role === 'admin'
                ? '/admin/dashboard'
                : role === 'customer'
                    ? '/mypage/dashboard'
                    : '/teacher/dashboard';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="header flex justify-between items-center p-4 bg-gray-200">
            <div className="left-section flex items-center space-x-2">
                <button
                    onClick={onToggleSidebar}
                    className="text-2xl px-2 py-1 rounded hover:bg-gray-300"
                    aria-label="Toggle Sidebar"
                >
                    ☰
                </button>
                <Link href={dashboardPath} className="text-xl font-bold">
                    ATOM
                </Link>
            </div>
            <div className="right-section relative" ref={dropdownRef}>
                <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                >
                    管理者ページ
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border shadow z-50">
                        <Link
                            href="/superadmin/settings"
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            管理者情報
                        </Link>
                        <Link
                            href="/"
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            ログアウト
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
