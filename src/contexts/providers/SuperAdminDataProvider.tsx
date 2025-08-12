import React, { createContext, useContext } from "react";
import { useAuth } from "../AuthContext";
import { useAdmins } from "@/hooks/useAdmins";
import { useClassrooms } from "@/hooks/useClassrooms";
import { useCustomers } from "@/hooks/useCustomers";
import { useDailySchedules } from "@/hooks/useDailySchedules";
import { usePeriodLabelsByClassroomCode } from "@/hooks/usePeriodLabelsBySchool";
import { useSchoolClosures } from "@/hooks/useSchoolClosures";
import { useStudents } from "@/hooks/useStudents";
import { useSuperadmins } from "@/hooks/useSuperadmins";
import type { SuperAdminDataContextType } from "@/types/superAdminContext";
import type { Timestamp } from "firebase/firestore";

const SuperAdminDataContext = createContext<SuperAdminDataContextType | null>(null);

export const SuperAdminDataProvider = ({ children }: { children: React.ReactNode }) => {
    const { userData } = useAuth();
    const { admins, loading: adminsLoading } = useAdmins();
    // エラーは使わないなら受け取らない
    const { classrooms, loading: classroomsLoading } = useClassrooms();
    const { customers, loading: customersLoading } = useCustomers();
    const { schedules: dailySchedules, loading: schedulesLoading } = useDailySchedules();
    const { labels: periodLabels, loading: periodLabelsLoading } = usePeriodLabelsByClassroomCode();
    const currentYear = new Date().getFullYear().toString();

    const {
        closures,
        deletedClosures,
        updatedAt: closuresUpdatedAtNullable,
        loading: closuresLoading,
        error: closuresError,
    } = useSchoolClosures(currentYear);

    // null 許容のまま context で渡すか、必要なら null を排除して渡す
    const closuresUpdatedAt: Timestamp | null = closuresUpdatedAtNullable ?? null;

    // useStudentsにerrorが無ければ受け取らない
    const { students, loading: studentsLoading } = useStudents();
    const { superadmins, loading: superadminsLoading } = useSuperadmins();

    const isLoading =
        adminsLoading ||
        classroomsLoading ||
        customersLoading ||
        schedulesLoading ||
        periodLabelsLoading ||
        closuresLoading ||
        studentsLoading ||
        superadminsLoading;

    return (
        <SuperAdminDataContext.Provider
            value={{
                userData,
                admins,
                adminsLoading,
                classrooms,
                customers,
                dailySchedules,
                periodLabels,
                closures,
                deletedClosures,
                closuresUpdatedAt,
                students,
                superadmins,
                superadminsLoading,
                isLoading,
                error: closuresError,
            }}
        >
            {children}
        </SuperAdminDataContext.Provider>
    );
};

export const useSuperAdminData = () => {
    const context = useContext(SuperAdminDataContext);
    if (!context) {
        throw new Error("useSuperAdminData must be used within a SuperAdminDataProvider");
    }
    return context;
};
