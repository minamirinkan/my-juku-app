'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserDataByRole } from "@/utils/getUserDataByRole";
import { UserRole, UserData } from "@/types/user";
import { AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    userData: null,
    classroomCode: null,
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(true);

            if (!currentUser) {
                setRole(null);
                setUserData(null);
                setLoading(false);
                return;
            }

            try {
                const { role, userData } = await getUserDataByRole(currentUser.uid);
                setRole(role);
                setUserData(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setRole(null);
                setUserData(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                role,
                userData,
                classroomCode: userData?.classroomCode ?? null,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
