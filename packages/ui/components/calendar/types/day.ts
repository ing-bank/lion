export declare interface Day {
  weekOrder?: number;
  central?: boolean;
  date: Date;
  startOfWeek?: boolean;
  selected?: boolean;
  previousMonth?: boolean;
  currentMonth?: boolean;
  nextMonth?: boolean;
  past?: boolean;
  today?: boolean;
  future?: boolean;
  disabled?: boolean;
  tabindex?: string;
  ariaPressed?: string;
  ariaCurrent?: string | undefined;
}

export declare interface Week {
  days: Day[];
}

export declare interface Month {
  weeks: Week[];
}
