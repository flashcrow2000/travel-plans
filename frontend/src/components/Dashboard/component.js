import React, { useEffect } from "react";
import API from "../../api/api";
import qs from "qs";
import { useSelector } from "react-redux";
import { selectUser } from "../../reducers/userSlice";

export default function Dashboard() {
  //const user = useSelector(selectUser);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      let config = {
        headers: {
          "x-access-token": localStorage.getItem("accessToken")
        }
      };
      API.get(`user/${userId}/trips`, config).then(res => {
        console.log("got trips:", res);
      });
    }
  }, []);
  return (
    <>
      <div>dashboard</div>
    </>
  );
}
