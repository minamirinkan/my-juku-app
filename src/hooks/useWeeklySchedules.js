// src/hooks/useWeeklySchedules.js
import { doc, getDoc } from 'firebase/firestore';

export const getLatestExistingWeeklySchedule = async (db, classroomCode, selectedMonth, weekday) => {
    // 1. 選択された月のドキュメントをまず取得してみる
    const currentDocId = `${classroomCode}_${selectedMonth}_${weekday}`;
    const currentDocRef = doc(db, 'weeklySchedules', currentDocId);
    const currentSnap = await getDoc(currentDocRef);

    if (currentSnap.exists()) {
        return currentSnap.data();
    }

    // 2. なければ、過去にさかのぼって探す処理（最大3ヶ月までさかのぼる例）
    const [year, month] = selectedMonth.split('-').map(Number);
    let current = new Date(year, month - 1, 1);

    for (let i = 0; i < 3; i++) {
        current.setMonth(current.getMonth() - 1);
        const yyyymm = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
        const docId = `${classroomCode}_${yyyymm}_${weekday}`;
        const docRef = doc(db, 'weeklySchedules', docId);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
            return snap.data();
        }
    }

    // 3. フォールバック（旧形式）ドキュメントを探す
    const legacyDocId = `${classroomCode}_${weekday}`;
    const legacySnap = await getDoc(doc(db, 'weeklySchedules', legacyDocId));
    if (legacySnap.exists()) {
        return legacySnap.data();
    }

    return null;
};
