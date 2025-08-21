import React from 'react';
import { useState } from 'react';
import AttendanceSubTable from './SubTabs/AttendanceSubTable';
import useTeachers from '@/hooks/useTeachers';
import usePeriodLabels from '@/hooks/usePeriodLabels';
import useMakeupLessons from '@/hooks/useMakeupLessons';
import { useAttendanceEdit } from '@/hooks/useAttendanceEdit';
import { MakeupLesson } from '@/types/makeupLessons';

type Props = {
    studentId?: string;
    classroomCode: string;
    studentName: string;
};

type EditValues = MakeupLesson & { periodLabel?: string; name: string };

const MakeupAttendanceTable: React.FC<Props> = ({ studentId, classroomCode, studentName }) => {
    const { teachers } = useTeachers(); // { teachers: Teacher[] }
    const { periodLabels } = usePeriodLabels(classroomCode); // { periodLabels: PeriodLabel[] }
    const { makeupLessons, loading } = useMakeupLessons(studentId || null); // { makeupLessons: MakeupLesson[], loading: boolean }
    const [editingIndexMakeup, setEditingIndexMakeup] = useState<number | null>(null);
    const [editingMakeupLesson, setEditingMakeupLesson] = useState<MakeupLesson | null>(null);
    const [editValues, setEditValues] = useState<EditValues | null>(null);

    const {
        handleChange,
        handleSaveClick,
    } = useAttendanceEdit(makeupLessons, () => { }, periodLabels, teachers, classroomCode, studentName);

    const statusStyles: Record<string, string> = {
        '振替': 'bg-green-100 text-green-800',
    };
    const getStatusClass = (status: string) => statusStyles[status] || '';

    if (loading) {
        return <p>読み込み中...</p>;
    }

    return (
        <div className="min-w-[700px]">
            <h2 className="text-lg font-bold mb-2 text-yellow-600">振替情報</h2>
            <AttendanceSubTable
                data={makeupLessons || []}
                teachers={teachers}
                editingIndex={editingIndexMakeup}
                setEditingIndex={setEditingIndexMakeup}
                editValues={editValues}
                handleEditClick={(idx: number) => {
                    const entry = makeupLessons[idx];
                    setEditingMakeupLesson(entry);
                    setEditingIndexMakeup(idx);
                    const periodLabel = periodLabels[entry.period ? entry.period - 1 : 0]?.label || '';
                    setEditValues({
                        ...entry,
                        periodLabel,
                        name: entry.name || studentName || '',
                    });
                }}
                handleChange={handleChange}
                handleSaveClick={() => handleSaveClick('makeup')}
                getStatusClass={getStatusClass}
                periodLabels={periodLabels}
                classroomCode={classroomCode}
                studentId={studentId!}
                studentName={studentName}
                mode="seasonal"
                selectedMonth={new Date().toISOString().split('T')[0]}
            />
        </div>
    );
};

export default MakeupAttendanceTable;
