import React, { useState } from "react";
import API from "../../api/api";
import qs from "qs";
import { useSelector } from "react-redux";
import { selectUser } from "../../reducers/userSlice";
import DatePicker from "react-datepicker";

export default function EditTrip(props) {
  const [destination, setDestination] = useState(props.trip.destination);
  const [comment, setComment] = useState(props.trip.comment);
  const [startDate, setStartDate] = useState(new Date(props.trip.startDate));
  const [endDate, setEndDate] = useState(new Date(props.trip.endDate));
  const userId = props.user.profile?.id ?? props.user._id;
  function submitForm(ev) {
    ev.preventDefault();
    const requestBody = { destination, startDate, endDate, comment };
    let config = {
      headers: {
        "x-access-token": localStorage.getItem("accessToken")
      }
    };
    API.put(
      `users/${userId}/trips/${props.trip._id}`,
      qs.stringify(requestBody),
      config
    )
      .then(res => {
        props.refresh();
        props.onClose();
      })
      .catch(err => {
        console.log("trip save failed");
      });
  }
  function validateForm() {
    if (destination === "") return false;
    if (endDate < startDate) return false;
    return true;
  }
  return (
    <>
      <div>
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
            <label htmlFor="startDate">Start date</label>
            <br />
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={date => {
                setStartDate(date);
              }}
            />
            <br />
            <label htmlFor="endDate">End date</label>
            <br />
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={date => {
                setEndDate(date);
              }}
            />
            <fieldset className="form-group" style={{ marginTop: "16px" }}>
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Comment"
                value={comment}
                onChange={ev => setComment(ev.target.value)}
              />
            </fieldset>
            <button
              className="btn btn-lg btn-primary center"
              type="submit"
              disabled={!validateForm()}
            >
              Save trip
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
}
