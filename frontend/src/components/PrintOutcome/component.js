import React from "react";

export default class PrintOutcome extends React.Component {
  render() {
    return (
      <div style={{ margin: "40px" }}>
        <div style={{ marginBottom: "40px" }}>
          <h2>
            <center>These are the trips from the next 30 days!</center>
          </h2>
        </div>
        <div>
          {this.props.trips.map(trip => (
            <div key={trip._id}>
              <div>Destination: {trip.destination}</div>
              <div>
                Start date: {new Date(trip.startDate).toLocaleDateString()}
              </div>
              <div>
                Return date: {new Date(trip.endDate).toLocaleDateString()}
              </div>
              <div>Comment: {trip.comment}</div>
              <hr />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
