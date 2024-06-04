import { instance } from "@/shared/api";
import { ITariff } from "@/shared/interface/tariff";
import { IUser } from "@/shared/interface/user";
import { IFormData, ITrainings } from "../interface";
import { ISubscription } from "@/shared/interface/subscription";
import { convertDateFormatToDashFormat } from "@/shared/lib/parse/date";
import { IClubSlot } from "@/shared/interface/slots";
import { IClub } from "@/shared/interface/club";
import { parseNameToNameAndSurname } from "@/shared/lib/parse/user";

export const getTariffs = async (): Promise<ITariff[] | Error> => {
  try {
    const { data }: { data: ITariff[] } = await instance.get(
      `/users/trainers/my/tariffs?isForSubscription=1`
    );
    return data;
  } catch (error) {
    return error as Error;
  }
};

export const postSubscription = async (
  formData: IFormData,
  trainings: ITrainings[],
  selectedSlots: { [key: string]: number | null }
): Promise<ISubscription | Error> => {
  try {
    const createTrainingDto = trainings.map((item, index) => {
      const slot = item.date && selectedSlots[item.date];
      return {
        date: convertDateFormatToDashFormat(item.date || ""),
        slot: slot || 0,
        club: formData.clubID || 0,
      };
    });

    const { data }: { data: ISubscription } = await instance.post(
      `/subscriptions/clientForm`,
      {
        trainerId: formData.trainerID,
        createTrainingDto,
        tariff: formData.tariffID,
        createClient: {
          name: parseNameToNameAndSurname(formData.userName)[0],
          surname: parseNameToNameAndSurname(formData.userName)[1],
          role: "client",
          phone: formData.userPhone,
          chatType: formData.userChatTypeID,
          userNameInMessenger: formData.userNameInMessenger,
        },
      }
    );
    return data;
  } catch (error) {
    return error as Error;
  }
};

export const getSlots = async (
  date: string,
  clubID: number | string
): Promise<IClubSlot[] | Error> => {
  try {
    const { data }: { data: IClubSlot[] } = await instance.get(
      `/clubs/${clubID}/slots?date=${convertDateFormatToDashFormat(date)}`
    );
    return data;
  } catch (error) {
    return error as Error;
  }
};
