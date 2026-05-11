export type SlotIndex = number;

export type DaySchedule = {
  childId: string;
  slots: SlotIndex[];
};

export type WeekSchedule = {
  id: string;
  name: string;
  weeksPerYear: number;
  days: Record<number, DaySchedule[]>;
};

export type Child = {
  id: string;
  familyId: string;
  name: string;
};

export type Family = {
  id: string;
  name: string;
};

export type SlotPresence = {
  slot: SlotIndex;
  day: number;
  weekScheduleId: string;
  childIds: string[];
};

export type ScheduleResult = {
  nounouAnnualHours: number;
  familyAnnualHours: Record<string, number>;
  slotPresences: SlotPresence[];
};
