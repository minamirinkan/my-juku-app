'use client'
// hooks/useClassroom.ts
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Classroom } from "@/types/types";

export const useClassroom = (classroomCode?: string) => {
    const [classroom, setClassroom] = useState<Classroom | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (!classroomCode) return;

        const fetchClassroom = async () => {
            setLoading(true);
            setError(null);

            try {
                const docRef = doc(db, "classrooms", classroomCode);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setClassroom(docSnap.data() as Classroom);
                } else {
                    setError("Classroom not found");
                }
            } catch (err) {
                console.error("❌ Error fetching classroom:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchClassroom();
    }, [classroomCode]);

    return { classroom, loading, error };
};
