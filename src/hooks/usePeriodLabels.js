// src/hooks/usePeriodLabels.js

import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

/**
 * Firestore から periodLabels を取得する汎用関数（内部ロジック用）
 * @param {object} db - Firestore DB instance
 * @param {string} classroomCode - 教室コード
 * @returns {Promise<Array>} periodLabels 配列
 */
export const fetchPeriodLabels = async (db, classroomCode) => {
    if (!classroomCode) return [];

    // 優先：教室別設定
    const schoolDocRef = doc(db, 'periodLabelsBySchool', classroomCode);
    const schoolSnap = await getDoc(schoolDocRef);
    if (schoolSnap.exists()) {
        return schoolSnap.data().periodLabels || [];
    }

    // フォールバック：共通設定
    const commonDocRef = doc(db, 'common', 'periodLabels');
    const commonSnap = await getDoc(commonDocRef);
    if (commonSnap.exists()) {
        return commonSnap.data().periodLabels || [];
    }

    return [];
};

/**
 * React用カスタムフック（UIから使う場合）
 * @param {string} classroomCode - 教室コード
 * @returns {{ periodLabels: Array, loading: boolean }}
 */
const usePeriodLabels = (classroomCode) => {
    const [periodLabels, setPeriodLabels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const db = getFirestore();
                const labels = await fetchPeriodLabels(db, classroomCode);
                setPeriodLabels(labels);
            } catch (error) {
                console.error('periodLabels の取得に失敗しました:', error);
                setPeriodLabels([]);
            } finally {
                setLoading(false);
            }
        };

        if (classroomCode) fetch();
    }, [classroomCode]);

    return { periodLabels, loading };
};

export default usePeriodLabels;
