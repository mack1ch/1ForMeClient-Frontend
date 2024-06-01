import dayjs from "dayjs";
import { ReactNode } from "react";

export interface ISelectOptions {
  value: string;
  label: ReactNode;
}

export interface IFormData {
  slotID: number | null;
  clients?: number[] | string[] | number | string;
  dateInput?: dayjs.Dayjs | null;
  date: string | string[];
  tariffID: number | string | null;
  trainerID: number | string | null;
  clubID: number | string | null;
  userName: string;
  userPhone: string;
  userChatTypeID: number | string | null;
  userNameInMessenger?: string;
}
