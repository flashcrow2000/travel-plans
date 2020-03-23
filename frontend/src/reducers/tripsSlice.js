import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "trips",
  initialState: { loaded: false, list: [], filteredList: [] },
  reducers: {
    tripsFromUser: (state, action) => {
      state.loaded = true;
      state.list = [...action.payload];
      state.filteredList = [...action.payload];
    },
    filteredTripsByDate: (state, action) => {
      state.loaded = true;
      state.filteredList = [...action.payload];
    },
    logoutTrips: state => {
      console.log("logout user from trips slice");
      state.loaded = false;
      state.list = [];
    }
  }
});

export const {
  tripsFromUser,
  logoutTrips,
  filteredTripsByDate
} = slice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectTrips = state => state.trips;
export const selectFilteredTrips = state => state.trips.filteredList;

export default slice.reducer;
