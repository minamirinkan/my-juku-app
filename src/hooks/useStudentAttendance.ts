'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot, Firestore } from 'firebase/firestore';
import { getJapaneseDayOfWeek } from '@/utils/dateFormatter';
import { fetchPeriodLabels } from '@/hooks/usePeriodLabels';
import { useWeeklySchedules } from '@/hooks/useWeeklySchedules';

type AttendanceEntry = {
    date: string;
    weekday: string;
    periodLabel: string;
    time: string;
    subject: string;
    grade: string;
    seat: string;
    teacher: string | null;
    status: string;
    classType: string;
    duration: string;
    classroomCode: string;
    studentId: string;
};

export const useStudentAttendance = (
    db: Firestore,
    classroomCode: string,
    studentId: string,
    selectedMonth: string
) => {
    const [loading, setLoading] = useState < boolean > (true);
    const [attendanceList, setAttendanceList] = useState < AttendanceEntry[] > ([]);

    useEffect(() => {
        if (!classroomCode || !studentId || !selectedMonth) return;

        let unsubscribeList: (() => void)[] = [];

        const fetchAndSubscribe = async () => {
            setLoading(true);
            setAttendanceList([]);

            try {
                const periodLabels = await fetchPeriodLabels(db, classroomCode);
                const [selectedYear, selectedMonthNum] = selectedMonth.split('-').map(Number);
                const monthStart = new Date(selectedYear, selectedMonthNum - 1, 1);
                const monthEnd = new Date(selectedYear, selectedMonthNum, 0);

                const weeklySchedulesCache = new Map < number, any> ();
                for (let weekday = 0; weekday <= 6; weekday++) {
                    const data = await useWeeklySchedules(db, classroomCode, selectedMonth, weekday);
                    if (data) {
                        weeklySchedulesCache.set(weekday, data);
                    }
                }

                for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
                    const yyyy = d.getFullYear();
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const dd = String(d.getDate()).padStart(2, '0');
                    const weekdayIndex = d.getDay();
                    const yyyyMMdd = `${yyyy}-${mm}-${dd}`;
                    const dailyDocId = `${classroomCode}_${yyyy}-${mm}-${dd}_${weekdayIndex}`;
                    const dailyDocRef = doc(db, 'dailySchedules', dailyDocId);

                    const unsubscribe = onSnapshot(
                        dailyDocRef,
                        (docSnap) => {
                            let data;
                            if (docSnap.exists()) {
                                data = docSnap.data();
                            } else if (weeklySchedulesCache.has(weekdayIndex)) {
                                data = weeklySchedulesCache.get(weekdayIndex);
                            } else {
                                setAttendanceList(prev =>
                                    prev.filter(entry =>
                                        entry.date !== yyyyMMdd && entry.date.startsWith(selectedMonth)
                                    )
                                );
                                return;
                            }

                            const rows = data.rows || [];
                            const newResults: AttendanceEntry[] = [];

                            rows.forEach((row: any) => {
                                const periods = row.periods || {};
                                periodLabels.forEach((periodLabel: any, i: number) => {
                                    const key = `period${i + 1}`;
                                    const students = periods[key] || [];

                                    students.forEach((student: any) => {
                                        if (student.studentId?.trim().toLowerCase() === studentId.trim().toLowerCase()) {
                                            newResults.push({
                                                date: yyyyMMdd,
                                                weekday: getJapaneseDayOfWeek(yyyyMMdd),
                                                periodLabel: periodLabel.label,
                                                time: periodLabel.time,
                                                subject: student.subject || '－',
                                                grade: student.grade || '',
                                                seat: student.seat || '',
                                                teacher: row.teacher || null,
                                                status: student.status || '－',
                                                classType: student.classType || '',
                                                duration: student.duration || '',
                                                classroomCode,
                                                studentId: student.studentId,
                                            });
                                        }
                                    });
                                });
                            });

                            setAttendanceList(prev => {
                                const filtered = prev.filter(
                                    entry => entry.date !== yyyyMMdd && entry.date.startsWith(selectedMonth)
                                );
                                return [...filtered, ...newResults].sort((a, b) => a.date.localeCompare(b.date));
                            });
                        },
                        (error) => {
                            console.error(`Error fetching ${yyyyMMdd}:`, error);
                        }
                    );

                    unsubscribeList.push(unsubscribe);
                }
            } catch (error) {
                console.error(error);
                setAttendanceList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAndSubscribe();

        return () => {
            unsubscribeList.forEach(unsub => unsub());
        };
    }, [db, classroomCode, studentId, selectedMonth]);

    return { loading, attendanceList, setAttendanceList };
};
