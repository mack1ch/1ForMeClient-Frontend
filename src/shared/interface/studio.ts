import { IncomingHttpHeaders } from "http";
import { IUser } from "./user";
import { IClub } from "./club";
import { ISport } from "./sport";

export interface IStudio {
    id: number;
    name: string;
    city: IncomingHttpHeaders;
    trainers: IUser;
    tax: number;
    clubs: IClub[];
    address: string;
    sports: ISport[];
  }
  
