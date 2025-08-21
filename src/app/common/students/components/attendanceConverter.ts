// src/utils/attendanceHelpers.ts

export type AttendanceEntry = {
    date: string;
    periodLabel: string;
    status?: string;
    teacher?: string | null;
    studentId: string;
    name?: string;
    grade?: string;
    seat?: string;
    subject?: string;
};

export type PeriodKey =
    | 'period1' | 'period2' | 'period3' | 'period4'
    | 'period5' | 'period6' | 'period7' | 'period8';

export type Periods = {
    [key in PeriodKey]: {
        studentId: string;
        name: string;
        grade: string;
        seat: string;
        subject: string;
        status: string;
    }[];
};

export type Row = {
    status: string;
    teacher: string | null;
    periods: Periods;
};

export function convertToPeriodKey(label: string): PeriodKey {
    const match = label.match(/(\d)/);
    return (match ? (`period${match[1]}`) : 'period1') as PeriodKey;
}

export function convertAttendanceListToRows(attendanceList: AttendanceEntry[]): Row[] {
    const rowMap: { [key: number]: Row } = {};

    attendanceList.forEach(entry => {
        const date = entry.date;
        const weekdayIndex = new Date(date).getDay(); // 0〜6（日曜〜土曜）
        const periodKey = convertToPeriodKey(entry.periodLabel);

        if (!rowMap[weekdayIndex]) {
            rowMap[weekdayIndex] = {
                status: entry.status || '未定',
                teacher: entry.teacher || null,
                periods: {
                    period1: [],
                    period2: [],
                    period3: [],
                    period4: [],
                    period5: [],
                    period6: [],
                    period7: [],
                    period8: [],
                },
            };
        }

        rowMap[weekdayIndex].periods[periodKey].push({
            studentId: entry.studentId,
            name: entry.name || '',
            grade: entry.grade || '',
            seat: entry.seat || '',
            subject: entry.subject || '',
            status: entry.status || '',
        });
    });

    const rows: Row[] = [];
    for (let i = 0; i <= 6; i++) {
        rows[i] = rowMap[i] || {
            status: '未定',
            teacher: null,
            periods: {
                period1: [],
                period2: [],
                period3: [],
                period4: [],
                period5: [],
                period6: [],
                period7: [],
                period8: [],
            },
        };
    }

    return rows;
}
