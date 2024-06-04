import { IUser } from "@/shared/interface/user";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IAvailableTrainers {
  availableTrainers: IUser | undefined;
}

const initialState: IAvailableTrainers = {
  availableTrainers: undefined,
};

export const availableTrainers = createSlice({
  name: "availableTrainers",
  initialState,
  reducers: {
    setAvailableTrainers: (state, action: PayloadAction<IUser | undefined>) => {
      state.availableTrainers = action.payload;
    },
    resetStore: (state) => {
      state.availableTrainers = initialState.availableTrainers;
    },
  },
});

export const { setAvailableTrainers, resetStore } = availableTrainers.actions;
export const availableTrainersReducer = availableTrainers.reducer;
