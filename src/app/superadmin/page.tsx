'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase'; // パスは環境に合わせて調整してください
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

const SuperAdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            alert('メールアドレスとパスワードを入力してください');
            return;
        }
        setLoading(true);
        try {
            await setPersistence(auth, browserSessionPersistence);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userRef = doc(db, 'superadmins', user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                alert('ユーザー情報が見つかりません');
                await signOut(auth);
                setLoading(false);
                return;
            }

            const userData = userSnap.data();
            if (userData.role !== 'superadmin') {
                alert('このアカウントにはSuperAdminの権限がありません');
                await signOut(auth);
                setLoading(false);
                return;
            }

            alert('SuperAdminとしてログイン成功！');
            router.push('/superadmin/dashboard');

        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/user-not-found') {
                    alert('ユーザーが見つかりません');
                } else if (error.code === 'auth/wrong-password') {
                    alert('パスワードが間違っています');
                } else if (error.code === 'auth/invalid-email') {
                    alert('メールアドレスの形式が正しくありません');
                } else if (error.code === 'auth/invalid-credential') {
                    alert('認証情報が無効です。再度お試しください。');
                } else {
                    alert('ログイン失敗: ' + error.message);
                }
            } else {
                alert('予期しないエラーが発生しました');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-3xl font-bold mb-8 text-center text-red-600">
                    SuperAdmin ログイン
                </h2>

                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-md p-3 w-full mb-5 focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-md p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={loading}
                />
                <button
                    onClick={handleLogin}
                    className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={loading}
                >
                    {loading ? 'ログイン中...' : 'ログイン'}
                </button>
            </div>
        </div>
    );
};

export default SuperAdminLogin;
