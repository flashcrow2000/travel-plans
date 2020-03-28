import React from "react";
import "./theme.css";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import DeleteForeverTwoToneIcon from "@material-ui/icons/DeleteForeverTwoTone";

export default function TripsTable(props) {
  return (
    <div style={{ display: "flex", justifyContent: "center", widht: "80%" }}>
      <div className="col-md-12">
        <h3 className="title-5 m-b-35">trips</h3>
        <div className="table-responsive table-responsive-data2">
          <table className="table table-data2">
            <thead>
              <tr>
                <th>Destination</th>
                <th>Start date</th>
                <th>end date</th>
                <th>comment</th>
                <th>wait for ... </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {props.trips.map(trip => {
                const timeUntil = Math.round(
                  (Date.parse(trip.startDate) - Date.now()) / 86400000
                );
                return (
                  <React.Fragment key={trip._id}>
                    <tr className="tr-shadow">
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
                        <div className="table-data-feature">
                          <button
                            className="item"
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-original-title="Edit"
                            onClick={() => props.onEditTrip(trip._id)}
                          >
                            <EditTwoToneIcon />
                          </button>
                          <button
                            className="item"
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-original-title="Delete"
                            onClick={() => props.onDeleteTrip(trip._id)}
                          >
                            <DeleteForeverTwoToneIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="spacer"></tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
