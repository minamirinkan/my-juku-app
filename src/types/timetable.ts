import { Student } from './student'; // すでにあるStudent型を再利用
import { Teacher } from './teacher';
import { RowData } from './timetablerow';

export type AttendanceRowData = {
  teacher: string | null;
  status: string;
  periods: Record<string, Student[]>;
};

export type DuplicateInfo = {
    studentId: string;
    period: number;
  };

  
  export type TimetableRowProps = {
    rowIndex: number;
    row: RowData;
    onChange: (index: number, updatedRow: RowData) => void;
    allTeachers: Teacher[];
    allRows: RowData[];
  };