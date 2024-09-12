"use client";

import { fetcher } from "@/shared/api";
import { IStudio } from "@/shared/interface/studio";
import { useState } from "react";
import useSWR from "swr";
import styles from "./ui.module.scss";
import { IClubSchedule, ISchedule } from "@/shared/interface/timeTable";
import { parseDateToDateAndMonth } from "@/shared/lib/parse/date";
import { ClubCard } from "@/entities/schedule-slice/clubCard";
import { LackData } from "@/shared/ui/error-slice/lackData";
import { TabItem } from "@/shared/ui/header-slice/tabs";

const getFreeSlotsCount = (clubSchedule: IClubSchedule): number => {
  return clubSchedule.slots.filter((slot) => slot.isAvailable).length;
};

export const ScheduleRender = () => {
  const [activeStudioID, setActiveStudioID] = useState<number | null>(1);

  const {
    data: studios,
    error: studiosError,
    isLoading: studioIsLoading,
  } = useSWR<IStudio[], Error>("/studios/", fetcher);

  const {
    data: schedule,
    error: scheduleError,
    isLoading: scheduleIsLoading,
  } = useSWR<ISchedule, Error>(
    activeStudioID ? `/studios/${activeStudioID}/timeTable` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const openTab = (studioId: number) => setActiveStudioID(studioId);
  const noSlotsAvailable = schedule?.timeTable.every((timeTable) => {
    return timeTable.clubsTimeTable.every((clubSchedule) => {
      return getFreeSlotsCount(clubSchedule) === 0;
    });
  });
  console.log(schedule);
  return (
    <>
      <div className={styles.tabs}>
        <div className={styles.wrap}>
          {studioIsLoading || studiosError
            ? Array.from({ length: 5 }).map((_, index) => (
                <TabItem isLoading={studioIsLoading} key={index} />
              ))
            : studios?.map((studio) => (
                <TabItem
                  isLoading={studioIsLoading}
                  key={studio.id}
                  id={studio.id}
                  className={activeStudioID === studio.id ? styles.active : ""}
                  onClick={() => openTab(studio.id)}
                >
                  {studio.address}
                </TabItem>
              ))}
        </div>
      </div>
      <div className={styles.slots}>
        {scheduleIsLoading || scheduleError ? (
          <LackData>Свободных слотов нет</LackData>
        ) : noSlotsAvailable ? (
          <LackData>Свободных слотов нет</LackData>
        ) : (
          schedule?.timeTable.map((timeTable, index) => {
            const { day, dayOfWeek, month } = parseDateToDateAndMonth(
              timeTable.date
            );
            const freeSlotsExist = timeTable.clubsTimeTable.some(
              (clubSchedule) => getFreeSlotsCount(clubSchedule)
            );
            if (!freeSlotsExist) return null;

            return (
              <div className={styles.slotGroup} key={index}>
                <h3 className={styles.h3}>
                  {dayOfWeek}, {day} {month.name}
                </h3>
                <div className={styles.renderCards}>
                  {timeTable.clubsTimeTable.map((clubSchedule, clubIndex) => (
                    <ClubCard
                      activeStudioID={activeStudioID || 0}
                      date={timeTable.date}
                      key={clubIndex}
                      clubSlot={clubSchedule}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};
