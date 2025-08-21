"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { FirebaseError } from "firebase/app";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("メールアドレスとパスワードを入力してください");
            return;
        }

        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 管理者データの取得（adminsコレクション）
            const adminRef = doc(db, "admins", user.uid);
            const adminSnap = await getDoc(adminRef);

            if (!adminSnap.exists()) {
                alert("管理者データが見つかりません");
                await signOut(auth);
                return;
            }

            const adminData = adminSnap.data();
            const role = adminData.role;
            const classroomCode = adminData.classroomCode;

            // ロールチェック
            if (role !== "superadmin" && role !== "admin") {
                alert("このアカウントには管理者権限がありません");
                await signOut(auth);
                return;
            }

            // lastLogin 更新
            await updateDoc(adminRef, { lastLogin: serverTimestamp() });
            if (classroomCode) {
                const classroomRef = doc(db, "classrooms", classroomCode);
                await updateDoc(classroomRef, { lastLogin: serverTimestamp() });
            }

            // ロールに応じて遷移
            if (role === "superadmin") {
                alert("SuperAdminとしてログイン成功");
                router.push("/superadmin/dashboard");
            } else {
                alert("Adminとしてログイン成功");
                router.push("/admin/dashboard");
            }
        } catch (error: unknown) {
            const err = error as FirebaseError;
            if (err.code === "auth/user-not-found") {
                alert("ユーザーが見つかりません");
            } else if (err.code === "auth/wrong-password") {
                alert("パスワードが間違っています");
            } else if (err.code === "auth/invalid-email") {
                alert("メールアドレスの形式が正しくありません");
            } else if (err.code === "auth/invalid-credential") {
                alert("認証情報が無効です。再度お試しください。");
            } else {
                alert("ログイン失敗: " + (err.message ?? "不明なエラー"));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-3xl font-bold mb-8 text-center text-blue-600">
                    管理者ログイン
                </h2>

                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-md p-3 w-full mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-md p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
                <button
                    onClick={handleLogin}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition ${loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={loading}
                >
                    {loading ? "ログイン中..." : "ログイン"}
                </button>
            </div>
        </div>
    );
}
