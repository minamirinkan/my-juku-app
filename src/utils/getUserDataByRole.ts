// utils/getUserDataByRole.ts

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserData, UserRole } from "@/types/user";

// 検索順に注意（特に重複UIDがない前提）
const roleCollections: { role: Exclude<UserRole, null>; collection: string }[] = [
    { role: "superadmin", collection: "superadmins" },
    { role: "admin", collection: "admins" },
    { role: "teacher", collection: "teachers" },
    { role: "customer", collection: "customers" },
];

export const getUserDataByRole = async (
    uid: string
): Promise<{ role: UserRole; userData: UserData }> => {
    for (const { role, collection } of roleCollections) {
        const ref = doc(db, collection, uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            return {
                role,
                userData: {
                    uid,
                    ...snap.data(),
                    role,
                } as UserData,
            };
        }
    }

    throw new Error("ユーザーデータが見つかりませんでした。");
};
