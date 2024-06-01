import { IClub } from "./club";
import { IStudio } from "./studio";
import { IUser } from "./user";

export type TSlotDay = "ПН" | "ВТ" | "СР" | "ЧТ" | "ПТ" | "СБ" | "ВС";

export interface ITrainerSlot {
  id?: number;
  beginning?: IBeggingAndEndSlot; // Время в формате 00:00
  end?: IBeggingAndEndSlot; // Время в формате 00:00
  day: number; // Номер дня в неделе
  trainer?: IUser;
  studio?: IStudio;
}

export interface IBeggingAndEndSlot {
  id: number;
  beginning: string;
  end: string;
}

export interface IClubSlot {
  id: number;
  beginning: string;
  end: string;
  club: IClub;
  isAvailable: boolean;
}

export interface ISlotsForStudio {
  date: string;
  club: IClub;
  clubSlots: IClubSlot[];
}

export interface IMainPartWorkTime {
  slot: IClubSlot[];
  date: string;
  count: number;
}
