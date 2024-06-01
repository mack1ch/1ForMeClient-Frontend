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
  for (const slot of clubSlot.slots) {
    if (slot.isAvailable === false) {
      return undefined;
    }
  }
  return (
    <article className={styles.clubCard}>
      <div className={styles.info}>
        <div className={styles.info__text}>
          <h4 className={styles.name}>{clubSlot.club.name}</h4>
          <h5 className={styles.freeSlots}>
            {clubSlot.slots.length} свободных слотов по часу
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
