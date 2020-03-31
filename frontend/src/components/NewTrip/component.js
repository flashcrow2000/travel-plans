import React, { useState } from "react";
import DatePicker from "react-datepicker";
import styles from "./styles.module.css";
import API from "../../api/api";
import qs from "qs";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../reducers/userSlice";
import { useHistory } from "react-router-dom";
import { selectCurrentUser } from "../../reducers/manageSlice";
import { Divider } from "@material-ui/core";

export default function NewTrip() {
  const user = useSelector(selectUser);
  const selectedUser = useSelector(selectCurrentUser);
  const [destination, setDestination] = useState("");
  const [comment, setComment] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const history = useHistory();
  function submitForm(ev) {
    ev.preventDefault();
    const requestBody = { destination, startDate, endDate, comment };
    let config = {
      headers: {
        "x-access-token": localStorage.getItem("accessToken")
      }
    };
    API.post(
      `users/${selectedUser?._id ?? user.profile.id}/trips`,
      qs.stringify(requestBody),
      config
    )
      .then(() => {
        history.push("/dashboard");
      })
      .catch(err => {
        console.log("trip add failed");
      });
  }
  function validateForm() {
    if (destination === "") return false;
    if (endDate < startDate) return false;
    return true;
  }
  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          {selectedUser ? (
            <h2 className={styles.header}>
              Add a trip for ${selectedUser.email}
            </h2>
          ) : (
            <h2 className={styles.header}>Where do you want to go?</h2>
          )}
          <form onSubmit={submitForm}>
            <fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Destination"
                  value={destination}
                  onChange={ev => setDestination(ev.target.value)}
                />
              </fieldset>
              <fieldset className="form-group" style={{ marginTop: "16px" }}>
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Comment"
                  value={comment}
                  onChange={ev => setComment(ev.target.value)}
                />
              </fieldset>
              <div className={styles.dates}>
                <div>
                  <label htmlFor="startDate">Start date</label>
                  <br />
                  <DatePicker
                    id="startDate"
                    selected={startDate}
                    onChange={date => {
                      setStartDate(date);
                      setEndDate(date);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="endDate">End date</label>
                  <br />
                  <DatePicker
                    id="endDate"
                    selected={endDate}
                    minDate={startDate}
                    onChange={date => {
                      setEndDate(date);
                    }}
                  />
                </div>
              </div>
              <Divider style={{ margin: "16px 0" }} />
              <div className={styles.addBtn}>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={!validateForm()}
                >
                  Add trip
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}
