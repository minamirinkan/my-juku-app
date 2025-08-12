import React from "react";
import { useAuth } from "../AuthContext";
import { SuperAdminDataProvider } from "./SuperAdminDataProvider";
import { AdminDataProvider } from "./AdminDataProvider";
import { TeacherDataProvider } from "./TeacherDataProvider";
import { CustomerDataProvider } from "./CustomerDataProvider";
import { ClassroomSelectionProvider } from "../ClassroomSelectionContext";

const RoleBasedProvider = ({ children }: { children: React.ReactNode }) => {
    const { userData } = useAuth();

    if (!userData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">ユーザー情報を取得中...</p>
            </div>
        );
    }

    switch (userData.role) {
        case "superadmin":
            return (
                <ClassroomSelectionProvider>
                    <SuperAdminDataProvider>{children}</SuperAdminDataProvider>;
                </ClassroomSelectionProvider>
            );
        case "admin":
            return <AdminDataProvider>{children}</AdminDataProvider>;
        case "customer":
            return <CustomerDataProvider>{children}</CustomerDataProvider>;
        case "teacher":
            return <TeacherDataProvider>{children}</TeacherDataProvider>;
        default:
            return <div>未対応のロール: {userData.role}</div>;
    }
};

export default RoleBasedProvider;
