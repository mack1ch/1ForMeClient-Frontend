import { IUser } from "@/shared/interface/user";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IChosenSlotTime {
  time: string | undefined;
}

const initialState: IChosenSlotTime = {
  time: undefined,
};

export const chosenTime = createSlice({
  name: "chosenTime",
  initialState,
  reducers: {
    setChosenSlotTime: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.time = action.payload;
    },
    resetStore: (state) => {
      state.time = initialState.time;
    },
  },
});

export const { setChosenSlotTime, resetStore } = chosenTime.actions;
export const chosenSlotTimeReducer = chosenTime.reducer;
