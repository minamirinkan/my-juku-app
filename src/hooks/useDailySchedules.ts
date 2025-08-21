import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DailySchedule } from "@/types/types";

export const useDailySchedules = () => {
  const [schedules, setSchedules] = useState<DailySchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const ref = collection(db, "dailySchedules");
      const snap = await getDocs(ref);
      const result: DailySchedule[] = [];

      snap.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        } as DailySchedule);
      });

      setSchedules(result);
      setLoading(false);
    };

    fetch();
  }, []);

  return { schedules, loading };
};
