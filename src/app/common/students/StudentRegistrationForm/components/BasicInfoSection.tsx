import React from 'react';

const genders = ['男性', '女性', 'その他'];

type BasicInfoSectionProps = {
    formData: {
        lastName?: string;
        firstName?: string;
        lastNameKana?: string;
        firstNameKana?: string;
        birthDate?: string;  // ISO日付文字列
        gender?: string;
    };
    onChange: (field: string, value: string) => void;
};

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ formData, onChange }) => (
    <fieldset>
        <legend className="font-semibold mb-2">生徒の基本情報</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
                type="text"
                placeholder="姓"
                value={formData.lastName}
                onChange={(e) => onChange('lastName', e.target.value)}
                className="border rounded p-2"
                required
            />
            <input
                type="text"
                placeholder="名"
                value={formData.firstName}
                onChange={(e) => onChange('firstName', e.target.value)}
                className="border rounded p-2"
                required
            />
            <input
                type="text"
                placeholder="姓（フリガナ）"
                value={formData.lastNameKana || ''}
                onChange={(e) => onChange('lastNameKana', e.target.value)}
                className="border rounded p-2"
            />
            <input
                type="text"
                placeholder="名（フリガナ）"
                value={formData.firstNameKana || ''}
                onChange={(e) => onChange('firstNameKana', e.target.value)}
                className="border rounded p-2"
            />
            <input
                type="date"
                value={formData.birthDate || ''}
                onChange={(e) => onChange('birthDate', e.target.value)}
                className="border rounded p-2"
            />
            <select
                value={formData.gender || ''}
                onChange={(e) => onChange('gender', e.target.value)}
                className="border rounded p-2"
            >
                <option value="">性別を選択</option>
                {genders.map((g) => (
                    <option key={g} value={g}>
                        {g}
                    </option>
                ))}
            </select>
        </div>
    </fieldset>
);

export default BasicInfoSection;
