export type CalendarPopupProps = {
    classroomCode: string | null;
    onDateSelect?: (dateInfo: {
      type: 'date' | 'weekday';
      year: number;
      month: number;
      date?: number;
      weekday: string;
    }) => void;
    confirmedDates?: string[];
  };
  
  export type CalendarPopupState = {
    showCalendar: boolean;
    year: number;
    month: number;
    selectedDate: number | null;
    today: number;
    selectedWeekday: number | null;
    savedDates: Set<string>;
    holidayDates: Set<string>;
  };
  