import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DailyScheduleDocument } from "../types/dailySchedule";

export const useDailySchedules = () => {
  const [schedules, setSchedules] = useState<DailyScheduleDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const ref = collection(db, "dailySchedules");
      const snap = await getDocs(ref);
      const result: DailyScheduleDocument[] = [];

      snap.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        } as DailyScheduleDocument);
      });

      setSchedules(result);
      setLoading(false);
    };

    fetch();
  }, []);

  return { schedules, loading };
};
