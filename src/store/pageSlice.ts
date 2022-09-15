import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

// Type for our state
export interface PagesState {
  [key: string]: any;
}

// Initial state
const initialState: PagesState = {};

// Actual Slice
export const pageSlice = createSlice({
  name: "pagesState",
  initialState,
  reducers: {
    // Action to set the authentication status
    setPageState(state, action) {
      const { data, key } = action.payload;
      state[key] = data;
    },
    setPageFieldState(state, action) {
      const { data, key, fieldName } = action.payload || {};
      if (state[key]) {
        
        state[key][fieldName] = data;
      }
    },
  },
});

export const { setPageState, setPageFieldState } = pageSlice.actions;

export const selectPageState = (pageKey) => (state: AppState) =>
  state[pageSlice.name][pageKey];

export default pageSlice.reducer;
