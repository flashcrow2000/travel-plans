import React from "react";

export default class PrintOutcome extends React.Component {
  render() {
    return (
      <div>
        {this.props.trips.map(trip => (
          <div key={trip._id}>
            <div>Destination: {trip.destination}</div>
            <div>Start date: {trip.startDate}</div>
            <div>Return date: {trip.endDate}</div>
            <div>Comment: {trip.comment}</div>
            <hr />
          </div>
        ))}
      </div>
    );
  }
}
