// src/hooks/usePeriodLabelsByStudentId.js
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { fetchPeriodLabels } from './usePeriodLabels'; // 既存の関数を再利用

const usePeriodLabelsByStudentId = (studentId) => {
    const [periodLabels, setPeriodLabels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!studentId) return;

            setLoading(true);
            try {
                const db = getFirestore();
                const studentDoc = await getDoc(doc(db, 'students', studentId));
                const classroomCode = studentDoc.exists() ? studentDoc.data().classroomCode : null;
                const labels = await fetchPeriodLabels(db, classroomCode);
                setPeriodLabels(labels);
            } catch (error) {
                console.error('periodLabels の取得に失敗しました:', error);
                setPeriodLabels([]);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [studentId]);

    return { periodLabels, loading };
};

export default usePeriodLabelsByStudentId;
