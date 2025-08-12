// utils/filterStudents.ts
import { Student } from '@/types/student';

export const filterStudents = (students: Student[], searchTerm: string): Student[] => {
    return students.filter(student =>
        `${student.lastName}${student.firstName}`.includes(searchTerm) ||
        student.studentId?.includes(searchTerm)
    );
};
