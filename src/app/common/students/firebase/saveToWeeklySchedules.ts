import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Student } from '@/types/student';
import { CourseFormData } from '@/types/course';

// 🔧 再帰的に undefined を除外するユーティリティ関数
function removeUndefinedDeep(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedDeep);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefinedDeep(v)])
    );
  }
  return obj;
}

export const saveToWeeklySchedules = async (studentData: Student) => {
  const {
    fullname,
    studentId,
    grade,
    classroomCode,
    courseFormData,
  } = studentData;

  const cleanedCourseFormData = courseFormData.map((course: CourseFormData) => {
    const { subjectOther, ...rest } = course;
    return {
      ...rest,
      ...(course.subject === 'その他' && subjectOther ? { subject: subjectOther } : {}),
    };
  });

  const normalCourses = cleanedCourseFormData.filter(
    (course: CourseFormData) => course.kind === '通常'
  );

  for (const course of normalCourses) {
    const {
      subject,
      weekday,
      period: rawPeriod,
      classType,
      duration,
      startYear,
      startMonth
    } = course;

    const currentMonth = `${startYear}-${String(startMonth).padStart(2, '0')}`;
    const weekdayMap: { [key: string]: number } = { '日': 0, '月': 1, '火': 2, '水': 3, '木': 4, '金': 5, '土': 6 };
    const dayOfWeekNum = weekdayMap[weekday];
    if (dayOfWeekNum === undefined) {
      console.warn(`曜日の変換に失敗しました: ${weekday}`);
      continue;
    }

    const periodNumber = String(rawPeriod).replace('限', '');
    const periodKey = `period${periodNumber}`;
    const docId = `${classroomCode}_${currentMonth}_${dayOfWeekNum}`;
    const docRef = doc(db, 'weeklySchedules', docId);
    const docSnap = await getDoc(docRef);

    const newEntryRaw = {
      name: fullname,
      studentId,
      subject,
      grade,
      seat: '',
      status: '未定',
      classType,
      duration
    };

    const newEntry = Object.fromEntries(
      Object.entries(newEntryRaw).filter(([_, v]) => v !== undefined && v !== '')
    );

    let rows;

    if (docSnap.exists()) {
      rows = docSnap.data().rows || [];

      const targetIndex = rows.findIndex(
        (row: any) => row.status === '未定' && row.teacher === null
      );

      if (targetIndex !== -1) {
        const targetRow = rows[targetIndex];
        if (!targetRow.periods[periodKey]) {
          targetRow.periods[periodKey] = [];
        }
        targetRow.periods[periodKey].push(newEntry);
        rows[targetIndex] = targetRow;
      } else {
        rows.push({
          status: '未定',
          teacher: null,
          periods: {
            [periodKey]: [newEntry]
          }
        });
      }

      console.log('📝 updateDoc rows:', rows);
      await updateDoc(docRef, removeUndefinedDeep({
        rows,
        updatedAt: serverTimestamp()
      }));

    } else {
      let copied = false;
      for (let i = 1; i <= 3; i++) {
        const prevDate = new Date(`${currentMonth}-01`);
        prevDate.setMonth(prevDate.getMonth() - i);
        const prevMonth = prevDate.toISOString().slice(0, 7);
        const prevDocId = `${classroomCode}_${prevMonth}_${dayOfWeekNum}`;
        const prevDocRef = doc(db, 'weeklySchedules', prevDocId);
        const prevDocSnap = await getDoc(prevDocRef);

        if (prevDocSnap.exists()) {
          const prevData = prevDocSnap.data();
          const clonedRows = JSON.parse(JSON.stringify(prevData.rows || []));

          const targetIndex = clonedRows.findIndex(
            (row: any) => row.status === '未定' && row.teacher === null
          );

          if (targetIndex !== -1) {
            const targetRow = clonedRows[targetIndex];
            if (!targetRow.periods[periodKey]) {
              targetRow.periods[periodKey] = [];
            }
            targetRow.periods[periodKey].push(newEntry);
            clonedRows[targetIndex] = targetRow;
          } else {
            clonedRows.push({
              status: '未定',
              teacher: null,
              periods: {
                [periodKey]: [newEntry]
              }
            });
          }

          console.log('📝 setDoc clonedRows:', clonedRows);
          await setDoc(docRef, removeUndefinedDeep({
            rows: clonedRows,
            updatedAt: serverTimestamp()
          }));

          copied = true;
          break;
        }
      }

      if (!copied) {
        const initialRows = [{
          status: '未定',
          teacher: null,
          periods: {
            [periodKey]: [newEntry]
          }
        }];
        console.log('📝 setDoc new:', initialRows);
        await setDoc(docRef, removeUndefinedDeep({
          rows: initialRows,
          updatedAt: serverTimestamp()
        }));
      }
    }
  }
};
