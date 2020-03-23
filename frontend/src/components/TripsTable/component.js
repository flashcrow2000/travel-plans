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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.trips.map(trip => {
              /* 
            destination: "lI Camino"
startDate: "2020-06-15T00:00:00.000Z"
endDate: "2020-06-22T00:00:00.000Z"
comment: "bla bla"
          */
              return (
                <tr key={trip._id}>
                  <td data-title="Destination">{trip.destination}</td>
                  <td data-title="Start date">{trip.startDate}</td>
                  <td data-title="End date">{trip.endDate}</td>
                  <td data-title="Comment">{trip.comment}</td>
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
