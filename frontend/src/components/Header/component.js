import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser } from "../../reducers/userSlice";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export function Header() {
  const user = useSelector(selectUser);
  console.log(user);
  const userIdFromLocalStorage = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const history = useHistory();

  const loggedInContent = (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <Link to="/Dashboard" className="nav-link">
          Dashboard
        </Link>
      </li>

      {user.profile?.role !== "basic" && (
        <li className="nav-item">
          <Link to="/users" className="nav-link">
            Manage users
          </Link>
        </li>
      )}

      {user.profile?.role === "admin" && (
        <li className="nav-item">
          <Link to="/all-trips" className="nav-link">
            Manage trips
          </Link>
        </li>
      )}

      <li className="nav-item">
        <Link to="/new-trip" className="nav-link">
          New trip
        </Link>
      </li>

      <li className="nav-item">
        <button
          onClick={() => {
            console.log("logout");
            dispatch(logoutUser());
            console.log("redirect to /");
            history.push("/");
          }}
          className="nav-link"
        >
          Log out
        </button>
      </li>
    </ul>
  );

  const loggedOutContent = (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <Link to="/login" className="nav-link">
          Log in
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/signup" className="nav-link">
          Sign up
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        {user.loggedIn || userIdFromLocalStorage
          ? loggedInContent
          : loggedOutContent}
      </div>
    </nav>
  );
}
