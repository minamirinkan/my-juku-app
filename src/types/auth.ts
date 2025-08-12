// types/auth.ts
import { UserData, UserRole } from "./user";

export type AuthContextType = {
    user: any | null;
    role: UserRole;
    userData: UserData | null;
    classroomCode: string | null;
    loading: boolean;
};
