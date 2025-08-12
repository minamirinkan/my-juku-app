export interface CourseFormData {
    subject: string;
    subjectOther?: string;
    kind: '通常' | '振替' | string;
    weekday: string; // 例: '月', '火' など
    period: string;  // 例: '1限', '2限' など
    classType: string;
    duration: string;
    startYear: number;
    startMonth: number;
  }
  