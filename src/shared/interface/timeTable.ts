import { IClub } from "./club";
import { IStudio } from "./studio";
import { IUser } from "./user";

export interface ISchedule {
  studio: IStudio;
  timeTable: ITimeTable[];
}

export interface ITimeTable {
  date: string;
  clubsTimeTable: IClubSchedule[];
}

export interface IClubSchedule {
  club: IClub;
  slots: IClubsTimeTable[];
}

export interface IClubsTimeTable {
  slotId: number;
  beginning: string;
  end: string;
  trainersAvailable?: IUser[];
  isAvailable?: boolean;
}
