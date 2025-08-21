import StudentsPage from "@/app/common/students/StudentsPage";
import { useSuperAdminData } from "../../SuperAdminDataProvider";

export default function Page() {
    const { students, userData } = useSuperAdminData();

    const handleAddNewStudent = () => {
        console.log("新規追加");
        // Firestore に追加する共通処理
    };

    return <StudentsPage students={students ?? []} classroomCode={userData?.classroomCode ?? ""} onAddNewStudent={handleAddNewStudent} />;
}
