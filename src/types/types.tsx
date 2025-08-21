import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';
import { User as FirebaseUser } from "firebase/auth";

export const timestampSchema = z
    .instanceof(Timestamp)
    .optional()
    .transform((val) => val?.toDate());
// FirestoreやFirebase Authから取得するユーザー情報
export const UserSchema = z.object({
    uid: z.string(),
    email: z.string(),
});

// 認証・パスワード関連で使うユーザー情報
export const AuthUserSchema = UserSchema.extend({
    password: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;

export const AdminSchema = UserSchema.extend({
    role: z.enum(['admin', 'superadmin']),
    classroomCode: z.string(),
    name: z.string(),
    createdAt: timestampSchema,
    lastLogin: timestampSchema,
});

export type Admin = z.infer<typeof AdminSchema>;
export type SuperAdmin = z.infer<typeof AdminSchema>;

export const classrommSchema = UserSchema.extend({
    uid: z.string(),
    role: z.enum(['admin', 'superadmin']),
    classroomCode: z.string(),
    name: z.string(),
    createdAt: timestampSchema,
    lastLogin: timestampSchema,
});

export type Classroom = z.infer<typeof classrommSchema>;

export const courseSchema = z.object({
    classType: z.string(),
    duration: z.string(),
    endMonth: z.string(),
    endYear: z.string(),
    kind: z.string(),
    note: z.string(),
    period: z.string(),
    startMonth: z.string(),
    startYear: z.string(),
    subject: z.string(),
    subjectOther: z.string(),
    times: z.string(),
    weekday: z.string(),
});

export type Course = z.infer<typeof courseSchema>;

export const basedStudentSchema = z.object({
    id: z.string().optional(),
    uid: z.string().optional(),
    studentId: z.string().optional(),
    fullname: z.string(),
    fullnameKana: z.string(),
    lastName: z.string(),
    firstName: z.string(),
    lastNameKana: z.string(),
    firstNameKana: z.string(),
    gender: z.string(),
    birthDate: z.string(),
    grade: z.string(),
    schoolName: z.string(),
    schoolKana: z.string(),
    schoolLevel: z.enum(["小学校", "中学校", "高等学校", ""]),
    schoolType: z.enum(["国立", "公立", "私立", "通信制", ""]),
    schoolingStatus: z.enum(["未就学児", "在学生", "既卒生", ""]).optional(),
    classroomCode: z.string(),
    classroomName: z.string(),
    customerUid: z.string(),
    entryDate: z.string(),
    postalCode: z.string(),
    prefecture: z.string(),
    city: z.string(),
    cityKana: z.string(),
    streetAddress: z.string(),
    streetAddressKana: z.string(),
    buildingName: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    guardianfullName: z.string(),
    guardianfullNameKana: z.string(),
    guardianLastName: z.string(),
    guardianFirstName: z.string(),
    guardianLastNameKana: z.string(),
    guardianFirstNameKana: z.string(),
    guardianPhone: z.string(),
    guardianEmail: z.string(),
    relationship: z.string(),
    emergencyContact: z.string(),
    remarks: z.string().optional(),
    status: z.string(),
    registrationDate: timestampSchema,
    courses: z.array(courseSchema).optional(),
    courseFormData: z.unknown().optional(),
    billingStatus: z.string().optional(),
});

export type BasedStudent = z.infer<typeof basedStudentSchema>;

// =======================
// Student Schema (= BasedStudent)
// =======================
export const studentSchema = basedStudentSchema;
export type Student = z.infer<typeof studentSchema>;

// =======================
// RowStudent Schema
// =======================
export const rowStudentSchema = basedStudentSchema.extend({
    originRow: z.number(),
    originPeriod: z.number(),
});

export type RowStudent = z.infer<typeof rowStudentSchema>;

// ユーザーデータのZodスキーマ
export const UserDataSchema = z.object({
    uid: z.string(),
    email: z.string().optional(),
    name: z.string().optional(),
    classroomCode: z.string().optional(),
    role: z.enum(["superadmin", "admin", "teacher", "customer"]),
});

export type UserData = z.infer<typeof UserDataSchema>;
export type UserRole = UserData["role"];
export type ClassroomCode = UserData["classroomCode"]

export const CustomerSchema = z.object({
    uid: z.string(),
    role: z.literal("customer"), // ここは固定値
    classroomCode: z.string(),
    createdAt: timestampSchema,
    email: z.string().optional(),
    guardianFirstName: z.string().optional(),
    guardianFirstNameKana: z.string().optional(),
    guardianLastName: z.string().optional(),
    guardianLastNameKana: z.string().optional(),
    guardianfullName: z.string().optional(),
    guardianfullNameKana: z.string().optional(),
    isFirstLogin: z.boolean(),
    phoneNumber: z.string().optional(),
    studentIds: z.array(z.string()).optional(),
});

export type Customer = z.infer<typeof CustomerSchema>;

export const PeriodLabelSchema = z.object({
    label: z.string(), // 例: "1限"
    time: z.string(),  // 例: "09:50〜11:10"
});

export const PeriodLabelsBySchoolSchema = z.object({
    periodLabels: z.array(PeriodLabelSchema),
});

export type PeriodLabel = z.infer<typeof PeriodLabelSchema>;
export type PeriodLabelsBySchool = z.infer<typeof PeriodLabelsBySchoolSchema>;

export const ClosureSchema = z.object({
    date: z.string(), // "2025-01-01" など
    name: z.string(), // "元日" など
    type: z.enum(["holiday", "customClose"]),
});

export const SchoolClosuresSchema = z.object({
    closures: z.array(ClosureSchema),
    deletedClosures: z.array(ClosureSchema),
    updatedAt: timestampSchema,
});

export type Closure = z.infer<typeof ClosureSchema>;
export type SchoolClosures = z.infer<typeof SchoolClosuresSchema>;

export type PeriodKey = keyof DailyRow["periods"];

// 1限〜8限の授業データ
export const DailyPeriodDataSchema = z.object({
    grade: z.string(),
    name: z.string(),
    seat: z.string(),
    status: z.string(),      // "予定" | "欠席" | "未定" など
    studentId: z.string(),
    subject: z.string(),
    periods: z.string(),
    classType: z.string(),
    duration: z.string(),
});

export const TeacherDataSchema = z.object({
    code: z.string(),
    name: z.string(),
}).nullable(); // null になる場合もある

export const DailyPeriodsSchema = z.object({
    period1: z.array(DailyPeriodDataSchema),
    period2: z.array(DailyPeriodDataSchema),
    period3: z.array(DailyPeriodDataSchema),
    period4: z.array(DailyPeriodDataSchema),
    period5: z.array(DailyPeriodDataSchema),
    period6: z.array(DailyPeriodDataSchema),
    period7: z.array(DailyPeriodDataSchema),
    period8: z.array(DailyPeriodDataSchema),
});

export const DailyRowSchema = z.object({
    periods: DailyPeriodsSchema,
    status: z.string(),
    teacher: TeacherDataSchema,
});

export const DailyScheduleSchema = z.object({
    id: z.string(),
    rows: z.array(DailyRowSchema),
    updatedAt: timestampSchema,
});

export type DailyPeriodData = z.infer<typeof DailyPeriodDataSchema>;
export type TeacherData = z.infer<typeof TeacherDataSchema>;
export type DailyRow = z.infer<typeof DailyRowSchema>;
export type DailySchedule = z.infer<typeof DailyScheduleSchema>;

export const makeupLessonSchema = z.object({
    grade: z.string(),
    name: z.string(),
    period: z.number(),
    seat: z.string(),
    status: z.string(),
    studentId: z.string(),
    subject: z.string(),
    classType: z.string(),
    duration: z.string(),
});

export type MakeupLesson = z.infer<typeof makeupLessonSchema>;

export interface AuthContextType {
    user: FirebaseUser | null;
    role: UserRole | null;
    userData: UserData | null;
    classroomCode: string | null;
    loading: boolean;
}
