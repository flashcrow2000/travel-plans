import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "user",
  initialState: {
    loggedIn: false,
    profile: {}
  },
  reducers: {
    loginUser: (state, action) => {
      state.loggedIn = true;
      state.profile = { ...action.payload.data };
    },
    logoutUser: state => {
      console.log("logout user from slice");
      state.loggedIn = false;
      state.profile = {};
      localStorage.removeItem("userId");
      localStorage.removeItem("accessToken");
    }
  }
});

export const { loginUser, logoutUser } = slice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectUser = state => state.user;

export default slice.reducer;
