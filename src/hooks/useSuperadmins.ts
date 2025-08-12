import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Superadmin } from '../types/superadmin';

export function useSuperadmins() {
    const [superadmins, setSuperadmins] = useState<Superadmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const fetchSuperadmins = async () => {
            setLoading(true);
            setError(null);
            try {
                const snapshot = await getDocs(collection(db, 'superadmins'));
                const list = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        uid: data.uid,
                        name: data.name,
                        email: data.email,
                        role: data.role,
                        createdAt: data.createdAt,
                        lastLogin: data.lastLogin,
                    } as Superadmin;
                });
                setSuperadmins(list);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };
        fetchSuperadmins();
    }, []);

    return { superadmins, loading, error };
}
