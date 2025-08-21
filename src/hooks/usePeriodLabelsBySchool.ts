import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PeriodLabel } from "@/types/types";

export const usePeriodLabelsByClassroomCode = (classroomCode?: string) => {
  const [labels, setLabels] = useState<PeriodLabel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeriodLabels = async () => {
      if (!classroomCode) return;

      try {
        // ① 教室固有の periodLabels を取得
        const docRef = doc(db, "periodLabelsBySchool", classroomCode);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setLabels(data.periodLabels ?? []);
          console.log(`🏫 periodLabelsBySchool/${classroomCode}:`, data.periodLabels);
        } else {
          // ② なければ共通（default）の periodLabels を取得
          console.warn(`⚠️ periodLabels for "${classroomCode}" not found. Trying fallback...`);
          const fallbackRef = doc(db, "common", "periodLabels");
          const fallbackSnap = await getDoc(fallbackRef);

          if (fallbackSnap.exists()) {
            const fallbackData = fallbackSnap.data();
            setLabels(fallbackData.periodLabels ?? []);
            console.log("📦 fallback common/periodLabels:", fallbackData.periodLabels);
          } else {
            console.warn("⚠️ common/periodLabels not found either");
            setLabels([]);
          }
        }
      } catch (err) {
        console.error("🔥 Error fetching period labels:", err);
        setLabels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodLabels();
  }, [classroomCode]);

  return { labels, loading };
};
