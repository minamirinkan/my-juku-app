import { collection, query, where, onSnapshot, getDocs, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import shortGrade from '../../common/timetable/utils/shortGrade';

const gradeOrder = [
    '小1', '小2', '小3', '小4', '小5', '小6',
    '中1', '中2', '中3',
    '高1', '高2', '高3', '既卒'
];

export default function useFilteredStudents(searchKeyword, gradeFilter, classroomCode) {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        if (!classroomCode) return;

        const q = query(
            collection(db, 'students'),
            where('classroomCode', '==', classroomCode)
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const fetched = await Promise.all(snapshot.docs.map(async (docSnap) => {
                const student = { id: docSnap.id, ...docSnap.data() };

                // 🔽 coursesサブコレクションを取得
                const courseSnap = await getDocs(collection(db, 'students', docSnap.id, 'courses'));

                // kind === '通常' のコースを1つだけ取得（なければ null）
                const courseData = courseSnap.docs
                    .map(doc => doc.data())
                    .find(course => course.kind === '通常');

                if (courseData) {
                    student.classType = courseData.classType || '';
                    student.duration = courseData.duration || '';
                    student.subject = courseData.subject || '';
                }

                return student;
            }));

            setStudents(fetched);
        });

        return () => unsubscribe();
    }, [classroomCode]);

    const filteredStudents = students.filter((s) => {
        const name = `${s.lastName} ${s.firstName}`;
        const short = shortGrade(s.grade);
        return (
            name.includes(searchKeyword) &&
            (gradeFilter === '' || short === gradeFilter)
        );
    });

    const existingGrades = gradeOrder.filter((g) =>
        students.some((s) => shortGrade(s.grade) === g)
    );

    return { filteredStudents, existingGrades };
}
