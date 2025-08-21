'use client'

import React, { createContext, useContext } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmins } from "@/hooks/useAdmins";
import { useClassrooms } from "@/hooks/useClassrooms";
import { useCustomers } from "@/hooks/useCustomers";
import { useDailySchedules } from "@/hooks/useDailySchedules";
import { usePeriodLabelsByClassroomCode } from "@/hooks/usePeriodLabelsBySchool";
import { useSchoolClosures } from "@/hooks/useSchoolClosures";
import { useStudents } from "@/hooks/useStudents";
import { useSuperadmins } from "@/hooks/useSuperadmins";
import {
    UserData,
    SuperAdmin,
    Admin,
    Classroom,
    Student,
    Customer,
    PeriodLabel,
    SchoolClosures,
    DailySchedule
} from "@/types/types"

interface SuperAdminDataContextType {
    userData: UserData | null;
    admins: Admin[];
    adminsLoading: boolean;
    classrooms: { classrooms: Classroom[]; loading: boolean }
    customers: Customer[];
    dailySchedules: DailySchedule[];
    periodLabels: PeriodLabel[];
    closures: SchoolClosures;
    students: Student[];
    superadmins: SuperAdmin[];
    superadminsLoading: boolean;
    isLoading: boolean;
    error: unknown;
}

const SuperAdminDataContext = createContext<SuperAdminDataContextType | null>(null);

export const SuperAdminDataProvider = ({ children }: { children: React.ReactNode }) => {
    const { userData } = useAuth();
    const { admins, loading: adminsLoading } = useAdmins();
    const classroomCode = userData?.classroomCode;
    const { classrooms, loading: classroomsLoading } = useClassrooms();
    const { customers, loading: customersLoading } = useCustomers();
    const { schedules: dailySchedules, loading: schedulesLoading } = useDailySchedules();
    const { labels: periodLabels, loading: periodLabelsLoading } = usePeriodLabelsByClassroomCode();
    const currentYear = new Date().getFullYear().toString();
    const { closures, deletedClosures, updatedAt, loading: closuresLoading, error: closuresError } = useSchoolClosures(currentYear, classroomCode ?? undefined);

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
                classrooms: { classrooms, loading: classroomsLoading },
                customers,
                dailySchedules,
                periodLabels,
                closures: {
                    closures,
                    deletedClosures,
                    updatedAt: updatedAt ? updatedAt.toDate() : undefined,
                },
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
