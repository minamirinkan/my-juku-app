import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { formatDate } from '@/utils/dateFormatter';
import { Student } from '@/types/types';

type Props = {
    student: Student;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onShowDetail: (student: Student) => void;
};

const StudentRow: React.FC<Props> = ({ student, isSelected, onSelect, onShowDetail }) => {
    return (
        <tr className="hover:bg-gray-50 text-sm">
            <td className="border px-4 py-2">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(student.id ?? '')}
                />
            </td>
            <td className="border px-4 py-2">{student.studentId}</td>
            <td className="border px-4 py-2">{student.lastName} {student.firstName}</td>
            <td className="border px-4 py-2">{student.lastNameKana} {student.firstNameKana}</td>
            <td className="border px-4 py-2">{student.grade}</td>
            <td className="border px-4 py-2">{formatDate(student.entryDate)}</td>
            <td className="border px-4 py-2 text-center">
                {student.billingStatus === '未請求' && (
                    <FaExclamationTriangle className="text-red-500 inline-block" />
                )}
            </td>
            <td className="border px-4 py-2">
                <button
                    onClick={() => onShowDetail(student)}
                    className="text-blue-600 hover:underline"
                >
                    詳細
                </button>
            </td>
        </tr>
    );
};

export default StudentRow;
