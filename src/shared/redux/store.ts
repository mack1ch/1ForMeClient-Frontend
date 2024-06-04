import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { availableTrainersReducer } from "./slices/availableTrainers";
import { chosenSlotTimeReducer } from "./slices/chosenSlotTime";

export const store = configureStore({
  reducer: {
    availableTrainers: availableTrainersReducer,
    chosenTime: chosenSlotTimeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
