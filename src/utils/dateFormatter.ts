// src/utils/dateFormatter.ts

import type { Timestamp } from 'firebase/firestore'; // もしFirestoreのTimestamp型を使っていれば

// formatDate の input は、Firestore Timestamp、Date、string、number のどれか
export const formatDate = (
    input: Timestamp | Date | string | number | null | undefined
): string => {
    if (!input) return '－';

    let date: Date;

    try {
        if (typeof (input as Timestamp)?.toDate === 'function') {
            // Firestore Timestamp
            date = (input as Timestamp).toDate();
        } else if (input instanceof Date) {
            date = input;
        } else if (typeof input === 'string') {
            date = new Date(input.replace(/-/g, '/')); // Safari対応
        } else if (typeof input === 'number') {
            date = new Date(input);
        } else {
            return '－';
        }

        if (isNaN(date.getTime())) return '－';

        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    } catch {
        return '－';
    }
};

// 曜日を返す関数
export const getJapaneseDayOfWeek = (
    input: Timestamp | Date | string | number | null | undefined
): string => {
    if (!input) return '';

    let date: Date;

    try {
        if (typeof (input as Timestamp)?.toDate === 'function') {
            date = (input as Timestamp).toDate();
        } else if (input instanceof Date) {
            date = input;
        } else if (typeof input === 'string') {
            date = new Date(input.replace(/-/g, '/'));
        } else if (typeof input === 'number') {
            date = new Date(input);
        } else {
            return '';
        }

        if (isNaN(date.getTime())) return '';

        const days = ['日', '月', '火', '水', '木', '金', '土'];
        return days[date.getDay()];
    } catch {
        return '';
    }
};

// yyyy-MM-dd 形式の文字列から曜日番号を返す関数
export const getDayOfWeekFromYyyyMmDd = (dateStr: string): number => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getDay(); // 0=日曜, 1=月曜...
};
