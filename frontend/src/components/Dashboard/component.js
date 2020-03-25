import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../reducers/userSlice";
import { filteredTrips } from "../../reducers/tripsSlice";
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
  selectUsers,
  setCurrentUser
} from "../../reducers/manageSlice";
import EditTrip from "../EditTrip/component";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import styles from "./styles.module.css";
import EditProfile from "../EditProfIle/component";
import qs from "qs";

export default function Dashboard() {
  const user = useSelector(selectUser);
  const trips = useSelector(selectTrips);
  const filteredTrips = useSelector(selectFilteredTrips);
  const managerState = useSelector(selectManagerState);
  const userList = useSelector(selectUsers);
  const history = useHistory();
  const dispatch = useDispatch();
  const [daysFilter, setDaysFilter] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(undefined);
  const [showEditTrip, setShowEditTrip] = useState(false);
  const handleCloseEditTrip = () => setShowEditTrip(false);
  const handleShowEditTrip = () => setShowEditTrip(true);
  const [showDeleteTrip, setShowDeleteTrip] = useState(false);
  const handleCloseDeleteTrip = () => setShowDeleteTrip(false);
  const handleShowDeleteTrip = () => setShowDeleteTrip(true);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [showEditUser, setShowEditUser] = useState(false);
  const handleCloseEditUser = () => setShowEditUser(false);
  const handleShowEditUser = () => setShowEditUser(true);
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
  function loadUserList() {
    let config = {
      headers: {
        "x-access-token": localStorage.getItem("accessToken")
      }
    };
    API.get("users", config).then(res => {
      console.log("users loaded", res.data.users);
      dispatch(loadUsers(res.data.users));
    });
  }
  useEffect(() => {
    if (daysFilter) {
      filterTripsByDate();
    }
  }, [daysFilter]);

  function filterTripsByDate() {
    console.log(daysFilter);
    if (!isNaN(daysFilter) && daysFilter > 0) {
      const date = new Date();
      console.log("initial date:", date);
      date.setDate(date.getDate() + parseInt(daysFilter));
      console.log("target date:", date);
      const filteredList = trips.list.filter(
        trip => new Date(trip.startDate) < date
      );
      dispatch(filteredTrips(filteredList));
    }
  }
  useEffect(() => {
    if (user.loggedIn) {
      loadTrips();
      if (user.profile.role !== "basic" && !managerState.userListLoaded) {
        loadUserList();
      }
    } else {
      history.push("/login");
    }
  }, []);
  function onEditTrip(tripId) {
    const trip = trips.list.find(trip => trip._id === tripId);
    setSelectedTrip(trip);
    handleShowEditTrip();
  }

  function onDeletePopup(tripId) {
    const trip = trips.list.find(trip => trip._id === tripId);
    setSelectedTrip(trip);
    handleShowDeleteTrip();
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
      handleCloseDeleteTrip();
    });
  }
  function onEditUserDialog(userId) {
    const tempUser = userList.find(user => user._id === userId);
    setSelectedUser(tempUser);
    handleShowEditUser();
  }

  function onEditUser(password, role) {
    const requestPayload = { role };
    if (password) {
      requestPayload.password = password;
    }
    let config = {
      headers: {
        "x-access-token": localStorage.getItem("accessToken")
      }
    };
    API.put(`users/${selectedUser._id}`, qs.stringify(requestPayload), config)
      .then(() => {
        console.log("user saved");
        loadUserList();
        handleCloseEditUser();
        setSelectedUser(null);
      })
      .catch(err => {
        console.log("Error deleting user");
      });
  }

  function onDeleteUser() {
    let config = {
      headers: {
        "x-access-token": localStorage.getItem("accessToken")
      }
    };
    API.delete(`users/${selectedUser._id}`, config)
      .then(() => {
        console.log("user deleted");
        loadUserList();
        handleCloseEditUser();
        setSelectedUser(null);
      })
      .catch(err => {
        console.log("Error deleting user");
      });
  }

  function manageTripsByAdmin(userId) {
    const tempUser = userList.find(user => user._id === userId);
    dispatch(setCurrentUser(tempUser));
    history.push("/manage");
  }
  return (
    <>
      <Modal
        show={showEditTrip}
        onHide={handleCloseEditTrip}
        style={{ opacity: 1 }}
      >
        <Modal.Body>
          <EditTrip
            user={user}
            trip={selectedTrip}
            onClose={handleCloseEditTrip}
            refresh={loadTrips}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={showDeleteTrip}
        onHide={handleCloseDeleteTrip}
        style={{ opacity: 1 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to remove this trip?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteTrip}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onDeleteTrip();
              handleCloseDeleteTrip();
            }}
          >
            Remve trip
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showEditUser}
        onHide={handleCloseEditUser}
        style={{ opacity: 1 }}
      >
        <Modal.Body>
          <EditProfile
            role={user.profile.role}
            user={selectedUser}
            passwordError={false}
            passwordSuccess={false}
            deleteUser={onDeleteUser}
            changePassword={() => {}}
            editProfile={onEditUser}
          />
        </Modal.Body>
      </Modal>
      {filteredTrips.length > 0 &&
        (user.profile.role === "basic" ? (
          <>
            <div className={styles.filterContainer}>
              <h5 className={styles.label}>Show trips for the next </h5>
              <input
                type="text"
                value={daysFilter}
                placeholder="days"
                onChange={ev => setDaysFilter(ev.target.value)}
              />
            </div>
            <TripsTable
              trips={filteredTrips}
              onEditTrip={onEditTrip}
              onDeleteTrip={onDeletePopup}
            />
          </>
        ) : (
          <>
            <UsersTable
              role={user.profile.role}
              users={userList}
              onUserDetails={onEditUserDialog}
              onManageUserTrips={manageTripsByAdmin}
            />
          </>
        ))}
      {trips.list.length === 0 && <h4>You haven't added any trips yet!</h4>}
    </>
  );
}
