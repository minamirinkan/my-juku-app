// types/schoolData.ts
export type SchoolDataItem = {
  kind: string;
  subject: string;
  subjectOther?: string;
  classType: string;
  times: string;
  duration: string;
  startMonth: string;
  endMonth: string;
  startYear: string;
  endYear: string;
  note: string;
  weekday?: string;
  period?: string;
};

export type SchoolLevel = '小学校' | '中学校' | '高等学校' | '通信制';