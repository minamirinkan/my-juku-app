export type PeriodData = {
  classType: string;
  duration: string;
  grade: string;
  name: string;
  seat: string;
  status: string;
  studentId: string;
  subject: string;
};

export type TeacherData = {
  code: string;
  name: string;
} | null;

export type DailyScheduleRow = {
  periods: {
    period1?: PeriodData[];
    period2?: PeriodData[];
    period3?: PeriodData[];
    period4?: PeriodData[];
    period5?: PeriodData[];
    period6?: PeriodData[];
    period7?: PeriodData[];
    period8?: PeriodData[];
  };
  status: string;
  teacher: TeacherData;
};

export type DailyScheduleDocument = {
  id: string; // ドキュメントID
  rows: DailyScheduleRow[];
  updatedAt?: any; // Firestore Timestamp
};
