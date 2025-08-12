import { doc, getDoc } from 'firebase/firestore';

export const fetchLatestWeeklySchedule = async (db, classroomCode, selectedMonth, weekday) => {
    // 1. 指定月のドキュメントを探す
    const currentDocId = `${classroomCode}_${selectedMonth}_${weekday}`;
    const currentDocRef = doc(db, 'weeklySchedules', currentDocId);
    const currentSnap = await getDoc(currentDocRef);

    if (currentSnap.exists()) {
        return currentSnap.data();
    }

    // 2. 過去最大3ヶ月さかのぼる
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

    // 3. 旧形式ドキュメント
    const legacyDocId = `${classroomCode}_${weekday}`;
    const legacySnap = await getDoc(doc(db, 'weeklySchedules', legacyDocId));
    if (legacySnap.exists()) {
        return legacySnap.data();
    }

    return null;
};
