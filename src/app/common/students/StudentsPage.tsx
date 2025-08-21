'use client'

// src/common/students/StudentsPage.tsx
import { FC, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import StudentSearchForm from "./components/StudentSearchForm";
import StudentTable from "./components/StudentTable";
import StudentDetail from "./Detail/StudentDetail";
import { Student, Customer } from "@/types/types";
import { filterStudents } from "./components/filterStudents";

type StudentsPageProps = {
    students: Student[];
    classroomCode: string;
    onAddNewStudent: () => void;
};

type ViewMode = "list" | "detail";

const StudentsPage: FC<StudentsPageProps> = ({ students, classroomCode, onAddNewStudent }) => {
    const [view, setView] = useState<ViewMode>("list");
    const [selectedStudentDetail, setSelectedStudentDetail] = useState<{ student: Student; customer: Customer | null } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredStudents = filterStudents(students, searchTerm);

    const handleShowDetail = async (student: Student) => {
    let customerData: Customer | null = null;

    if (student.customerUid) {
        const customerRef = doc(db, 'customers', student.customerUid);
        const customerSnap = await getDoc(customerRef);
        if (customerSnap.exists()) {
            customerData = customerSnap.data() as Customer;
        }
    }

    setSelectedStudentDetail({ student, customer: customerData });
    setView("detail");
};

    const handleBackToList = () => {
        setSelectedStudentDetail(null);
        setView("list");
    };

    return (
        <>
            {view === "list" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">生徒マスタ 一覧</h1>
                        <button onClick={onAddNewStudent} className="btn-primary">新規登録</button>
                    </div>
                    <StudentSearchForm onSearch={setSearchTerm} />
                    <StudentTable students={filteredStudents} onShowDetail={handleShowDetail} />
                </div>
            )}
            {view === "detail" && selectedStudentDetail && (
                <StudentDetail
                    student={selectedStudentDetail.student}
                    customer={selectedStudentDetail.customer}
                    classroomCode={classroomCode}
                    onBack={handleBackToList}
                />
            )}
        </>
    );
};

export default StudentsPage;
