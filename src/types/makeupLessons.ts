import { Teacher } from '@contexts/types/teacher';

export type MakeupLesson = {
    date?: string | null;
    grade?: string;
    name?: string;
    period?: number;
    seat?: string;
    status?: string;
    studentId?: string;
    subject?: string;
    classType?: string;
    duration?: string;
    teacher?: Teacher | string;
    periodLabel?: string;
    teacherCode?: string;
    // 必要に応じてフィールド追加してください
};
