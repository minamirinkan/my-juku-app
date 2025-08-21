"use client"; // クライアントコンポーネントとして明示

import { createContext, useContext, useState } from "react";
import type { ClassroomSelectionContextType } from "@/types/contextTypes";

const ClassroomSelectionContext = createContext<ClassroomSelectionContextType | undefined>(undefined);

export const ClassroomSelectionProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedClassroomCodes, setSelectedClassroomCodes] = useState<string[]>([]);

    return (
        <ClassroomSelectionContext.Provider value={{ selectedClassroomCodes, setSelectedClassroomCodes }}>
            {children}
        </ClassroomSelectionContext.Provider>
    );
};

export const useClassroomSelection = () => {
    const context = useContext(ClassroomSelectionContext);
    if (!context) throw new Error("useClassroomSelection must be used within a ClassroomSelectionProvider");
    return context;
};
