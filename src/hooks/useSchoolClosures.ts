// hooks/useSchoolClosures.ts
import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SchoolClosures, Closure } from '@/types/types';

export const useSchoolClosures = (year: string, classroomCode?: string) => {
    const [closures, setClosures] = useState<Closure[]>([]);
    const [deletedClosures, setDeletedClosures] = useState<Closure[]>([]);
    const [updatedAt, setUpdatedAt] = useState<Timestamp | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);

    const getDocRef = useCallback(() => {
        return classroomCode
            ? doc(db, 'classrooms', classroomCode, 'closures', year)
            : doc(db, 'schoolClosures', year);
    }, [classroomCode, year]);

    useEffect(() => {
        const fetchClosures = async () => {
            setLoading(true);
            try {
                const ref = getDocRef();
                const snapshot = await getDoc(ref);

                if (snapshot.exists()) {
                    const data = snapshot.data() as SchoolClosures;
                    setClosures(data.closures || []);
                    setDeletedClosures(data.deletedClosures || []);
                    if (data.updatedAt instanceof Timestamp) {
                        setUpdatedAt(data.updatedAt);
                    }
                } else {
                    setClosures([]);
                    setDeletedClosures([]);
                    setUpdatedAt(null);
                }
            } catch (err) {
                console.error('Failed to fetch school closures:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchClosures();
    }, [getDocRef]);

    const saveClosures = async (newClosures: Closure[], newDeletedClosures: Closure[]) => {
        const ref = getDocRef();
        await setDoc(ref, {
            closures: newClosures,
            deletedClosures: newDeletedClosures,
            updatedAt: serverTimestamp(),
        });
        setClosures(newClosures);
        setDeletedClosures(newDeletedClosures);
    };

    const addClosure = async (closure: Closure) => {
        const updated = [...closures, closure];
        await updateDoc(getDocRef(), {
            closures: updated,
            updatedAt: serverTimestamp(),
        });
        setClosures(updated);
    };

    const removeClosure = async (date: string) => {
        const target = closures.find((c) => c.date === date);
        if (!target) return;
        const updatedClosures = closures.filter((c) => c.date !== date);
        const updatedDeleted = [...deletedClosures, target];
        await updateDoc(getDocRef(), {
            closures: updatedClosures,
            deletedClosures: updatedDeleted,
            updatedAt: serverTimestamp(),
        });
        setClosures(updatedClosures);
        setDeletedClosures(updatedDeleted);
    };

    return {
        closures,
        deletedClosures,
        updatedAt,
        loading,
        error,
        saveClosures,
        addClosure,
        removeClosure,
    };
};
