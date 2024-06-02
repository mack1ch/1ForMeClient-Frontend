import { IClubsTimeTable } from "@/shared/interface/timeTable";

export function countAvailableSlots(timetable: IClubsTimeTable[]): number {
  return timetable.filter((slot) => slot.isAvailable === true).length;
}
