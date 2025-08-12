import React from 'react';

type GuardianInfoSectionProps = {
    formData: {
        guardianLastName?: string;
        guardianFirstName?: string;
        guardianLastNameKana?: string;
        guardianFirstNameKana?: string;
        relationship?: string;
        guardianPhone?: string;
        guardianEmail?: string;
        emergencyContact?: string;
    };
    onChange: (field: string, value: string) => void;
};

const GuardianInfoSection: React.FC<GuardianInfoSectionProps> = ({ formData, onChange }) => (
    <fieldset>
        <legend className="font-semibold mb-2">保護者情報</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
                type="text"
                placeholder="保護者 姓"
                value={formData.guardianLastName || ''}
                onChange={(e) => onChange('guardianLastName', e.target.value)}
                className="border rounded p-2"
            />
            <input
                type="text"
                placeholder="保護者 名"
                value={formData.guardianFirstName || ''}
                onChange={(e) => onChange('guardianFirstName', e.target.value)}
                className="border rounded p-2"
            />
            <input
                type="text"
                placeholder="保護者 姓（カナ）"
                value={formData.guardianLastNameKana || ''}
                onChange={(e) => onChange('guardianLastNameKana', e.target.value)}
                className="border rounded p-2"
            />
            <input
                type="text"
                placeholder="保護者 名（カナ）"
                value={formData.guardianFirstNameKana || ''}
                onChange={(e) => onChange('guardianFirstNameKana', e.target.value)}
                className="border rounded p-2"
            />
            <input
                type="text"
                placeholder="続柄"
                value={formData.relationship || ''}
                onChange={(e) => onChange('relationship', e.target.value)}
                className="border rounded p-2"
            />
            <input
                type="tel"
                placeholder="保護者電話番号"
                value={formData.guardianPhone || ''}
                onChange={(e) => onChange('guardianPhone', e.target.value)}
                className="border rounded p-2"
            />
            <input
                type="email"
                placeholder="保護者メールアドレス"
                value={formData.guardianEmail || ''}
                onChange={(e) => onChange('guardianEmail', e.target.value)}
                className="border rounded p-2"
            />
            <input
                type="text"
                placeholder="緊急連絡先"
                value={formData.emergencyContact || ''}
                onChange={(e) => onChange('emergencyContact', e.target.value)}
                className="border rounded p-2"
            />
        </div>
    </fieldset>
);

export default GuardianInfoSection;
