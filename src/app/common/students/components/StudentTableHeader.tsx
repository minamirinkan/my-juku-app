import React from 'react';

const StudentTableHeader: React.FC = () => (
    <thead>
        <tr className="bg-gray-100 text-sm">
            <th className="border px-4 py-2 text-center">選択</th>
            <th className="border px-4 py-2 text-center">生徒コード</th>
            <th className="border px-4 py-2 text-center">氏名</th>
            <th className="border px-4 py-2 text-center">フリガナ</th>
            <th className="border px-4 py-2 text-center">学年</th>
            <th className="border px-4 py-2 text-center">登録日</th>
            <th className="border px-4 py-2 text-center">状況</th>
            <th className="border px-4 py-2 text-center">操作</th>
        </tr>
    </thead>
);

export default StudentTableHeader;
