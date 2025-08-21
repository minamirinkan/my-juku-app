'use client'

import React, { useState, useEffect } from 'react';
import StudentInfoSection from './StudentInfoSection';
import GuardianInfoSection from './GuardianInfoSection';
import ActionButtons from '@/utils/ActionButtons';
import StudentAttendanceTab from './Tabs/StudentAttendanceTab'
import StudentCourseTable from './Tabs/StudentCourseTable';
import { Student } from '@/types/types';
import { Customer } from '@/types/types';

type StudentDetailProps = {
    student: Student;
    customer: Customer | null;  // ここを追加する
    classroomCode: string;
    onBack: () => void;
};

const TABS = ['基本情報', '在籍情報', '受講情報', '授業情報', '請求情報'];

const StudentDetail: React.FC<StudentDetailProps> = ({ student, onBack }) => {
    console.log("✅ StudentDetail 受け取った student:", student);
    const [activeTab, setActiveTab] = useState('基本情報');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...student });
    const [originalData, setOriginalData] = useState({ ...student });

    const handleEditClick = () => {
        console.log("📝 編集開始前の formData:", formData);
        setOriginalData(formData);
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setFormData(originalData);
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = () => {
        // 削除処理のロジックをここに書く（例: 確認ダイアログ、APIコールなど）
        console.log('削除ボタンが押されました');
    };

    useEffect(() => {
        console.log("🔁 props.student が更新されたので再同期:", student);
        setFormData({ ...student });
        setOriginalData({ ...student });
    }, [student]);

    const renderTabContent = () => {
        switch (activeTab) {
            case '基本情報':
                return (
                    <div className="flex gap-6">
                        <StudentInfoSection
                            formData={formData}
                            isEditing={isEditing}
                            onChange={handleChange}
                        />
                        <GuardianInfoSection
                            formData={formData}
                            isEditing={isEditing}
                            onChange={handleChange}
                        />
                    </div>
                );
            case '在籍情報':
                return (
                    <div className="text-gray-500 italic">このセクションは現在準備中です。</div>
                );
            case '受講情報':
                return (
                    <div className="flex flex-col gap-4">
                        <StudentCourseTable studentId={formData.id ?? ""} />
                    </div>
                );
            case '授業情報':
                console.log("🟨 renderTabContent - formData:", formData);
                return (
                    <div className="flex gap-6">
                        <StudentAttendanceTab
                            studentId={formData.id}
                            studentName={`${formData?.lastName ?? ''} ${formData?.firstName ?? ''}`}
                            classroomCode={formData.classroomCode} // これが student データに含まれていれば
                        />
                    </div>
                );
            case '請求情報':
                return (
                    <div className="text-gray-500 italic">このセクションは現在準備中です。</div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 bg-white rounded shadow-md max-w-5xl mx-auto">
            {/* タイトル */}
            <div className="flex items-center mb-4 space-x-6">
                <h1 className="text-2xl font-bold text-gray-800">生徒マスタ</h1>
                <span className="text-2xl text-gray-500 font-normal">詳細</span>
            </div>

            {/* タブ */}
            <div className="flex gap-3 border-b border-gray-300 mb-6 bg-gray-50 rounded-t">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        className={`px-5 py-2 text-sm font-semibold border-t-[2px] transition-all duration-200
                            ${activeTab === tab
                                ? 'border-blue-600 text-blue-700 bg-white'
                                : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-400'
                            }
                        `}
                        onClick={() => setActiveTab(tab)}
                        aria-selected={activeTab === tab}
                        role="tab"
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ボタン（上） */}
            {activeTab === '基本情報' && (
                <ActionButtons
                    isEditing={isEditing}
                    onBack={onBack}
                    onEdit={handleEditClick}
                    onCancel={handleCancelClick}
                    onSave={handleSaveClick}
                    onDelete={handleDelete}
                />
            )}

            {/* メイン内容 */}
            <div className="mt-4">{renderTabContent()}</div>

            {/* ボタン（下） */}
            {activeTab === '基本情報' && (
                <div className="mt-6">
                    <ActionButtons
                        isEditing={isEditing}
                        onBack={onBack}
                        onEdit={handleEditClick}
                        onCancel={handleCancelClick}
                        onSave={handleSaveClick}
                        onDelete={handleDelete}
                    />
                </div>
            )}
        </div>
    );
};

export default StudentDetail;
