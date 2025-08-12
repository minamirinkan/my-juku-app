import React from 'react';
import { useState } from 'react';
import AttendanceSubTable from './AttendanceSubTable';
import useTeachers from '@/hooks/useTeachers';
import usePeriodLabels from '@/hooks/usePeriodLabels';
import { useStudentAttendance } from '@/hooks/useStudentAttendance';
import { useAttendanceEdit } from '@/hooks/useAttendanceEdit';

type Props = {
    classroomCode: string;
    studentId: string;
    studentName: string;
    selectedMonth: string;
};

const MonthlyAttendanceTable: React.FC<Props> = ({
    classroomCode,
    studentId,
    studentName,
    selectedMonth,
}) => {
    const { teachers } = useTeachers();
    const { periodLabels } = usePeriodLabels(classroomCode);

    // 通常の出席データを取得
    const { loading, attendanceList, setAttendanceList } = useStudentAttendance(classroomCode, studentId, selectedMonth);
    const [editingIndexRegular, setEditingIndexRegular] = useState<number | null>(null);
    // 編集用フック
    const {
        editValues,
        setEditValues,
        handleChange,
        handleSaveClick,
        regularList,
    } = useAttendanceEdit(attendanceList, setAttendanceList, periodLabels, teachers, classroomCode, studentName);

    const statusStyles: Record<string, string> = {
        '未定': 'bg-blue-100 text-blue-800',
        '欠席': 'bg-red-100 text-red-800',
        '出席': 'bg-gray-100 text-gray-800',
    };

    const getStatusClass = (status: string) => statusStyles[status] || '';

    if (loading) {
        return <p>読み込み中...</p>;
    }

    return (
        <div className="min-w-[700px]">
            <h2 className="text-lg font-bold mb-2 text-blue-600">月間出席記録</h2>
            <AttendanceSubTable
                data={regularList}
                teachers={teachers}
                editingIndex={editingIndexRegular}
                setEditingIndex={setEditingIndexRegular}
                editValues={editValues}
                handleEditClick={(idx) => {
                    setEditingIndexRegular(idx);
                    const entry = regularList[idx];
                    setEditValues({
                        ...entry,
                        teacherCode: entry.teacher?.code || '',
                        name: entry.name || studentName || '',
                    });
                }}
                handleChange={handleChange}
                handleSaveClick={() => handleSaveClick('regular')}
                getStatusClass={getStatusClass}
                periodLabels={periodLabels}
                classroomCode={classroomCode}
                studentId={studentId}
                studentName={studentName}
                selectedMonth={selectedMonth}
                mode="regular"
            />
        </div>
    );
};

export default MonthlyAttendanceTable;
