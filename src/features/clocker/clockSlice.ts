import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface ClockState {
  timings: number[]
}

const initialState: ClockState = { timings: []};

export const clockSlice = createSlice({
  name: 'clockings',
  initialState,
  reducers: {
    add: (state: ClockState, action: PayloadAction<number>) => {
      const timings: number[] = state.timings.slice();

      timings.push(action.payload);

      state.timings = timings.sort((a, b) => a - b);
    },

    remove: (state: ClockState, action: PayloadAction<number>) => {
      const timings: number[] = state.timings.slice();
      if (typeof action.payload === 'undefined') {
        timings.pop();
      } else {
        const index = timings.indexOf(action.payload);
        if (index > -1) {
          timings.splice(index, 1);
        }
      }

      state.timings = timings.sort((a, b) => a - b);
    },
  }
});

export const selectClock = (state: RootState) => state.clock;
export const {add,remove} = clockSlice.actions;

export default clockSlice.reducer;