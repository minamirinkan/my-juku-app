import React, { useState, useEffect, ChangeEvent } from 'react';
import StudentTableHeader from './StudentTableHeader';
import StudentRow from './StudentRow';
import PaginationControls from '@/utils/PaginationControls';
import { Student } from '@/types/student';

type Props = {
    students: Student[];
    onShowDetail: (student: Student) => void;
};

const StudentTable: React.FC<Props> = ({ students, onShowDetail }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const totalPages = Math.ceil(students.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, students.length);
    const currentStudents = students.slice(startIndex, endIndex);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage, itemsPerPage]);

    const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleCheckboxChange = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    console.log('currentStudents:', currentStudents);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">検索結果</h2>
                <div className="flex items-center space-x-2 text-sm">
                    <span>表示件数:</span>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="border px-2 py-1 rounded"
                    >
                        <option value={10}>10件</option>
                        <option value={20}>20件</option>
                        <option value={50}>50件</option>
                    </select>
                </div>
            </div>

            <table className="w-full table-auto border-collapse">
                <StudentTableHeader />
                <tbody>
                    {currentStudents.map((student) => (
                        <StudentRow
                            key={student.id}
                            student={student}
                            isSelected={selectedIds.includes(student.id ?? '')}
                            onSelect={handleCheckboxChange}
                            onShowDetail={onShowDetail}
                        />
                    ))}
                </tbody>
            </table>

            <div className="mt-4 text-sm text-gray-600">
                {students.length > 0 ? (
                    <>
                        {students.length}件中 {startIndex + 1}〜{endIndex}件を表示中
                    </>
                ) : (
                    <>データがありません</>
                )}
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default StudentTable;
