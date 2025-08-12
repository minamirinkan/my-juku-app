import { useState } from 'react';
import MakeupAttendanceTable from './MakeupAttendanceTable';
import AttendanceTabs from './SubTabs/AttendanceTabs';

type Props = {
    classroomCode: string;
    studentId?: string;
    studentName: string;
};

const StudentAttendanceTab: React.FC<Props> = ({ classroomCode, studentId, studentName }) => {
    const today = new Date();
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<string>(
        `${selectedYear}-${String(today.getMonth() + 1).padStart(2, '0')}`
    );

    const months: string[] = [...Array(12)].map((_, i) => {
        const month = i + 1;
        return `${selectedYear}-${String(month).padStart(2, '0')}`;
    });

    const handlePrevYear = () => {
        const newYear = selectedYear - 1;
        setSelectedYear(newYear);
        setSelectedMonth(`${newYear}-01`);
    };

    const handleNextYear = () => {
        const newYear = selectedYear + 1;
        setSelectedYear(newYear);
        setSelectedMonth(`${newYear}-01`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-center mb-4 space-x-4">
                <button onClick={handlePrevYear} className="px-3 py-1 border rounded hover:bg-gray-100">
                    &lt;
                </button>
                <span className="text-lg font-semibold">{selectedYear}年</span>
                <button onClick={handleNextYear} className="px-3 py-1 border rounded hover:bg-gray-100">
                    &gt;
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {months.map((month) => (
                    <button
                        key={month}
                        className={`px-4 py-2 rounded-full text-sm font-medium border ${selectedMonth === month
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                            }`}
                        onClick={() => setSelectedMonth(month)}
                    >
                        {parseInt(month.split('-')[1], 10)}月
                    </button>
                ))}
            </div>

            <MakeupAttendanceTable
                studentId={studentId}
                classroomCode={classroomCode}
                studentName={studentName}
            />

            {studentId && (
                <AttendanceTabs
                    classroomCode={classroomCode}
                    studentId={studentId}
                    studentName={studentName}
                    selectedMonth={selectedMonth}
                    mode="regular"
                />
            )}
        </div>
    );
};

export default StudentAttendanceTab;
