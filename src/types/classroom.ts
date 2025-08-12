import { Timestamp } from 'firebase/firestore';

export type Classroom = {
    code: string;
    name: string;
    email: string;
    phoneNumber: string;
    faxNumber: string;
    addressInfo: {
        postalCode: string;
        prefecture: string;
        city: string;
        cityKana: string;
        streetAddress: string;
        streetAddressKana: string;
    };
    adminUid: string;
    createdAt: Timestamp;
    lastLogin: Timestamp;
    leaderLastName: string;
    leaderFirstName: string;
    leaderLastKana: string;
    leaderFirstKana: string;
    minimumWage: number;
    tuitionName: string;
    teacherFeeName: string;
    periodTimeName: string;
};
