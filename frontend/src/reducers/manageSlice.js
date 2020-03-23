import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "manager",
  initialState: {
    userListLoaded: false,
    userList: [],
    currentUser: null,
    currentUserTrips: []
  },
  reducers: {
    loadUsers: (state, action) => {
      state.userListLoaded = true;
      state.userList = [...action.payload];
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setCurrentUserTrips: (state, action) => {
      state.currentUserTrips = [...action.payload];
    },
    logoutManager: state => {
      state.userListLoaded = false;
      state.userList = [];
      state.currentUser = null;
      state.currentUserTrips = [];
    }
  }
});

export const {
  loadUsers,
  setCurrentUser,
  setCurrentUserTrips,
  logoutManager
} = slice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCurrentUser = state => state.manager.currentUser;
export const selectCurrentUserTrips = state => state.manager.currentUserTrips;
export const selectManagerState = state => state.manager;
export const selectUsers = state => state.manager?.userList ?? [];

export default slice.reducer;
