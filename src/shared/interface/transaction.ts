
import { ISubscription } from "./subscription";
import { ITariff } from "./tariff";
import { ITraining } from "./training";
import { IUser } from "./user";

export enum ETransactionStatus {
  Unpaid = "Не оплачено",
  Paid = "Оплачено",
  Refunded = "Возврат",
  Canceled = "Отменено",
}

export interface ITransaction {
  id: number;
  trainer: IUser;
  client: IUser;
  cost: number;
  createdAt: Date;
  status: "Unpaid" | "Paid" | "Refunded" | "Canceled";
  tariff: ITariff;
  training: ITraining;
  subscription: ISubscription;
  subExpireAt: Date;
}

export interface IApiTransaction {
  transactions: ITransaction[];
  totalCost: number;
  day: number;
  month: number;
}
