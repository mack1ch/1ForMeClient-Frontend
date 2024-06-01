import { IStudio } from "./studio";

export interface IClub {
  id: number;
  name: string;
  address: string;
  studio: IStudio;
}
