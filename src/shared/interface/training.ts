import { IClub } from "./club";
import { IClubSlot } from "./slots";
import { ISubscription } from "./subscription";
import { ITransaction } from "./transaction";
import { IUser } from "./user";

export interface ITraining {
  id: number;
  slot: IClubSlot;
  trainer: IUser;
  client: IUser;
  subscription: ISubscription;
  status: string;
  type: ITrainType;
  isFinished: boolean;
  date: string;
  club: IClub;
  transaction: ITransaction;
}

export interface ITrainType {
  id: number;
  name: string;
}

export interface IApiTraining {
  date: string;
  trainings: ITraining[];
}

export interface IDoteCount {
  day: number;
  month: number;
  trainingCount: number;
}
