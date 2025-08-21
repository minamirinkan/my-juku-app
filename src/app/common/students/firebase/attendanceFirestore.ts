'use client'
// src/utils/firebase/attendanceFirestore.ts
import { doc, getDoc, setDoc, getFirestore, serverTimestamp, DocumentData } from 'firebase/firestore';
import { PeriodLabel, DailySchedule } from '@/types/types';

export const buildWeeklyDocId = (classroomCode: string, date: string | Date): string => {
    const d = new Date(date);
    const weekday = d.getDay();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${classroomCode}_${year}-${month}_${weekday}`;
};

export const buildDailyDocId = (classroomCode: string, dateStr: string | Date): string => {
    const d = new Date(dateStr);
    const weekday = d.getDay();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${classroomCode}_${yyyy}-${mm}-${dd}_${weekday}`;
};

export const getPeriodKey = (periodLabels: PeriodLabel[], label: string): string => {
    console.log('label:', label);
    const index = periodLabels.findIndex(p => p.label === label);
    if (index === -1) {
        console.warn('⚠️ 無効な periodLabel:', label);
        return '';
    }
    return `period${index + 1}`;
};

export async function fetchScheduleDoc(collection: string, docId: string): Promise<DocumentData | null> {
    const db = getFirestore();
    const docRef = doc(db, collection, docId);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
}

export async function createScheduleFromWeeklyTemplate(
    collection: string,
    docId: string,
    weeklyRefId: string,
    initialData: DailySchedule,
): Promise<DocumentData | null> {
    const db = getFirestore();
    const docRef = doc(db, collection, docId);
    await setDoc(docRef, {
        ...initialData,
        createdFromWeeklyTemplate: weeklyRefId,
        updatedAt: serverTimestamp(),
    }, { merge: true });
    return await fetchScheduleDoc(collection, docId);
}

export async function saveScheduleDoc(collection: string, docId: string, data: DailySchedule): Promise<void> {
    const db = getFirestore();
    const docRef = doc(db, collection, docId);
    console.log("📝 保存前のデータ:", data);
    await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    }, { merge: false });
    console.log("Saved doc:", docRef.path, data);
}

export type LessonData = {
    student: {
        grade?: string;
        name?: string;
        seat?: string;
        studentId?: string;
        subject?: string;
        classType?: string;
        duration?: string;
    };
    periodKey: string;
    status?: string;
};

export async function saveMakeupLesson(studentId: string, docId: string, lessonData: LessonData): Promise<void> {
    const db = getFirestore();
    const docRef = doc(db, 'students', studentId, 'makeupLessons', docId);

    const docSnap = await getDoc(docRef);
    let existingLessons: LessonData[] = [];

    if (docSnap.exists()) {
        const data = docSnap.data();
        existingLessons = data.lessons || [];
    }

    console.log('🧪 lessonData:', lessonData);

    const lesson = {
        grade: lessonData.student.grade || '',
        name: lessonData.student.name || '',
        period: parseInt(lessonData.periodKey.replace('period', ''), 10),
        seat: lessonData.student.seat || '',
        status: lessonData.status || '',
        studentId: lessonData.student.studentId || '',
        subject: lessonData.student.subject || '',
        classType: lessonData.student.classType || '',
        duration: lessonData.student.duration || '',
    };

    const updatedLessons = [...existingLessons, lesson];

    await setDoc(docRef, {
        lessons: updatedLessons,
    }, { merge: true });
}

export async function fetchMakeupLessonDoc(studentId: string, docId: string): Promise<DocumentData | null> {
    const db = getFirestore();
    const docRef = doc(db, 'students', studentId, 'makeupLessons', docId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
}
