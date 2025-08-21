import StudentsPage from "@/app/common/students/StudentsPage";
import { useAdminData } from "@/contexts/providers/AdminDataProvider";

export default function Page() {
    const { students, userData } = useAdminData();

    const handleAddNewStudent = () => {
        console.log("新規追加");
        // 同じ共通処理
    };

    return <StudentsPage students={students?.students ?? []} classroomCode={userData?.classroomCode ?? ""} onAddNewStudent={handleAddNewStudent} />;
}
