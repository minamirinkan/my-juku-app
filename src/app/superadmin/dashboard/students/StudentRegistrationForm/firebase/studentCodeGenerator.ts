// src/components/StudentRegistrationForm/studentCodeGenerator.ts
import { getFirestore, collection, query, where, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export const generateStudentCode = async (classroomCode: string): Promise<string> => {
    if (!classroomCode) throw new Error('classroomCode is required');
    const db = getFirestore();

    const prefix = `s${classroomCode}`;
    const q = query(
        collection(db, 'students'),
        where('studentId', '>=', prefix),
        where('studentId', '<', `${prefix}z`)
    );

    const snapshot = await getDocs(q);
    // Firestoreのドキュメントデータの型はDocumentData
    const existingCodes = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        return data.studentId as string;
    });

    let maxNumber = 0;
    existingCodes.forEach(code => {
        // prefixの長さ分を切り取る
        const numberPart = code.slice(prefix.length);
        const num = parseInt(numberPart, 10);
        if (!isNaN(num) && num > maxNumber) maxNumber = num;
    });

    const nextNumber = (maxNumber + 1).toString().padStart(4, '0');
    return `${prefix}${nextNumber}`;
};
