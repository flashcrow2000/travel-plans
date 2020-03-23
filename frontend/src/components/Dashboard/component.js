import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../reducers/userSlice";
import { filteredTripsByDate } from "../../reducers/tripsSlice";
import { useHistory } from "react-router-dom";
import {
  tripsFromUser,
  selectTrips,
  selectFilteredTrips
} from "../../reducers/tripsSlice";
import TripsTable from "../TripsTable/component";
import UsersTable from "../UsersTable/component";
import {
  selectManagerState,
  loadUsers,
  selectUsers
} from "../../reducers/manageSlice";
import EditTrip from "../EditTrip/component";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function Dashboard() {
  const user = useSelector(selectUser);
  const trips = useSelector(selectTrips);
  const filteredTrips = useSelector(selectFilteredTrips);
  const managerState = useSelector(selectManagerState);
  const userList = useSelector(selectUsers);
  const history = useHistory();
  const dispatch = useDispatch();
  const [daysFilter, setDaysFilter] = useState(0);
  const [selectedTrip, setSelectedTrip] = useState(undefined);
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  useEffect(() => {
    if (daysFilter) {
      filterTripsByDate();
    }
  }, [daysFilter]);
  function loadTrips() {
    let config = {
      headers: {
        "x-access-token": localStorage.getItem("accessToken")
      }
    };
    API.get(`users/${user.profile.id}/trips`, config).then(res => {
      dispatch(tripsFromUser(res.data.trips));
    });
  }
  function filterTripsByDate() {
    if (daysFilter !== 0) {
      const date = new Date();
      date.setDate(date.getDate() + daysFilter);
      const filteredList = trips.list.filter(
        trip => new Date(trip.startDate) < date
      );
      dispatch(filteredTripsByDate(filteredList));
    }
  }
  useEffect(() => {
    if (user.loggedIn) {
      loadTrips();
      if (user.profile.role !== "basic" && !managerState.userListLoaded) {
        let config = {
          headers: {
            "x-access-token": localStorage.getItem("accessToken")
          }
        };
        API.get("users", config).then(res => {
          console.log("got users:", res.data.users);
          dispatch(loadUsers(res.data.users));
        });
      }
    } else {
      history.push("/login");
    }
  }, []);
  function onEditTrip(tripId) {
    const trip = trips.list.find(trip => trip._id === tripId);
    setSelectedTrip(trip);
    handleShowEdit();
  }

  function onDeletePopup(tripId) {
    const trip = trips.list.find(trip => trip._id === tripId);
    setSelectedTrip(trip);
    handleShowDelete();
  }

  function onDeleteTrip() {
    console.log("delete trip:", selectedTrip);
    let config = {
      headers: {
        "x-access-token": localStorage.getItem("accessToken")
      }
    };
    API.delete(
      `users/${user.profile.id}/trips/${selectedTrip._id}`,
      config
    ).then(() => {
      loadTrips();
      handleCloseDelete();
    });
  }
  function onUserDetails(userId) {
    console.log("edit user:", userId);
  }

  function onDeleteUser(userId) {
    console.log("delete user:", userId);
  }
  return (
    <>
      <Modal show={showEdit} onHide={handleCloseEdit} style={{ opacity: 1 }}>
        <Modal.Body>
          <EditTrip
            user={user}
            trip={selectedTrip}
            onClose={handleCloseEdit}
            refresh={loadTrips}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={showDelete}
        onHide={handleCloseDelete}
        style={{ opacity: 1 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to remove this trip?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onDeleteTrip();
              handleCloseDelete();
            }}
          >
            Remve trip
          </Button>
        </Modal.Footer>
      </Modal>
      {filteredTrips.length > 0 &&
        (user.profile.role === "basic" ? (
          <>
            <button onClick={() => setDaysFilter(2)}>Click</button>
            <TripsTable
              trips={filteredTrips}
              onEditTrip={onEditTrip}
              onDeleteTrip={onDeletePopup}
            />
          </>
        ) : (
          <UsersTable
            users={userList}
            onUserDetails={onUserDetails}
            onDeleteUser={onDeleteUser}
          />
        ))}
      {trips.list.length === 0 && <h4>You haven't added any trips yet!</h4>}
    </>
  );
}
