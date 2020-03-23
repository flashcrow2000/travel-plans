import React, { useState } from "react";
import API from "../../api/api";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser } from "../../reducers/userSlice";
import { logoutTrips } from "../../reducers/tripsSlice";
import { logoutManager } from "../../reducers/manageSlice";
import EditProfile from "../EditProfIle/component";
import { useHistory } from "react-router-dom";
import qs from "qs";

export default function Profile() {
  const user = useSelector(selectUser);
  const [pwdError, setPwdError] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  function logout() {
    dispatch(logoutUser());
    dispatch(logoutManager());
    dispatch(logoutTrips());
    history.push("/");
  }
  function changePassword(oldPassword, newPassword) {
    console.log(oldPassword, newPassword);
    let config = {
      headers: {
        "x-access-token": localStorage.getItem("accessToken")
      }
    };
    const requestBody = { oldPassword, newPassword };
    API.put(`users/${user.profile.id}`, qs.stringify(requestBody), config)
      .then(res => {
        setPwdSuccess(true);
      })
      .catch(err => {
        setPwdError(true);
      });
  }
  function deleteUserAccount() {
    let config = {
      headers: {
        "x-access-token": localStorage.getItem("accessToken")
      }
    };
    API.delete(`users/${user.profile.id}`, config)
      .then(res => {
        logout();
      })
      .catch(err => {
        console.log("Error deleting user");
      });
  }
  return (
    <>
      <h2>Profile</h2>
      <EditProfile
        role={"basic"}
        user={user}
        passwordError={pwdError}
        passwordSuccess={pwdSuccess}
        deleteUser={deleteUserAccount}
        changePassword={changePassword}
      />
      <div style={{ marginLeft: "48px" }}>
        <h4 style={{ margin: "32px 0" }}>Logout</h4>
        <button onClick={logout} className="btn btn-primary">
          Logout
        </button>
      </div>
    </>
  );
}
