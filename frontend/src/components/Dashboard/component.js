import React, { useEffect, useState, useRef } from "react";
import ReactToPrint from "react-to-print";
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
import PrintOutcome from "../PrintOutcome/component";
import FilterListTwoToneIcon from "@material-ui/icons/FilterListTwoTone";

export default function Dashboard() {
  const user = useSelector(selectUser);
  const trips = useSelector(selectTrips);
  const filteredTripsList = useSelector(selectFilteredTrips);
  const managerState = useSelector(selectManagerState);
  const userList = useSelector(selectUsers);
  const history = useHistory();
  const dispatch = useDispatch();
  const componentRef = useRef();

  const [tripsNext30Days, setTripsNext30Days] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(undefined);
  const [showEditTrip, setShowEditTrip] = useState(false);
  const [showDeleteTrip, setShowDeleteTrip] = useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [showEditUser, setShowEditUser] = useState(false);
  const [destinationFilter, setDestinationFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

  const handleCloseEditTrip = () => setShowEditTrip(false);
  const handleShowEditTrip = () => setShowEditTrip(true);
  const handleCloseDeleteTrip = () => setShowDeleteTrip(false);
  const handleShowDeleteTrip = () => setShowDeleteTrip(true);
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
      calculateNext30DaysTrips(res.data.trips);
    });
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

  function calculateNext30DaysTrips(trips) {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    const filteredList = trips.filter(
      trip =>
        new Date(trip.startDate) < date && new Date(trip.startDate) > new Date()
    );
    if (filteredList.length >= 2) {
      filteredList.sort((t1, t2) => (t1.startDate < t2.startDate ? -1 : 1));
    }
    setTripsNext30Days(filteredList);
  }

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

  function onEditUserDialog(userId) {
    const tempUser = userList.find(user => user._id === userId);
    setSelectedUser(tempUser);
    handleShowEditUser();
  }

  function manageTripsByAdmin(userId) {
    const tempUser = userList.find(user => user._id === userId);
    dispatch(setCurrentUser(tempUser));
    history.push("/manage");
  }

  function addUserBySupervisor() {
    history.push("/signup");
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

  useEffect(() => {
    let filteredResult = [...trips.list];
    if (!filterVisible) {
      dispatch(filteredTrips(filteredResult));
      return;
    }
    if (destinationFilter) {
      filteredResult = filteredResult.filter(
        trip =>
          trip.destination
            .toLowerCase()
            .indexOf(destinationFilter.toLowerCase()) > -1
      );
    }
    if (startDateFilter) {
      filteredResult = filteredResult.filter(trip => {
        const dateString = new Date(trip.startDate).toLocaleDateString();
        return dateString.indexOf(`${startDateFilter}`) > -1;
      });
    }
    if (endDateFilter) {
      filteredResult = filteredResult.filter(trip => {
        const dateString = new Date(trip.endDate).toLocaleDateString();
        return dateString.indexOf(`${endDateFilter}`) > -1;
      });
    }
    dispatch(filteredTrips(filteredResult));
  }, [filterVisible, destinationFilter, startDateFilter, endDateFilter]);

  const noTripsContent = (
    <>
      <div className={styles.noTrips}>
        <h4>You haven't added any trips!</h4>
        <div className="table-data__tool-right">
          <button
            onClick={() => history.push("/new-trip")}
            className="au-btn au-btn-icon au-btn--green au-btn--small"
          >
            add trip
          </button>
        </div>
      </div>
    </>
  );

  const filtersContent = (
    <div style={{ marginBottom: "12px" }}>
      <div>
        <div className={styles.buttonContainer}>
          <button
            className="au-btn-filter"
            style={{ border: "1px solid lightgrey" }}
            onClick={() => setFilterVisible(!filterVisible)}
          >
            <FilterListTwoToneIcon />
            filters
          </button>
          <button
            className="au-btn au-btn-icon au-btn--green au-btn--small"
            onClick={() => history.push("/new-trip")}
          >
            add trip
          </button>
        </div>
        <div>
          <div>
            <div
              style={{ display: filterVisible ? "flex" : "none" }}
              className={styles.filterContainer}
            >
              <input
                type="text"
                value={destinationFilter}
                style={{ marginRight: "8px" }}
                className="form-control"
                placeholder="Destination"
                onChange={ev => setDestinationFilter(ev.target.value)}
              />
              <input
                type="text"
                value={startDateFilter}
                style={{ marginRight: "8px" }}
                className="form-control"
                placeholder="Start date"
                onChange={ev => setStartDateFilter(ev.target.value)}
              />
              <input
                type="text"
                value={endDateFilter}
                style={{ marginRight: "8px" }}
                className="form-control"
                placeholder="End date"
                onChange={ev => setEndDateFilter(ev.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
            Remove trip
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
      <div className={styles.header}>
        <h2>
          {user.profile.role === "basic"
            ? "Where do you want to go next?"
            : "Welcome back!"}
        </h2>
      </div>
      <div className={styles.container}>
        <div>
          {user.profile.role === "basic" ? (
            <>
              {trips.list.length === 0 && noTripsContent}
              {trips.list.length > 0 && filtersContent}
              {trips.list.length > 0 && filteredTripsList.length > 0 ? (
                <TripsTable
                  trips={filteredTripsList}
                  onEditTrip={onEditTrip}
                  onDeleteTrip={onDeletePopup}
                />
              ) : (
                trips.list.length > 0 && <h3>No trips match your filters!</h3>
              )}
              {tripsNext30Days.length > 0 && (
                <div className={styles.print}>
                  <ReactToPrint
                    trigger={() => (
                      <button className="btn btn-primary">
                        Print 30 days schedule!
                      </button>
                    )}
                    content={() => componentRef.current}
                  />
                </div>
              )}
              <div style={{ display: "none" }}>
                <PrintOutcome ref={componentRef} trips={tripsNext30Days} />
              </div>
            </>
          ) : (
            <>
              <UsersTable
                owner={user.profile}
                users={userList}
                onUserDetails={onEditUserDialog}
                onManageUserTrips={manageTripsByAdmin}
              />
              <div>
                <button
                  className="btn btn-primary"
                  onClick={addUserBySupervisor}
                >
                  Add user
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
