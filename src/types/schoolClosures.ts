// types/schoolClosures.ts
export type SchoolClosureType = 'holiday' | 'customClose';

export type SchoolClosure = {
    date: string; // "YYYY-MM-DD"
    name: string;
    type: SchoolClosureType;
};

export type SchoolClosuresDocument = {
    closures: SchoolClosure[];
    deletedClosures: SchoolClosure[];
    updatedAt: Date;
};
