import { useEffect, useState } from "react";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WeeklyScheduleDocument } from "../types/weeklySchedule";

export const useWeeklySchedules = (classroomCode?: string) => {
  const [schedules, setSchedules] = useState<WeeklyScheduleDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklySchedules = async () => {
      try {
        const weeklyRef = collection(db, "weeklySchedules");
        const snapshot = await getDocs(weeklyRef);

        const result: WeeklyScheduleDocument[] = [];

        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const id = doc.id;
          const codePrefix = id.slice(0, 3); // classroomCode の先頭3文字

          if (!classroomCode || codePrefix === classroomCode) {
            const data = doc.data();
            result.push({
              id,
              rows: data.rows ?? [],
            });
          }
        });

        setSchedules(result);
        console.log("✅ WeeklySchedules fetched:", result); // ← 確認用ログ
      } catch (err) {
        console.error("Error fetching weekly schedules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklySchedules();
  }, [classroomCode]);

  return { schedules, loading };
};
