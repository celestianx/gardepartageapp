'use client';

import type { GardeConfig } from '@/modules/ConfigurationStore/types';

// Slots: 15-min increments. Slot 24 = 6h00, slot 80 = 20h00.
// slot = (hour * 4) + (minutes / 15)
const SLOT_START = 24; // 6:00
const SLOT_END = 80;   // 20:00 (exclusive: last slot displayed is 79 = 19:45)
const SLOTS = Array.from({ length: SLOT_END - SLOT_START }, (_, i) => SLOT_START + i);

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];

function slotToLabel(slot: number): string {
  const totalMins = slot * 15;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

type Props = {
  config: GardeConfig;
  onChange: (config: GardeConfig) => void;
  errors: string[];
};

export default function Step3Hours({ config, onChange, errors }: Props) {
  function getSlots(scheduleId: string, day: number, childId: string): number[] {
    const schedule = config.weekSchedules.find((s) => s.id === scheduleId);
    if (!schedule) return [];
    const dayEntries = schedule.days[day] ?? [];
    return dayEntries.find((e) => e.childId === childId)?.slots ?? [];
  }

  function toggleSlot(scheduleId: string, day: number, childId: string, slot: number) {
    const updatedSchedules = config.weekSchedules.map((schedule) => {
      if (schedule.id !== scheduleId) return schedule;

      const currentDayEntries = [...(schedule.days[day] ?? [])];
      const entryIdx = currentDayEntries.findIndex((e) => e.childId === childId);

      let currentSlots: number[];
      if (entryIdx >= 0) {
        currentSlots = [...currentDayEntries[entryIdx].slots];
      } else {
        currentSlots = [];
      }

      const slotIdx = currentSlots.indexOf(slot);
      if (slotIdx >= 0) {
        currentSlots.splice(slotIdx, 1);
      } else {
        currentSlots.push(slot);
        currentSlots.sort((a, b) => a - b);
      }

      if (entryIdx >= 0) {
        currentDayEntries[entryIdx] = { ...currentDayEntries[entryIdx], slots: currentSlots };
      } else {
        currentDayEntries.push({ childId, slots: currentSlots });
      }

      return {
        ...schedule,
        days: { ...schedule.days, [day]: currentDayEntries },
      };
    });

    onChange({ ...config, weekSchedules: updatedSchedules });
  }

  // Hour labels for display (every 4 slots = 1 hour)
  const hourLabels: { slot: number; label: string }[] = [];
  for (let slot = SLOT_START; slot < SLOT_END; slot += 4) {
    hourLabels.push({ slot, label: slotToLabel(slot) });
  }

  if (config.weekSchedules.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        Ajoutez d&apos;abord des semaines types à l&apos;étape 2.
      </div>
    );
  }

  if (config.children.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        Ajoutez d&apos;abord des enfants à l&apos;étape 1.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {errors.length > 0 && (
        <div className="rounded border border-red-200 bg-red-50 p-3 space-y-1">
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-red-700">{e}</p>
          ))}
        </div>
      )}

      {config.weekSchedules.map((schedule) => (
        <section key={schedule.id} className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">
            {schedule.name || 'Semaine sans nom'}{' '}
            <span className="text-sm font-normal text-gray-500">({schedule.weeksPerYear} sem/an)</span>
          </h2>

          {config.children.map((child) => {
            const family = config.families.find((f) => f.id === child.familyId);
            return (
              <div key={child.id} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  {child.name || 'Enfant sans nom'}
                  {family && <span className="text-gray-400 ml-1">({family.name || 'Famille sans nom'})</span>}
                </h3>

                <div className="overflow-x-auto">
                  <table className="text-xs border-collapse">
                    <thead>
                      <tr>
                        <th className="w-12 text-left pr-2 text-gray-400 font-normal"></th>
                        {DAY_NAMES.map((day) => (
                          <th key={day} className="text-center font-medium text-gray-600 pb-1 px-1 w-8">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SLOTS.map((slot) => {
                        const showHour = slot % 4 === 0;
                        return (
                          <tr key={slot} className={slot % 4 === 0 ? 'border-t border-gray-200' : ''}>
                            <td className="pr-2 text-gray-400 text-right w-12 leading-none py-0">
                              {showHour ? slotToLabel(slot) : ''}
                            </td>
                            {DAY_NAMES.map((_, dayIdx) => {
                              const activeSlots = getSlots(schedule.id, dayIdx, child.id);
                              const isActive = activeSlots.includes(slot);
                              return (
                                <td key={dayIdx} className="p-px">
                                  <button
                                    onClick={() => toggleSlot(schedule.id, dayIdx, child.id, slot)}
                                    className={[
                                      'w-7 h-3.5 rounded-sm transition-colors',
                                      isActive
                                        ? 'bg-blue-500 hover:bg-blue-600'
                                        : 'bg-gray-100 hover:bg-gray-200 border border-gray-200',
                                    ].join(' ')}
                                    title={`${DAY_NAMES[dayIdx]} ${slotToLabel(slot)}`}
                                    aria-label={`${DAY_NAMES[dayIdx]} ${slotToLabel(slot)} ${isActive ? 'présent' : 'absent'}`}
                                    aria-pressed={isActive}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <p className="text-xs text-gray-500">
                  {DAY_NAMES.map((dayName, dayIdx) => {
                    const activeSlots = getSlots(schedule.id, dayIdx, child.id);
                    if (activeSlots.length === 0) return null;
                    const hours = (activeSlots.length * 15) / 60;
                    return (
                      <span key={dayIdx} className="mr-3">
                        {dayName} : {hours.toFixed(2)}h
                      </span>
                    );
                  })}
                </p>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
