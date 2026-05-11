import type { WeekSchedule, Family, Child, ScheduleResult, SlotPresence } from './types';

export function compute(
  weekSchedules: WeekSchedule[],
  families: Family[],
  children: Child[]
): ScheduleResult {
  const familyIds = families.map(f => f.id);

  let nounouAnnualHours = 0;
  const familyAnnualHours: Record<string, number> = Object.fromEntries(familyIds.map(id => [id, 0]));
  const slotPresences: SlotPresence[] = [];

  for (const ws of weekSchedules) {
    for (const [dayStr, daySchedules] of Object.entries(ws.days)) {
      const day = Number(dayStr);

      const allSlots = new Set<number>();
      const slotToChildren = new Map<number, string[]>();

      for (const ds of daySchedules) {
        for (const slot of ds.slots) {
          allSlots.add(slot);
          if (!slotToChildren.has(slot)) slotToChildren.set(slot, []);
          slotToChildren.get(slot)!.push(ds.childId);
        }
      }

      nounouAnnualHours += (allSlots.size * 15 / 60) * ws.weeksPerYear;

      for (const familyId of familyIds) {
        const familyChildren = children.filter(c => c.familyId === familyId).map(c => c.id);
        const familySlots = new Set<number>();
        for (const ds of daySchedules) {
          if (familyChildren.includes(ds.childId)) {
            for (const slot of ds.slots) familySlots.add(slot);
          }
        }
        familyAnnualHours[familyId] += (familySlots.size * 15 / 60) * ws.weeksPerYear;
      }

      for (const [slot, childIds] of slotToChildren.entries()) {
        slotPresences.push({ slot, day, weekScheduleId: ws.id, childIds });
      }
    }
  }

  return { nounouAnnualHours, familyAnnualHours, slotPresences };
}
