import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate } from '@/utils/dateFormatter';
import { MakeupLesson } from '@/types/makeupLessons';
import { Teacher } from '@/types/teacher';

type Props = {
    classroomCode: string;
    studentId: string;
    studentName: string;
    selectedMonth: string;
    data: MakeupLesson[];
    teachers: Teacher[];
    editingIndex: number | null;
    editValues: Partial<MakeupLesson> | null;
    handleEditClick: (idx: number) => void;
    handleChange: (field: keyof MakeupLesson | string, value: any) => void;
    handleSaveClick: () => void;
    setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>
    getStatusClass: (status: string) => string;
    periodLabels: { label: string }[];
    mode: 'regular' | 'seasonal';
};

const statusOptions = ['予定', '未定', '振替', '欠席', '出席'];
const weekdayOptions = ['日', '月', '火', '水', '木', '金', '土'];
const periodOptions = ['1限', '2限', '3限', '4限', '5限', '6限', '7限', '8限'];
const subjectOptions = ['英語', '数学', '国語', '理科', '社会'];

const AttendanceSubTable: React.FC<Props> = ({
    classroomCode,
    studentId,
    studentName,
    selectedMonth,
    data = [], // ← デフォルト値で undefined 対策
    teachers,
    editingIndex,
    editValues,
    handleEditClick,
    handleChange,
    handleSaveClick,
    setEditingIndex,
    getStatusClass,
    mode,
}) => {

    return (
        <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border px-2 py-1">出席状況</th>
                    <th className="border px-2 py-1">日付</th>
                    <th className="border px-2 py-1">曜日</th>
                    <th className="border px-2 py-1">時限</th>
                    <th className="border px-2 py-1">科目</th>
                    <th className="border px-2 py-1">講師</th>
                    <th className="border px-2 py-1">備考</th>
                    <th className="border px-2 py-1">授業種別</th>
                    <th className="border px-2 py-1">操作</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((entry, idx) => {
                        const todayStr = new Date().toISOString().split('T')[0];
                        const isToday = entry.date === todayStr;
                        const teacherName =
                            typeof entry.teacher === 'object' && entry.teacher !== null
                                ? entry.teacher.name
                                : entry.teacher;
                        const isEditing = editingIndex === idx;

                        return (
                            <tr
                                key={idx}
                                className={`text-center ${getStatusClass(entry.status ?? "")} ${isToday ? 'border-2 border-yellow-500' : ''}`}
                            >
                                <td className="border px-2 py-1">
                                    {isEditing ? (
                                        <select
                                            value={editValues?.status || ''}
                                            onChange={(e) => handleChange('status', e.target.value)}
                                        >
                                            {statusOptions.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        entry.status || '－'
                                    )}
                                </td>
                                <td className="border px-2 py-1">
                                    {isEditing ? (
                                        <DatePicker
                                            selected={editValues?.date ? new Date(editValues.date) : null}
                                            onChange={(date) =>
                                                handleChange('date', date?.toISOString().split('T')[0])
                                            }
                                            dateFormat="yyyy-MM-dd"
                                            className="border px-2 py-1 rounded"
                                        />
                                    ) : (
                                        formatDate(entry.date)
                                    )}
                                </td>
                                <td className="border px-2 py-1">
                                    {isEditing ? (
                                        editValues?.date
                                            ? weekdayOptions[new Date(editValues?.date).getDay()]
                                            : '－'
                                    ) : (
                                        entry.date
                                            ? weekdayOptions[new Date(entry.date).getDay()]
                                            : '－'
                                    )}
                                </td>
                                <td className="border px-2 py-1">
                                    {isEditing ? (
                                        <select
                                            value={editValues?.periodLabel || (periodOptions[entry.period ? entry.period - 1 : 0] || '－')}
                                            onChange={(e) => handleChange('periodLabel', e.target.value)}
                                        >
                                            {periodOptions.map((p) => (
                                                <option key={p} value={p}>
                                                    {p}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        editValues?.periodLabel || (periodOptions[entry.period ? entry.period - 1 : 0] || '－')
                                    )}
                                </td>
                                <td className="border px-2 py-1">
                                    {isEditing ? (
                                        <select
                                            value={editValues?.subject || ''}
                                            onChange={(e) => handleChange('subject', e.target.value)}
                                        >
                                            {subjectOptions.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        entry.subject || '－'
                                    )}
                                </td>
                                <td className="border px-2 py-1">
                                    {isEditing ? (
                                        <select
                                            value={editValues?.teacherCode || ''}
                                            onChange={(e) => handleChange('teacherCode', e.target.value)}
                                        >
                                            <option value="">－</option>
                                            {teachers &&
                                                teachers.map((t) => (
                                                    <option key={t.code} value={t.code}>
                                                        {t.lastName} {t.firstName}
                                                    </option>
                                                ))}
                                        </select>
                                    ) : (
                                        teacherName || '－'
                                    )}
                                </td>
                                <td className="border px-2 py-1">－</td>
                                <td className="border px-2 py-1">－</td>
                                <td className="border px-2 py-1">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSaveClick}
                                                className="px-2 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                                            >
                                                保存
                                            </button>
                                            <button
                                                onClick={() => setEditingIndex(null)}
                                                className="ml-2 px-2 py-1 text-sm text-white bg-gray-500 rounded hover:bg-gray-600"
                                            >
                                                キャンセル
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleEditClick(idx)}
                                            className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                                        >
                                            編集
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan={8} className="text-center text-gray-500 py-2">
                            データがありません
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default AttendanceSubTable;
