// src/components/StudentRegistrationForm/StudentRegistrationForm.tsx
import React from 'react';
import { useEffect, useState } from 'react';
import { serverTimestamp, addDoc, collection, getFirestore } from 'firebase/firestore';
import { registerCustomerAndStudent } from '../firebase/saveCustomerAndStudent';
import { useAuth } from '@/contexts/AuthContext';
import BasicInfoSection from './components/BasicInfoSection';
import GuardianInfoSection from './components/GuardianInfoSection';
import InternalInfoSection from './components/InternalInfoSection';
import { generateStudentCode } from './firebase/studentCodeGenerator';
import CourseInfoSection from './components/CourseInfoSection';
import SchoolInfoSection from './components/SchoolInfoSection';
import AddressInfoSection from './components/AddressInfoSection';
import { Student } from '@/types/student';
import { SchoolDataItem } from '@/types/schoolData';
import { Timestamp } from 'firebase/firestore';
import { SchoolLevel } from '@/types/schoolData';
import { useAdminData } from '@/contexts/providers/AdminDataProvider';

const StudentRegistrationForm = ({ onCancel }: { onCancel?: () => void }) => {
    const { userData } = useAdminData();
    const classroomCode = userData?.classroomCode ?? '';
    const classroomName = userData?.classroomName ?? '';

    const initialFormData: Partial<Student> = {
        studentId: '',
        fullname: '',
        fullnameKana: '',
        lastName: '',
        firstName: '',
        lastNameKana: '',
        firstNameKana: '',
        gender: '',
        birthDate: '',
        grade: '',
        schoolName: '',
        schoolKana: '',
        schoolLevel: '',
        schoolType: '',
        schoolingStatus: '',
        classroomCode: '',
        classroomName: '',
        customerUid: '',
        entryDate: '',
        postalCode: '',
        prefecture: '',
        city: '',
        cityKana: '',
        streetAddress: '',
        streetAddressKana: '',
        buildingName: '',
        guardianfullName: '',
        guardianfullNameKana: '',
        guardianLastName: '',
        guardianFirstName: '',
        guardianLastNameKana: '',
        guardianFirstNameKana: '',
        guardianPhone: '',
        guardianEmail: '',
        relationship: '',
        emergencyContact: '',
        remarks: '',
        status: '在籍中',
        registrationDate: serverTimestamp() as Timestamp, // ← 修正済み
        courses: [], // ← 初期は空配列でOK（any型なので柔軟）
    };

    const [schoolData, setSchoolData] = useState<SchoolDataItem[]>([
        {
            kind: '通常',
            subject: '',
            subjectOther: '',
            classType: '',
            times: '',
            duration: '',
            startMonth: '',
            endMonth: '',
            startYear: '',
            endYear: '',
            note: '',
            weekday: '',
            period: '',
        },
    ]);

    const isSchoolLevel = (value: any): value is SchoolLevel =>
        ['小学校', '中学校', '高等学校', '通信制'].includes(value);

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(true);
    const [lessonType, setLessonType] = React.useState<'regular' | 'nonRegular'>('regular');
    const [courseFormData, setCourseFormData] = useState<SchoolDataItem[]>([]);

    console.log('保存するデータ:', courseFormData);
    useEffect(() => {
        if (lessonType === 'regular' && courseFormData.length === 0) {
            setCourseFormData([...schoolData]);
        }
    }, [lessonType, schoolData]);

    useEffect(() => {
        if (formData.schoolLevel) {
            setCourseFormData((prev) =>
                prev.map((row) => ({ ...row, subject: '' }))
            );
        }
    }, [formData.schoolLevel]);

    const handleLessonTypeChange = (value: 'regular' | 'nonRegular') => {
        setLessonType(value);
        // 非レギュラーの時だけリセットする（←これは任意）
        if (value === 'nonRegular') {
            setCourseFormData([]);
        }
    };

    useEffect(() => {
        const fetchAndSetStudentId = async () => {
            if (!classroomCode) return;
            const newId = await generateStudentCode(classroomCode);
            setFormData((prev) => ({ ...prev, studentId: newId }));
            setLoading(false);
        };
        fetchAndSetStudentId();
    }, [classroomCode]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const { user } = useAuth();
    const currentAdminUid = user?.uid;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.lastName || !formData.firstName) {
            alert('氏名を入力してください');
            return;
        }

        // 登録用の関数呼び出し
        const success = await registerCustomerAndStudent({
            uid: formData.studentId ?? '',
            customerName: `${formData.guardianLastName} ${formData.guardianFirstName}`,
            phoneNumber: formData.guardianPhone ?? '',
            isFirstLogin: true,
            studentData: {
                ...(formData as Student),
                classroomCode,
                classroomName,
                fullname: `${formData.lastName} ${formData.firstName}`,
                fullnameKana: `${formData.lastNameKana} ${formData.firstNameKana}`,
                guardianfullName: `${formData.guardianLastName} ${formData.guardianFirstName}`,
                guardianfullNameKana: `${formData.guardianLastNameKana} ${formData.guardianFirstNameKana}`,
                registrationDate: Timestamp.fromDate(new Date()),
                courses: courseFormData ?? [],
            },
            courseFormData: courseFormData.map((course) => {
                const updated = { ...course };
                if (updated.subject === 'その他') {
                    updated.subject = updated.subjectOther || '';
                }
                delete updated.subjectOther;
                return updated;
            }),
        });


        if (success) {
            const db = getFirestore();
            await addDoc(collection(db, 'logs'), {
                adminUid: currentAdminUid,
                action: '生徒新規登録',
                target: `${formData.lastName} ${formData.firstName}`,
                detail: `教室: ${classroomName} / 氏名: ${formData.lastName} ${formData.firstName}`,
                timestamp: serverTimestamp(),
            });
            alert('登録が完了しました');

            const newStudentId = await generateStudentCode(classroomCode);
            setFormData({
                ...initialFormData,
                studentId: newStudentId,
            });
        } else {
            alert('登録に失敗しました');
        }
    };

    const handleCancel = async () => {
        if (!classroomCode) return;
        const newCode = await generateStudentCode(classroomCode);
        setFormData({
            ...initialFormData,
            studentId: newCode,
        });

        if (typeof onCancel === 'function') {
            onCancel();
        }
    };

    if (!userData || !classroomCode || loading) {
        return <div className="text-center text-gray-500">読み込み中...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-4 space-y-6 h-adr">
            <h2 className="text-xl font-bold mb-4">生徒新規登録フォーム</h2>

            {/* 左側：内部管理用、生徒基本情報、住所情報 */}
            {/* 右側：学校情報、保護者情報 */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                        <InternalInfoSection
                            lessonType={lessonType}
                            formData={formData}
                            onChange={handleChange}
                            onLessonTypeChange={handleLessonTypeChange}
                        />
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                        <BasicInfoSection formData={formData} onChange={handleChange} />
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                        <AddressInfoSection
                            formData={formData}
                            onChange={(updatedAddress) => setFormData(prev => ({
                                ...prev,
                                ...updatedAddress
                            }))}
                        />
                    </div>
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                        <SchoolInfoSection
                            schoolData={{
                                schoolingStatus: formData.schoolingStatus || undefined,
                                schoolType: formData.schoolType || undefined,
                                schoolLevel: formData.schoolLevel || undefined,
                                schoolName: formData.schoolName,
                                schoolKana: formData.schoolKana,
                                grade: formData.grade,
                            }}
                            onChange={(updatedSchoolData: Partial<Student>) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    ...updatedSchoolData,
                                }));
                            }}
                        />
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                        <GuardianInfoSection formData={formData} onChange={handleChange} />
                    </div>
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                <div className="min-w-[800px] bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                    <CourseInfoSection
                        lessonType={lessonType}
                        formData={courseFormData || []}
                        onChange={setCourseFormData}
                        setLessonType={setLessonType}
                        schoolLevel={isSchoolLevel(formData.schoolLevel) ? formData.schoolLevel : undefined}
                    />
                </div>
            </div>
            <div className="flex justify-center gap-6 mt-8">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    登録する
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                >
                    キャンセル
                </button>
            </div>
        </form>
    );
};

export default StudentRegistrationForm;
