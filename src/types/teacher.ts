import { Timestamp } from "firebase/firestore";

export interface Teacher {
    uid: string;
    code: string;
    name: string;
    firstName: string;
    lastName: string;
    kanafirstName: string;
    kanalastName: string;
    gender: string;
    email: string;
    phone: string;
    role: "teacher";
    status: string;
    university: string;
    universityGrade: string;
    hireDate: string;
    transportation: string;
    classroomCode: string;
    classroomName: string;
    isFirstLogin: boolean;
    registrationDate: Timestamp;
}
