// utils/getUserDataByRole.ts
"use client";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserRole, UserData, UserDataSchema } from "@/types/types";

// コレクション順序（UID重複なし前提）
const roleCollections: { role: Exclude<UserRole, null>; collection: string }[] = [
    { role: "superadmin", collection: "superadmins" },
    { role: "admin", collection: "admins" },
    { role: "teacher", collection: "teachers" },
    { role: "customer", collection: "customers" },
];

/**
 * UIDからユーザーデータを取得してZodでバリデーション
 */
export const getUserDataByRole = async (
    uid: string
): Promise<{ role: UserRole; userData: UserData }> => {
    for (const { role, collection } of roleCollections) {
        const ref = doc(db, collection, uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            const rawData = { uid, role, ...snap.data() };
            const parsed = UserDataSchema.safeParse(rawData);

            if (!parsed.success) {
                console.error("UserDataSchema validation failed", parsed.error);
                throw new Error("ユーザーデータが不正です。");
            }

            return { role, userData: parsed.data };
        }
    }

    throw new Error("ユーザーデータが見つかりませんでした。");
};
