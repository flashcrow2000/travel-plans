import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userSlice";
import tripsReducer from "../reducers/tripsSlice";
import managerReducer from "../reducers/manageSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    trips: tripsReducer,
    manager: managerReducer
  }
});
