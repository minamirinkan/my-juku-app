import { useEffect, useState } from "react";
import { collection, getDocs, query, where, Query, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Student } from "../types/student";

export const useStudents = (classroomCode?: string, customerUid?: string) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);

      try {
        const studentsRef = collection(db, "students");
        let q: Query<DocumentData> = studentsRef;

        if (customerUid) {
          q = query(studentsRef, where("customerUid", "==", customerUid));
        } else if (classroomCode) {
          q = query(studentsRef, where("classroomCode", "==", classroomCode));
        }
        // どちらもない場合は全件取得

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Student[];

        setStudents(data);
        console.log(`👨‍🎓 Students for customerUid "${customerUid ?? "none"}" classroomCode "${classroomCode ?? "all"}"`, data);
      } catch (err) {
        console.error("❌ Error fetching students:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classroomCode, customerUid]);

  return { students, loading };
};
