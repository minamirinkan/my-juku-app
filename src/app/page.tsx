'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const DevLoginSelector: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">ログイン画面選択（開発用）</h1>

      <button
        className="btn bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded cursor-pointer"
        onClick={() => router.push('/superadmin')}
      >
        🔑 SuperAdminログイン
      </button>

      <button
        className="btn bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded cursor-pointer"
        onClick={() => router.push('/admin')}
      >
        🏫 Adminログイン
      </button>

      <button
        className="btn bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded cursor-pointer"
        onClick={() => router.push('/customer')}
      >
        👤 Customerログイン
      </button>

      <button
        className="btn bg-yellow-500 text-white hover:bg-yellow-600 px-4 py-2 rounded cursor-pointer"
        onClick={() => router.push('/teacher')}
      >
        👤 Teacherログイン
      </button>
    </div>

  );
};

export default DevLoginSelector;
