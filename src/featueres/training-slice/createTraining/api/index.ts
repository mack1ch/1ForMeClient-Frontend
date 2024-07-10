import { ITraining } from "@/shared/interface/training";
import { IFormData, ITrainingsResponse } from "../interface";
import { instance } from "@/shared/api";
import { convertDateFormatToDashFormat } from "@/shared/lib/parse/date";
import { parseNameToNameAndSurname } from "@/shared/lib/parse/user";

export const createTraining = async (
  formData: IFormData
): Promise<ITrainingsResponse | Error> => {
  try {
    const { data }: { data: ITrainingsResponse } = await instance.post(
      `/trainings/clientForm`,
      {
        slot: formData.slotID,
        date: convertDateFormatToDashFormat(formData.date.toString()),
        club: formData.clubID,
        clients: formData.clients,
        tariff: formData.tariffID,
        trainerId: formData.trainerID,
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
