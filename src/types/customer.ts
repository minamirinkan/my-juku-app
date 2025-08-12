import { Timestamp } from "firebase/firestore";

export type Customer = {
  uid: string;
  email: string;
  classroomCode: string;
  guardianFirstName: string;
  guardianFirstNameKana: string;
  guardianLastName: string;
  guardianLastNameKana: string;
  guardianfullName: string;
  guardianfullNameKana: string;
  isFirstLogin: boolean;
  phoneNumber: string;
  role: string;
  studentIds: string[]; // e.g., ["s0240006", "s0470011"]
  createdAt: Timestamp; // Timestamp
};
