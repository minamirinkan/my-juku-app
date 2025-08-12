export type WeeklyPeriodData = {
  grade: string;
  name: string;
  seat: string;
  status: string;
  studentId: string;
  subject: string;
};

export type WeeklyScheduleRow = {
  periods: {
    period1?: WeeklyPeriodData[];
    period2?: WeeklyPeriodData[];
    period3?: WeeklyPeriodData[];
    period4?: WeeklyPeriodData[];
    period5?: WeeklyPeriodData[];
    period6?: WeeklyPeriodData[];
    period7?: WeeklyPeriodData[];
    period8?: WeeklyPeriodData[];
  };
};

export type WeeklyScheduleDocument = {
  id: string;
  rows: WeeklyScheduleRow[];
};
