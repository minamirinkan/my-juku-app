import { useEffect, useState } from 'react';
import { collection, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Classroom } from '@/types/classroom';
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
            code: data.code,
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            faxNumber: data.faxNumber,
            addressInfo: {
              postalCode: data.addressInfo?.postalCode || '',
              prefecture: data.addressInfo?.prefecture || '',
              city: data.addressInfo?.city || '',
              cityKana: data.addressInfo?.cityKana || '',
              streetAddress: data.addressInfo?.streetAddress || '',
              streetAddressKana: data.addressInfo?.streetAddressKana || '',
            },
            adminUid: data.adminUid,
            createdAt: data.createdAt,
            lastLogin: data.lastLogin,
            leaderLastName: data.leaderLastName,
            leaderFirstName: data.leaderFirstName,
            leaderLastKana: data.leaderLastKana,
            leaderFirstKana: data.leaderFirstKana,
            minimumWage: data.minimumWage,
            tuitionName: data.tuitionName,
            teacherFeeName: data.teacherFeeName,
            periodTimeName: data.periodTimeName,
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
