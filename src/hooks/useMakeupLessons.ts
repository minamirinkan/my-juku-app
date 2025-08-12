import { useEffect, useState } from 'react';
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MakeupLesson } from '@/types/makeupLessons';

const useMakeupLessons = (studentId: string | null | undefined) => {
    const [makeupLessons, setMakeupLessons] = useState<MakeupLesson[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!studentId) {
            setLoading(false);
            setMakeupLessons([]);
            return;
        }

        const colRef = collection(db, 'students', studentId, 'makeupLessons');

        setLoading(true);
        const unsubscribe = onSnapshot(
            colRef,
            (snapshot) => {
                const allLessons: MakeupLesson[] = [];

                snapshot.forEach((doc) => {
                    const rawId = doc.id;
                    const parts = rawId.split('_'); // ex: ["024", "2025-07-22", "2"]
                    const date = parts.length >= 3 ? parts[1] : null; // 日付抽出
                    const data = doc.data() as DocumentData;

                    if (Array.isArray(data.lessons)) {
                        data.lessons.forEach((lesson: MakeupLesson) => {
                            allLessons.push({ ...lesson, date });
                        });
                    }
                });

                setMakeupLessons(allLessons);
                setLoading(false);
            },
            (error) => {
                console.error('🔥 onSnapshot error:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [studentId]);

    return { makeupLessons, loading };
};

export default useMakeupLessons;
