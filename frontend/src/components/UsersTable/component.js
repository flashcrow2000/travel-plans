import React from "react";
import Table from "react-bootstrap/Table";

export default function UsersTable(props) {
  return (
    <div style={{ display: "flex", justifyContent: "center", widht: "80%" }}>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.users.map(user => {
              /* 
            destination: "lI Camino"
startDate: "2020-06-15T00:00:00.000Z"
endDate: "2020-06-22T00:00:00.000Z"
comment: "bla bla"
          */
              return (
                <tr key={user._id}>
                  <td data-title="Email">{user.email}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => props.onUserDetails(user._id)}
                    >
                      Edit
                    </button>
                    {props.role === "admin" && (
                      <button
                        className="btn btn-primary"
                        onClick={() => props.onManageUserTrips(user._id)}
                      >
                        Manage trips
                      </button>
                    )}
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
