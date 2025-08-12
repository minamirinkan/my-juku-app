import { Timestamp } from "firebase/firestore";

export type Course = {
    classType: string;
    duration: string;
    endMonth: string;
    endYear: string;
    kind: string;
    note: string;
    period: string;
    startMonth: string;
    startYear: string;
    subject: string;
    subjectOther: string;
    times: string;
    weekday: string;
};

export type BasedStudent = {
    id?: string;
    uid?: string;
    studentId?: string;
    fullname: string;
    fullnameKana: string;
    lastName: string;
    firstName: string;
    lastNameKana: string;
    firstNameKana: string;
    gender: string;
    birthDate: string;
    grade: string;
    schoolName: string;
    schoolKana: string;
    schoolLevel: '小学校' | '中学校' | '高等学校' | '';
    schoolType: '国立' | '公立' | '私立' | '通信制' | '';
    schoolingStatus?: '未就学児' | '在学生' | '既卒生' | '';
    classroomCode: string;
    classroomName: string;
    customerUid: string;
    entryDate: string;
    postalCode: string;
    prefecture: string;
    city: string;
    cityKana: string;
    streetAddress: string;
    streetAddressKana: string;
    buildingName: string;
    email?: string;
    phone?: string;
    guardianfullName: string;
    guardianfullNameKana: string;
    guardianLastName: string;
    guardianFirstName: string;
    guardianLastNameKana: string;
    guardianFirstNameKana: string;
    guardianPhone: string;
    guardianEmail: string;
    relationship: string;
    emergencyContact: string;
    remarks?: string;
    status: string;
    registrationDate: Timestamp;
    courses?: Course[];  // ここをanyから具体的型に
    courseFormData?: unknown;  // 中身不明なのでunknownにしておく
    billingStatus?: string;
};

export type Student = BasedStudent;

export type RowStudent = BasedStudent & {
    originRow: number;
    originPeriod: number;
};
