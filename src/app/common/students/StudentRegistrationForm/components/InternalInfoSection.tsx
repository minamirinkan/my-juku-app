import React from 'react';

type InternalInfoSectionProps = {
    formData: {
        studentId?: string;
        entryDate?: string;
    };
    onChange: (field: string, value: string) => void;
    lessonType: 'regular' | 'nonRegular';
    onLessonTypeChange: (value: 'regular' | 'nonRegular') => void;
};

const InternalInfoSection: React.FC<InternalInfoSectionProps> = ({
    formData,
    onChange,
    lessonType,
    onLessonTypeChange,
}) => (
    <fieldset>
        <legend className="font-semibold mb-2">内部管理用</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
                type="text"
                placeholder="生徒ID"
                value={formData.studentId || ''}
                readOnly
                className="border rounded p-2 bg-gray-100 cursor-not-allowed"
            />
            <input
                type="date"
                placeholder="登録日"
                value={formData.entryDate || ''}
                onChange={(e) => onChange('entryDate', e.target.value)}
                className="border rounded p-2"
            />
        </div>
        <div className="sm:col-span-2">
            <label className="block mb-2 mt-4 font-medium">授業形態</label>
            <div className="flex gap-6">
                <label className="flex flex-col items-center flex-1 border rounded p-4">
                    <span className="flex items-center gap-2">
                        <input
                            type="radio"
                            className="form-radio"
                            value="regular"
                            checked={lessonType === 'regular'}
                            onChange={() => onLessonTypeChange('regular')}
                        />
                        <span className="font-medium">レギュラー</span>
                    </span>
                    <span className="text-sm text-gray-500 ml-6">（新規・継続）</span>
                </label>
                <label className="flex flex-col items-center flex-1 border rounded p-4">
                    <span className="flex items-center gap-2">
                        <input
                            type="radio"
                            className="form-radio"
                            value="nonRegular"
                            checked={lessonType === 'nonRegular'}
                            onChange={() => onLessonTypeChange('nonRegular')}
                        />
                        <span className="font-medium">非レギュラー</span>
                    </span>
                    <span className="text-sm text-gray-500 ml-6">（補習・講習のみ）</span>
                </label>
            </div>
        </div>
    </fieldset>
);

export default InternalInfoSection;
