import { Student } from './student'; // すでにあるStudent型を再利用
import { Teacher } from './teacher';
import { RowStudent } from './student';

export type RowData = {
  teacher: { code: string; name: string } | null;
  status: string;
  periods: (Student | RowStudent)[][];
};

export type TimetableRowProps = {
    rowIndex: number;
    row: RowData;
    onChange: (index: number, updatedRow: RowData) => void;
    allTeachers: Teacher[];
    allRows: RowData[];
  };

  export type TimetableCellProps = {
    periodIdx: number;
    students: Student[];
    rowIndex: number;
    row: RowData;
    allRows: RowData[];
    onChange: (rowIndex: number, updatedRow: RowData) => void;
  };