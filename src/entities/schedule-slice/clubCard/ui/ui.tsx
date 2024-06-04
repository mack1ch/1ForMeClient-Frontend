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
import useSWR from "swr";
import { IUser } from "@/shared/interface/user";
import { fetcher } from "@/shared/api";
import { setChosenSlotTime } from "@/shared/redux/slices/chosenSlotTime";

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
  const handleSlotClick = (trainer: IUser, slotTime: string) => {
    dispatch(resetStore());

    dispatch(setAvailableTrainers(trainer));
    dispatch(setChosenSlotTime(slotTime));
  };
  const { data: allTrainers } = useSWR<IUser[], Error>(
    "/users?role=trainer",
    fetcher
  );
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

      {allTrainers?.map((trainer) => {
        if (
          clubSlot.slots.map((slot) =>
            slot.trainersAvailable?.some(
              (availableTrainer) => availableTrainer.id == trainer.id
            )
          )
        ) {
          return (
            <>
              <div className={styles.trainerCard} key={trainer.id}>
                <div className={styles.trainer}>
                  <span
                    className={styles.avatar}
                    style={{ backgroundImage: `url(${trainer.avatar})` }}
                  />
                  <div className={styles.trainerInfo}>
                    <h4 className={styles.h4}>
                      {trainer.surname + " " + trainer.name}
                    </h4>
                    <p className={styles.p}>
                      {trainer.trainerProfile.description}
                    </p>
                  </div>
                </div>
                <div className={styles.tags}>
                  {clubSlot.slots
                    .filter((item) => item.isAvailable)
                    .map((item, index) => (
                      <Link
                        onClick={() => handleSlotClick(trainer, item.beginning)}
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
              </div>
            </>
          );
        }
      })}
    </article>
  );
};
