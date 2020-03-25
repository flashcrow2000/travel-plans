import React from "react";
import Table from "react-bootstrap/Table";

export default function TripsTable(props) {
  return (
    <div style={{ display: "flex", justifyContent: "center", widht: "80%" }}>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Destination</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Comment</th>
              <th>Wait for ...</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.trips.map(trip => {
              const timeUntil = Math.round(
                (Date.parse(trip.startDate) - Date.now()) / 86400000
              );
              return (
                <tr key={trip._id}>
                  <td data-title="Destination">{trip.destination}</td>
                  <td data-title="Start date">
                    {new Date(trip.startDate).toLocaleDateString()}
                  </td>
                  <td data-title="End date">
                    {new Date(trip.endDate).toLocaleDateString()}
                  </td>
                  <td data-title="Comment">{trip.comment}</td>
                  <td data-title="Starts in">
                    {timeUntil > 0
                      ? `${timeUntil} days`
                      : `Passed. We hope you enjoyed it!`}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => props.onEditTrip(trip._id)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ marginLeft: "8px" }}
                      className="btn btn-danger"
                      onClick={() => props.onDeleteTrip(trip._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
