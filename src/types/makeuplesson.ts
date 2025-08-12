export interface MakeupLessonStudent {
    studentId: string;
    grade: string;
    name: string;
    seat: string;
    subject: string;
    classType: string;
    duration?: string;
    period?: number;
    status: '振替';
  }
  
  export interface LessonStudent {
    studentId: string;
    grade: string;
    name: string;
    seat: string;
    subject: string;
    classType: string;
    duration?: string;
    period?: number;
    status: string;
  }
  export type PeriodKey = `period${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;
  export interface MakeupLessonRow {
    teacher: string | null;
    periods: Partial<Record<PeriodKey, MakeupLessonStudent[]>>;
    status: '振替';
  }

  export interface LessonData {
    studentId?: string;
    grade?: string;
    name?: string;
    seat?: string;
    subject?: string;
    classType?: string;
    duration?: string;
    period: number;
  }