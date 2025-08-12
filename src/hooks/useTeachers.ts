// src/hooks/useTeachers.ts
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Teacher } from '../types/teacher';

export default function useTeachers(classroomCode?: string) {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true);
            try {
                let q: Query = collection(db, 'teachers');
                if (classroomCode) {
                    q = query(q, where('classroomCode', '==', classroomCode), where('status', '==', '在職中'));
                }
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data(),
                })) as Teacher[];
                setTeachers(data);
            } catch (err) {
                console.error('Error fetching teachers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, [classroomCode]);

    return { teachers, loading };
}
