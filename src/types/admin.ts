import { Timestamp } from 'firebase/firestore';

export type Admin = {
    uid: string;
    name: string;
    email: string;
    role: 'admin';
    classroomCode: string;
    classroomName: string;
    createdAt: Timestamp;
    lastLogin: Timestamp;
};
