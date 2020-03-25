import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser } from "../../reducers/userSlice";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { setCurrentUser } from "../../reducers/manageSlice";

export function Header() {
  const user = useSelector(selectUser);
  const userIdFromLocalStorage = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const history = useHistory();
  function cleanupSelectedUser() {
    dispatch(setCurrentUser(null));
  }

  const loggedInContent = (
    <ul className="nav pull-xs-right">
      <li className="nav-item">
        <Link to="/Dashboard" className="nav-link">
          Dashboard
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/new-trip" className="nav-link" onClick={cleanupSelectedUser}>
          New trip
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
      </li>
    </ul>
  );

  const loggedOutContent = (
    <ul className="nav pull-xs-right">
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
      <div className="container" style={{ flexDirection: "row-reverse" }}>
        {user.loggedIn ? loggedInContent : loggedOutContent}
      </div>
    </nav>
  );
}
