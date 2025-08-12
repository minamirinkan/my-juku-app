import { Timestamp } from "firebase/firestore";
import { Superadmin } from "./superadmin";
import { Admin } from "./admin";
import { Classroom } from "./classroom";
import { Customer } from "./customer";
import { SchoolClosure } from "./schoolClosures";
import { Student } from "./student";
import { DailyScheduleDocument } from "./dailySchedule";
import { PeriodLabel } from "./periodLabel";
export interface SuperAdminDataContextType {
    userData: any;
    admins: Admin[];
    adminsLoading: boolean;
    classrooms: Classroom[];
    customers: Customer[];
    dailySchedules: DailyScheduleDocument[];
    periodLabels: PeriodLabel[];
    closures: SchoolClosure[];
    deletedClosures: SchoolClosure[];
    closuresUpdatedAt: Timestamp | null;
    students: Student[];
    superadmins: Superadmin[];
    superadminsLoading: boolean;
    isLoading: boolean;
    error: unknown;
}
