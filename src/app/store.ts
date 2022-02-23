import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import clockReducer from '../features/clocker/clockSlice';

export const store = configureStore({
  reducer: {
    clock: clockReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
