import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Admin } from "../types/admin";
import { useAuth } from "@/contexts/AuthContext"; // classroomCode と role を取得

export function useAdmins() {
  const { user, role, loading: authLoading } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const classroomCode = user?.classroomCode;

  useEffect(() => {
    const fetchAdmins = async () => {
      if (authLoading) return;

      setLoading(true);
      setError(null);

      try {
        const ref = collection(db, "admins");
        const q =
          role === "superadmin" || !classroomCode
            ? ref
            : query(ref, where("classroomCode", "==", classroomCode));

        const snapshot = await getDocs(q);
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
          } as Admin;
        });

        setAdmins(list);
        console.log(`🛠 Admins for role="${role}" classroomCode="${classroomCode}"`, list);
      } catch (e) {
        console.error("❌ Failed to fetch admins:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [role, classroomCode, authLoading]);

  return { admins, loading, error };
}
