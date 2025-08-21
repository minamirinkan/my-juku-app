'use client'

import { useEffect, useState } from 'react';
import { collection, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Classroom } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';

export function useClassrooms() {
  const { loading: authLoading } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (authLoading) return;

    const fetchClassrooms = async () => {
      setLoading(true);
      setError(null);

      try {
        const snapshot: QuerySnapshot<DocumentData> = await getDocs(collection(db, 'classrooms'));
        const list = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            uid: data.uid,
            name: data.name,
            email: data.email,
            role: data.role,
            classroomCode: data.classroomCode,
            createdAt: data.createdAt,
            lastLogin: data.lastLogin,
          } as Classroom;
        });

        setClassrooms(list);
        console.log(`🏫 All classrooms fetched`, list);
      } catch (e) {
        console.error('❌ Error fetching classrooms:', e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [authLoading]);

  return { classrooms, loading, error };
}
