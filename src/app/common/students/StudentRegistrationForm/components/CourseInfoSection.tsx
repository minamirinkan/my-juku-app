import React from 'react';
import SUBJECT_OPTIONS from '../subjectOptions';
import { SchoolDataItem } from '../../../../contexts/types/schoolData'; // 実際の型定義のパスに合わせて
import { SchoolLevel } from '../../../../contexts/types/schoolData';
interface CourseInfoSectionProps {
    formData: SchoolDataItem[];
    onChange: (newData: SchoolDataItem[]) => void;
    lessonType: string;
    schoolLevel: string | undefined;
    setLessonType: React.Dispatch<React.SetStateAction<'regular' | 'nonRegular'>>;
}

const CourseInfoSection: React.FC<CourseInfoSectionProps> = ({
    formData = [],
    onChange,
    lessonType,
    schoolLevel,
    setLessonType,
}) => {
    const subjects =
        schoolLevel && SUBJECT_OPTIONS[schoolLevel as SchoolLevel]
            ? [...SUBJECT_OPTIONS[schoolLevel as SchoolLevel], 'その他']
            : [];


    console.log('schoolLevel:', schoolLevel);
    console.log('subjects:', subjects);


    const handleChange = (index: number, updatedFields: Partial<SchoolDataItem>) => {
        const newData = [...formData];
        newData[index] = { ...newData[index], ...updatedFields };
        onChange(newData);
    };

    const createEmptyRow = (kind = ''): SchoolDataItem => ({
        kind,
        classType: '',
        times: '',
        subject: '',
        subjectOther: '',
        duration: '',
        startYear: '',
        startMonth: '',
        endYear: '',
        endMonth: '',
        note: '',
    });

    const handleAddRow = () => {
        onChange([...formData, createEmptyRow('通常')]);
    };

    const handleAddRowWithKind = (kind: string) => {
        console.log('追加する kind:', kind);
        const newRow = createEmptyRow(kind);
        console.log('追加される新規行:', newRow);
        onChange([...formData, newRow]);
    };

    const handleRemoveRow = (index: number) => {
        const newData = formData.filter((_, i) => i !== index);
        onChange(newData);
    };

    const classTypes = ['1名クラス', '2名クラス', '演習クラス'];
    const WEEKDAY_OPTIONS = ['日', '月', '火', '水', '木', '金', '土'];
    const PERIOD_OPTIONS = ['1限', '2限', '3限', '4限', '5限', '6限', '7限', '8限'];
    const years = [2025, 2026, 2027];
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">受講情報</h3>

            {lessonType ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-[2000px] table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-sm text-left">
                                    <th className="border px-4 py-2 w-[100px] text-center whitespace-nowrap">授業種別</th>
                                    <th className="border px-4 py-2 w-[100px] text-center whitespace-nowrap">授業形態</th>
                                    <th className="border px-4 py-2 w-[120px] text-center whitespace-nowrap">授業回数</th>
                                    <th className="border px-4 py-2 w-[400px] text-center whitespace-nowrap">科目</th>
                                    {lessonType === 'regular' && (
                                        <>
                                            <th className="border px-4 py-2 w-[600px] text-center whitespace-nowrap">曜日</th>
                                            <th className="border px-4 py-2 w-[600px] text-center whitespace-nowrap">時限</th>
                                        </>
                                    )}
                                    <th className="border px-4 py-2 w-[400px] text-center whitespace-nowrap">授業時間</th>
                                    <th className="border px-4 py-2 w-[100px] text-center whitespace-nowrap">受講開始</th>
                                    <th className="border px-4 py-2 w-[100px] text-center whitespace-nowrap">受講終了</th>
                                    <th className="border px-4 py-2 w-[150px]">備考</th>
                                    <th className="border px-4 py-2 w-[80px] text-center">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(formData || []).map((data, index) => (
                                    <tr key={index} className="text-sm">
                                        <td className="border px-4 py-2 text-center whitespace-nowrap text-ellipsis">
                                            <span>{data.kind}</span>
                                        </td>
                                        <td className="border px-1 py-2 min-w-[140px] text-center whitespace-nowrap text-ellipsis">
                                            <select
                                                value={data.classType || ''}
                                                onChange={(e) => handleChange(index, { classType: e.target.value })}
                                                className="w-full border rounded px-2 py-1"
                                            >
                                                <option value="">選択</option>
                                                {classTypes.map((type, i) => (
                                                    <option key={i} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="border px-4 py-2 min-w-[100px] text-center whitespace-nowrap text-ellipsis">
                                            {lessonType === 'regular' ? (
                                                <input
                                                    type="text"
                                                    value="1回"
                                                    readOnly
                                                    className="w-full border rounded px-2 py-1 bg-gray-100 text-center cursor-not-allowed"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={data.times || ''}
                                                    onChange={(e) => handleChange(index, { times: e.target.value })}
                                                    className="w-full border rounded px-2 py-1 text-center"
                                                    placeholder="例：1回"
                                                />
                                            )}
                                        </td>
                                        <td className="border px-1 py-2 min-w-[200px] text-center whitespace-nowrap text-ellipsis">
                                            <div className="flex flex-col gap-1">
                                                <select
                                                    value={String(data.subject) || ''}
                                                    onChange={(e) => {
                                                        const newSubject = e.target.value;
                                                        const updates: Partial<SchoolDataItem> = { subject: newSubject };
                                                        if (newSubject !== 'その他') {
                                                            updates.subjectOther = ''; // クリア
                                                        }
                                                        handleChange(index, updates);
                                                    }}
                                                    className="w-full min-w-[220px] px-100 py-100 border rounded"
                                                >
                                                    <option value="">選択してください</option>
                                                    {subjects.map((subject) => (
                                                        <option key={subject} value={subject}>
                                                            {subject}
                                                        </option>
                                                    ))}
                                                </select>

                                                {data.subject === 'その他' && (
                                                    <input
                                                        type="text"
                                                        value={data.subjectOther || ''}
                                                        onChange={(e) => handleChange(index, { subjectOther: e.target.value })}
                                                        className="w-full border rounded px-2 py-1"
                                                        placeholder="科目名を入力"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        {lessonType === 'regular' && (
                                            <>
                                                <td className="border px-1 py-2 min-w-[100px] text-center whitespace-nowrap text-ellipsis">
                                                    <select
                                                        value={data.weekday || ''}
                                                        onChange={(e) => handleChange(index, { weekday: e.target.value })}
                                                        className="w-full border rounded px-2 py-1"
                                                    >
                                                        <option value="">選択</option>
                                                        {WEEKDAY_OPTIONS.map((day) => (
                                                            <option key={day} value={day}>{day}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="border min-w-[110px] px-100 py-100 whitespace-nowrap text-ellipsis">
                                                    <select
                                                        value={data.period || ''}
                                                        onChange={(e) => handleChange(index, { period: e.target.value })}
                                                        className="w-full border rounded px-2 py-1"
                                                    >
                                                        <option value="">選択</option>
                                                        {PERIOD_OPTIONS.map((period) => (
                                                            <option key={period} value={period}>{period}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </>
                                        )}
                                        <td className="border px-2 py-2 min-w-[110px] whitespace-nowrap text-ellipsis">
                                            <select
                                                value={data.duration || ''}
                                                onChange={(e) => handleChange(index, { duration: e.target.value })}
                                                className="w-full border rounded px-2 py-1"
                                            >
                                                <option value="">選択</option>
                                                <option value="80分">80分</option>
                                                <option value="70分">70分</option>
                                                <option value="40分">40分</option>
                                            </select>
                                        </td>
                                        <td className="border px-4 py-2 text-center whitespace-nowrap text-ellipsis">
                                            <div className="flex gap-2">
                                                <select
                                                    value={data.startYear || ''}
                                                    onChange={(e) => handleChange(index, { startYear: e.target.value })}
                                                    className="border rounded px-2 py-1"
                                                >
                                                    <option value="">年</option>
                                                    {years.map((y) => (
                                                        <option key={y} value={y}>{y}年</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={data.startMonth || ''}
                                                    onChange={(e) => handleChange(index, { startMonth: e.target.value })}
                                                    className="border rounded px-2 py-1"
                                                >
                                                    <option value="">月</option>
                                                    {months.map((m) => (
                                                        <option key={m} value={m}>{m}月</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="border px-4 py-2 text-center whitespace-nowrap text-ellipsis">
                                            <div className="flex gap-2">
                                                <select
                                                    value={data.endYear || ''}
                                                    onChange={(e) => handleChange(index, { endYear: e.target.value })}
                                                    className="border rounded px-2 py-1"
                                                >
                                                    <option value="">年</option>
                                                    {years.map((y) => (
                                                        <option key={y} value={y}>{y}年</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={data.endMonth || ''}
                                                    onChange={(e) => handleChange(index, { endMonth: e.target.value })}
                                                    className="border rounded px-2 py-1"
                                                >
                                                    <option value="">月</option>
                                                    {months.map((m) => (
                                                        <option key={m} value={m}>{m}月</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="border px-4 py-2 min-w-[100px] text-center whitespace-nowrap text-ellipsis">
                                            <input
                                                type="text"
                                                value={data.note || ''}
                                                onChange={(e) => handleChange(index, { note: e.target.value })}
                                                className="w-full border rounded px-2 py-1"
                                                placeholder="備考"
                                            />
                                        </td>
                                        <td className="border px-4 py-2 text-center whitespace-nowrap text-ellipsis">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRow(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                削除
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* ボタンUI */}
                    {lessonType === 'regular' ? (
                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={handleAddRow}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                行を追加
                            </button>
                        </div>
                    ) : (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {['補習', '春期講習', '夏期講習', '冬期講習'].map((kind) => (
                                <button
                                    key={kind}
                                    type="button"
                                    onClick={() => handleAddRowWithKind(kind)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                                >
                                    {kind}を追加
                                </button>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <p className="text-gray-500">※ 上の授業形態を選択してください。</p>
            )}
        </div>
    );
};

export default CourseInfoSection;