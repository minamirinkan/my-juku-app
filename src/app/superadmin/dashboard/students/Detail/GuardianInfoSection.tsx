import React from 'react';
import InfoRow from '../components/InfoRow';

type GuardianInfoSectionProps = {
    formData: {
        guardianLastName?: string;
        guardianFirstName?: string;
        guardianLastNameKana?: string;
        guardianFirstNameKana?: string;
        relationship?: string;
        guardianPhone?: string;
        emergencyContact?: string;
        guardianEmail?: string;
        postalCode?: string;
        prefecture?: string;
        city?: string;
        street?: string;
        building?: string;
        notes?: string;
    };
    isEditing: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const GuardianInfoSection: React.FC<GuardianInfoSectionProps> = ({
    formData,
    isEditing,
    onChange,
}) => (
    <div className="space-y-4 w-1/2 pl-6">
        {/* 保護者情報 */}
        <div className="p-3 rounded-md border border-gray-300 border-t-4 border-t-blue-500 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-blue-600">保護者情報</h2>
            <InfoRow label="保護者氏名（姓）" value={formData.guardianLastName} name="guardianLastName" isEditing={isEditing} onChange={onChange} />
            <InfoRow label="保護者氏名（名）" value={formData.guardianFirstName} name="guardianFirstName" isEditing={isEditing} onChange={onChange} />
            <InfoRow label="氏名カナ（姓）" value={formData.guardianLastNameKana} name="guardianLastNameKana" isEditing={isEditing} onChange={onChange} />
            <InfoRow label="氏名カナ（名）" value={formData.guardianFirstNameKana} name="guardianFirstNameKana" isEditing={isEditing} onChange={onChange} />
            <InfoRow label="続柄" value={formData.relationship} name="relationship" isEditing={isEditing} onChange={onChange} />
        </div>

        {/* 連絡先 */}
        <div className="p-3 rounded-md border border-gray-300 border-t-4 border-t-blue-500 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-blue-600">連絡先</h2>
            <InfoRow label="電話番号" value={formData.guardianPhone} name="guardianPhone" isEditing={isEditing} onChange={onChange} />
            <InfoRow label="緊急連絡先" value={formData.emergencyContact} name="emergencyContact" isEditing={isEditing} onChange={onChange} />
            <InfoRow label="メールアドレス" value={formData.guardianEmail} name="guardianEmail" isEditing={isEditing} onChange={onChange} />
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">住所</label>
                {!isEditing ? (
                    <p className="text-gray-800 border rounded p-2 bg-white">
                        〒{formData.postalCode || '－'}<br />
                        {formData.prefecture || ''}{formData.city || ''}{formData.street || ''}<br />
                        {formData.building || ''}
                    </p>
                ) : (
                    <div className="space-y-2">
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode || ''}
                            onChange={onChange}
                            placeholder="郵便番号（例: 123-4567）"
                            className="w-full border rounded p-2"
                        />
                        <input
                            type="text"
                            name="prefecture"
                            value={formData.prefecture || ''}
                            onChange={onChange}
                            placeholder="都道府県"
                            className="w-full border rounded p-2"
                        />
                        <input
                            type="text"
                            name="city"
                            value={formData.city || ''}
                            onChange={onChange}
                            placeholder="市区町村"
                            className="w-full border rounded p-2"
                        />
                        <input
                            type="text"
                            name="street"
                            value={formData.street || ''}
                            onChange={onChange}
                            placeholder="番地"
                            className="w-full border rounded p-2"
                        />
                        <input
                            type="text"
                            name="building"
                            value={formData.building || ''}
                            onChange={onChange}
                            placeholder="建物名・部屋番号（任意）"
                            className="w-full border rounded p-2"
                        />
                    </div>
                )}
            </div>
        </div>

        {/* 備考欄 */}
        <div className="p-3 rounded-md border border-gray-300 border-t-4 border-t-blue-500 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-blue-600">備考</h2>
            {!isEditing ? (
                <p className="min-h-[100px] whitespace-pre-wrap text-gray-800 p-2 border rounded bg-white">
                    {formData.notes || '－'}
                </p>
            ) : (
                <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={onChange}
                    rows={5}
                    className="w-full p-2 border rounded bg-white text-gray-800"
                    placeholder="備考を入力してください"
                />
            )}
        </div>
    </div>
);

export default GuardianInfoSection;
