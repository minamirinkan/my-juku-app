import { Timestamp } from 'firebase/firestore';

export type Superadmin = {
    uid: string;
    name: string;
    email: string;
    role: 'superadmin';
    classroomCode: string;
    createdAt: Timestamp
    lastLogin: Timestamp
};
