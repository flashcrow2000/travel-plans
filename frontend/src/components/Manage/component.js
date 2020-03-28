import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { selectCurrentUser } from "../../reducers/manageSlice";
import { useSelector, useDispatch } from "react-redux";
import API from "../../api/api";
import { filteredTrips } from "../../reducers/tripsSlice";
import { selectFilteredTrips } from "../../reducers/tripsSlice";
import TripsTable from "../TripsTable/component";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import EditTrip from "../EditTrip/component";
import { selectUser } from "../../reducers/userSlice";

export default function Manage() {
  const user = useSelector(selectUser);
  const selectedUser = useSelector(selectCurrentUser);
  const trips = useSelector(selectFilteredTrips);
  const dispatch = useDispatch();
  const history = useHistory();
  const [showEditTrip, setShowEditTrip] = useState(false);
  const handleCloseEditTrip = () => setShowEditTrip(false);
  const handleShowEditTrip = () => setShowEditTrip(true);
  const [showDeleteTrip, setShowDeleteTrip] = useState(false);
  const handleCloseDeleteTrip = () => setShowDeleteTrip(false);
  const handleShowDeleteTrip = () => setShowDeleteTrip(true);
  const [selectedTrip, setSelectedTrip] = useState(undefined);
  function onEditTrip(tripId) {
    const trip = trips.find(trip => trip._id === tripId);
    setSelectedTrip(trip);
    handleShowEditTrip();
  }

  function onDeletePopup(tripId) {
    const trip = trips.find(trip => trip._id === tripId);
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
      `users/${selectedUser._id}/trips/${selectedTrip._id}`,
      config
    ).then(() => {
      loadTrips();
      handleCloseDeleteTrip();
    });
  }
  function loadTrips() {
    let config = {
      headers: {
        "x-access-token": localStorage.getItem("accessToken")
      }
    };
    API.get(`users/${selectedUser._id}/trips`, config).then(res => {
      console.log("trips for user:", res.data.trips);
      dispatch(filteredTrips(res.data.trips));
    });
  }
  function addTripForSelectedUser() {
    history.push("/new-trip");
  }
  useEffect(() => {
    console.log(user, selectedUser);
    if (!user.loggedIn || !selectedUser) {
      history.push("/login");
    } else if (user.profile.role !== "admin") {
      history.push("/dashboard");
    } else loadTrips();
  }, []);
  return (
    user.loggedIn &&
    selectedUser && (
      <>
        <Modal
          show={showEditTrip}
          onHide={handleCloseEditTrip}
          style={{ opacity: 1 }}
        >
          <Modal.Body>
            <EditTrip
              user={selectedUser}
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
            <Modal.Title>
              Are you sure you want to remove this trip?
            </Modal.Title>
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
        <TripsTable
          trips={trips}
          onEditTrip={onEditTrip}
          onDeleteTrip={onDeletePopup}
        />
        <div>
          <button className="btn btn-primary" onClick={addTripForSelectedUser}>
            Add trip
          </button>
        </div>
      </>
    )
  );
}
