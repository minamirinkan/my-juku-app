'use client';

import { createContext, useContext, useMemo, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudents } from "@/hooks/useStudents";
import { useCustomers } from "@/hooks/useCustomers";
import { usePeriodLabelsByClassroomCode } from "@/hooks/usePeriodLabelsBySchool";
import { useSchoolClosures } from "@/hooks/useSchoolClosures";
import { useDailySchedules } from "@/hooks/useDailySchedules";
import { useClassroom } from "@/hooks/useClassroom";
import { UserData, Student, Customer, PeriodLabel, SchoolClosures, DailySchedule } from "@/types/types"

interface AdminDataContextType {
    userData: UserData | null;
    classroom: ReturnType<typeof useClassroom>;
    students: { students: Student[]; loading: boolean; error?: unknown };
    customers: { customers: Customer[]; loading: boolean; error?: unknown };
    periodLabels: { labels: PeriodLabel[]; loading: boolean };
    closures: SchoolClosures;
    dailySchedules: DailySchedule[];
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

interface AdminDataProviderProps {
    children: ReactNode;
}

export const AdminDataProvider = ({ children }: AdminDataProviderProps) => {
    const { userData } = useAuth();
    const classroomCode = userData?.classroomCode;
    const classroom = useClassroom(classroomCode ?? undefined);
    const students = useStudents(classroomCode ?? undefined);
    const customers = useCustomers(undefined, classroomCode ?? undefined);
    const periodLabels = usePeriodLabelsByClassroomCode(classroomCode ?? undefined);
    const currentYear = new Date().getFullYear().toString();
    const { closures, deletedClosures, updatedAt } = useSchoolClosures(currentYear, classroomCode ?? undefined);
    const { schedules } = useDailySchedules();

    const filteredSchedules = useMemo(() => {
        return schedules.filter((s) => s.id.startsWith(`${classroomCode}_`));
    }, [schedules, classroomCode]);

    return (
        <AdminDataContext.Provider
            value={{
                userData,
                classroom,
                students,
                customers,
                periodLabels,
                closures: {
                    closures,
                    deletedClosures,
                    updatedAt: updatedAt ? updatedAt.toDate() : undefined,
                },
                dailySchedules: filteredSchedules,
            }}
        >
            {children}
        </AdminDataContext.Provider>
    );
};

export const useAdminData = () => {
    const context = useContext(AdminDataContext);
    if (!context) throw new Error("useAdminData must be used within AdminDataProvider");
    return context;
};
