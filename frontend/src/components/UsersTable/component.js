import React from "react";
import "../TripsTable/theme.css";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import FlightTakeoffTwoToneIcon from "@material-ui/icons/FlightTakeoffTwoTone";

export default function UsersTable(props) {
  return (
    <div style={{ display: "flex", justifyContent: "center", widht: "80%" }}>
      <div className="col-md-12">
        <h3 className="title-5 m-b-35">registered users</h3>
        <div className="table-responsive table-responsive-data2">
          <table className="table table-data2">
            <thead>
              <tr>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {props.users.map(user => {
                return (
                  user._id !== props.owner.id && (
                    <React.Fragment key={user._id}>
                      <tr className="tr-shadow">
                        <td data-title="Email">{user.email}</td>
                        <td>
                          <div className="table-data-feature">
                            <button
                              className="item"
                              data-toggle="tooltip"
                              data-placement="top"
                              title=""
                              data-original-title="Edit"
                              onClick={() => props.onUserDetails(user._id)}
                            >
                              <EditTwoToneIcon />
                            </button>
                            {props.owner.role === "admin" && (
                              <button
                                className="item"
                                data-toggle="tooltip"
                                data-placement="top"
                                title=""
                                data-original-title="Delete"
                                onClick={() =>
                                  props.onManageUserTrips(user._id)
                                }
                              >
                                <FlightTakeoffTwoToneIcon />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      <tr className="spacer"></tr>
                    </React.Fragment>
                  )
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    //     <div style={{ display: "flex", justifyContent: "center", widht: "80%" }}>
    //       <div>
    //         <Table striped bordered hover>
    //           <thead>
    //             <tr>
    //               <th>Email</th>
    //               <th>Actions</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {props.users.map(user => {
    //               /*
    //             destination: "lI Camino"
    // startDate: "2020-06-15T00:00:00.000Z"
    // endDate: "2020-06-22T00:00:00.000Z"
    // comment: "bla bla"
    //           */
    //               return (
    //                 user._id !== props.owner.id && (
    //                   <tr key={user._id}>
    //                     <td data-title="Email">{user.email}</td>
    //                     <td>
    //                       <button
    //                         className="btn btn-primary"
    //                         onClick={() => props.onUserDetails(user._id)}
    //                       >
    //                         Edit
    //                       </button>
    //                       {props.owner.role === "admin" && (
    //                         <button
    //                           className="btn btn-primary"
    //                           style={{ marginLeft: "8px" }}
    //                           onClick={() => props.onManageUserTrips(user._id)}
    //                         >
    //                           Manage trips
    //                         </button>
    //                       )}
    //                     </td>
    //                   </tr>
    //                 )
    //               );
    //             })}
    //           </tbody>
    //         </Table>
    //       </div>
    //     </div>
  );
}
