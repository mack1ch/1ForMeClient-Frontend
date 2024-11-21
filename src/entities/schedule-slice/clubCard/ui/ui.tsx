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
    return schedule.slots.some((slot) => slot.isAvailable === true);
  }

  if (!isAnySlotAvailable(clubSlot)) return null;

  // Собираем тренеров, у которых есть доступные слоты
  const trainersWithSlots = allTrainers
    ?.map((trainer) => ({
      trainer,
      availableSlots: clubSlot.slots.filter((slot) =>
        slot.trainersAvailable?.some(
          (availableTrainer) => availableTrainer.id === trainer.id
        )
      ),
    }))
    .filter(({ availableSlots }) => availableSlots.length > 0); // Оставляем только тех, у кого есть доступные слоты

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

      {trainersWithSlots?.map(({ trainer, availableSlots }) => (
        <div className={styles.trainerCard} key={trainer.id}>
          <div className={styles.trainer}>
            <span
              className={styles.avatar}
              style={{ backgroundImage: `url(${trainer.avatar})` }}
            />
            <div className={styles.trainerInfo}>
              <div className={styles.row}>
                <h4 className={styles.h4}>
                  {trainer.name} {trainer.surname}
                </h4>
                {trainer.trainerProfile?.category && (
                  <span className={styles.category}>
                    {trainer.trainerProfile.category}
                  </span>
                )}
              </div>
              <p className={styles.p}>{trainer.trainerProfile?.description}</p>
            </div>
          </div>
          <div className={styles.tags}>
            {availableSlots.map((slot) => (
              <Link
                onClick={() => handleSlotClick(trainer, slot.beginning)}
                key={slot.slotId}
                className={styles.tag}
                href={`newtraining/${
                  date +
                  "slash" +
                  clubSlot.club.id +
                  "slash" +
                  slot.slotId +
                  "slash" +
                  activeStudioID +
                  "slash" +
                  trainer.id
                }`}
              >
                {slot.beginning}
                <Image src={Plus} width={16} height={16} alt="Plus" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </article>
  );
};
