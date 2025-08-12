import React, { useState } from 'react';
import MonthlyAttendanceTable from './MonthlyAttendanceTable';
import AttendanceSubTable from './AttendanceSubTable';
import RegularLessonTable from './RegularLessonTable';

type Props = {
    classroomCode: string;
    studentId: string;
    studentName: string;
    selectedMonth: string;
    mode: 'regular' | 'seasonal';
};

const AttendanceTabs: React.FC<Props> = ({
    classroomCode,
    studentId,
    studentName,
    selectedMonth,
    mode,
}) => {
    const [activeTab, setActiveTab] = useState < 'レギュラー授業' | '月間出席記録' | '講習授業' > ('月間出席記録');

    const tabs: Array<'レギュラー授業' | '月間出席記録' | '講習授業'> = ['レギュラー授業', '月間出席記録', '講習授業'];

    const renderActiveTable = () => {
        switch (activeTab) {
            case 'レギュラー授業':
                return (
                    <RegularLessonTable
                        classroomCode={classroomCode}
                        studentId={studentId}
                        studentName={studentName}
                        selectedMonth={selectedMonth}
                    />
                );
            case '月間出席記録':
                return (
                    <MonthlyAttendanceTable
                        classroomCode={classroomCode}
                        studentId={studentId}
                        studentName={studentName}
                        selectedMonth={selectedMonth}
                    />
                );
            case '講習授業':
                return (
                    <AttendanceSubTable
                        mode="seasonal"
                        classroomCode={classroomCode}
                        studentId={studentId}
                        studentName={studentName}
                        selectedMonth={selectedMonth}
                        data={[]}
                        teachers={[]}
                        editingIndex={null}
                        editValues={null}
                        handleEditClick={() => {}}
                        handleChange={() => {}}
                        handleSaveClick={() => {}}
                        setEditingIndex={() => {}}
                        getStatusClass={() => ''}
                        periodLabels={[]}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-w-[700px]">
            <div className="flex space-x-4 mb-4 border-b pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-semibold rounded-t ${activeTab === tab
                            ? 'bg-white border-t border-l border-r text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {renderActiveTable()}
        </div>
    );
};

export default AttendanceTabs;
