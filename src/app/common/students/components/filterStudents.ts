// utils/filterStudents.ts
import { Student } from '@/types/types';

export const filterStudents = (students: Student[], searchTerm: string): Student[] => {
    return students.filter(student =>
        `${student.fullname}`.includes(searchTerm) ||
        student.studentId?.includes(searchTerm)
    );
};
