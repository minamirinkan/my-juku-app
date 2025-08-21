import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Customer } from "@/types/types";

export const useCustomers = (uid?: string, classroomCode?: string) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);

      try {
        if (uid) {
          // 顧客本人（保護者）
          const docRef = doc(db, "customers", uid);
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            const data = snapshot.data();
            setCustomers([{ uid: snapshot.id, ...(data as Omit<Customer, "uid">) }]);
          } else {
            setCustomers([]);
          }
        } else if (classroomCode) {
          // 教室コードで絞る（admin）
          const q = query(collection(db, "customers"), where("classroomCode", "==", classroomCode));
          const snapshot = await getDocs(q);
          const data = snapshot.docs.map(doc => {
            const docData = doc.data();
            return { uid: doc.id, ...(docData as Omit<Customer, "uid">) };
          });
          setCustomers(data);
        } else {
          // 全件（superadmin）
          const snapshot = await getDocs(collection(db, "customers"));
          const data = snapshot.docs.map(doc => {
            const docData = doc.data();
            return { uid: doc.id, ...(docData as Omit<Customer, "uid">) };
          });
          setCustomers(data);
        }
      } catch (e) {
        console.error("❌ Error fetching customers:", e);
        setError(e as Error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [uid, classroomCode]);

  return { customers, loading, error };
};
