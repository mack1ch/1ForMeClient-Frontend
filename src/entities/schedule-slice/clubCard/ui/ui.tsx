import Image from "next/image";
import styles from "./ui.module.scss";
import Plus from "../../../../../public/icons/schedule/plus.svg";
import Link from "next/link";
import { IClubSchedule } from "@/shared/interface/timeTable";
import { useAppDispatch } from "@/shared/redux/store";
import {
  resetStore,
  setAvailableTrainers,
} from "@/shared/redux/slices/availableTrainers";
import { countAvailableSlots } from "../model";

export const ClubCard = ({
  clubSlot,
  date,
  activeStudioID,
}: {
  clubSlot: IClubSchedule;
  date: string;
  activeStudioID: number;
}) => {
  const dispatch = useAppDispatch();
  const handleSlotClick = (slotID: number) => {
    dispatch(resetStore());
    dispatch(setAvailableTrainers(clubSlot.slots[slotID].trainersAvailable));
  };
  function isAnySlotAvailable(schedule: IClubSchedule): boolean {
    for (const slot of schedule.slots) {
      if (slot.isAvailable === true) {
        return true;
      }
    }
    return false;
  }
  if (isAnySlotAvailable(clubSlot) === false) return false;

  return (
    <article className={styles.clubCard}>
      <div className={styles.info}>
        <div className={styles.info__text}>
          <h4 className={styles.name}>{clubSlot.club.name}</h4>
          <h5 className={styles.freeSlots}>
            {countAvailableSlots(clubSlot.slots)} свободных слотов по часу
          </h5>
        </div>
      </div>
      <div className={styles.tags}>
        {clubSlot.slots
          .filter((item) => item.isAvailable)
          .map((item, index) => (
            <Link
              onClick={() => handleSlotClick(item.slotId)}
              key={index}
              className={styles.tag}
              href={`newtraining/${
                date +
                "slash" +
                clubSlot.club.id +
                "slash" +
                item.slotId +
                "shash" +
                activeStudioID
              }`}
            >
              {item.beginning}
              <Image src={Plus} width={16} height={16} alt="Plus" />
            </Link>
          ))}
      </div>
    </article>
  );
};
