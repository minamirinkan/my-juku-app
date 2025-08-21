import React from 'react';
import InfoRow from '../components/InfoRow';
import { formatDate } from '@/utils/dateFormatter';

type StudentInfoSectionProps = {
    formData: {
        status?: string;
        entryDate?: string;
        studentId?: string;
        classroomName?: string;
        lastName?: string;
        firstName?: string;
        lastNameKana?: string;
        firstNameKana?: string;
        gender?: string;
        birthDate?: string;
        schoolType?: string;
        schoolName?: string;
        grade?: string;
    };
    isEditing: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const StudentInfoSection: React.FC<StudentInfoSectionProps> = ({
    formData,
    isEditing,
    onChange,
}) => (
    <div className="space-y-4 w-1/2 pr-6">
        {/* 在籍情報 */}
        <div className="p-3 rounded-md border border-gray-300 border-t-4 border-t-blue-500 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-blue-600">在籍情報</h2>
            <InfoRow label="在籍状況" value={formData.status} isEditing={false} />
            <InfoRow label="受付日" value={formatDate(formData.entryDate)} isEditing={false} />
            <InfoRow label="入塾日" value={formatDate(formData.entryDate)} isEditing={false} />
        </div>

        {/* 生徒情報 */}
        <div className="p-3 rounded-md border border-gray-300 border-t-4 border-t-blue-500 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-blue-600">生徒情報</h2>
            <InfoRow label="生徒コード" value={formData.studentId} isEditing={false} readOnly />
            <InfoRow label="教室名" value={formData.classroomName} isEditing={isEditing} onChange={onChange!} name="classroomName" />
            <InfoRow label="氏名（姓）" value={formData.lastName} name="lastName" isEditing={isEditing} onChange={onChange!} />
            <InfoRow label="氏名（名）" value={formData.firstName} name="firstName" isEditing={isEditing} onChange={onChange!} />
            <InfoRow label="氏名カナ（姓）" value={formData.lastNameKana} name="lastNameKana" isEditing={isEditing} onChange={onChange!} />
            <InfoRow label="氏名カナ（名）" value={formData.firstNameKana} name="firstNameKana" isEditing={isEditing} onChange={onChange!} />
            <InfoRow label="性別" value={formData.gender} name="gender" isEditing={isEditing} onChange={onChange!} />
            <InfoRow label="生年月日" value={formatDate(formData.birthDate)} name="birthDate" isEditing={isEditing} onChange={onChange!} />
        </div>

        {/* 学校情報 */}
        <div className="p-3 rounded-md border border-gray-300 border-t-4 border-t-blue-500 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-blue-600">学校情報</h2>
            <InfoRow label="学校種別" value={formData.schoolType} name="schoolType" isEditing={isEditing} onChange={onChange!} />
            <InfoRow label="学校名" value={formData.schoolName} name="schoolName" isEditing={isEditing} onChange={onChange!} />
            <InfoRow label="学年" value={formData.grade} name="grade" isEditing={isEditing} onChange={onChange!} />
        </div>
    </div>
);

export default StudentInfoSection;
