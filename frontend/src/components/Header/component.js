import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser } from "../../reducers/userSlice";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { setCurrentUser } from "../../reducers/manageSlice";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import styles from "./Header.module.css";

export function Header() {
  const user = useSelector(selectUser);
  const userIdFromLocalStorage = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const history = useHistory();
  function cleanupSelectedUser() {
    dispatch(setCurrentUser(null));
  }

  const loggedInContent = (
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <Link to="/Dashboard" className="nav-link">
          Dashboard
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
    <ul className="navbar-nav mr-auto">
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
    <nav class="navbar navbar-expand-sm navbar-light bg-light">
      <a class="navbar-brand" href="#">
        travelR
      </a>
      <div className={styles.menu} id="navbarNav">
        {user.loggedIn ? loggedInContent : loggedOutContent}
        {user.loggedIn && (
          <span class="navbar-text">
            <button>
              <ExitToAppIcon onClick={() => dispatch(logoutUser())} />
            </button>
          </span>
        )}
      </div>
    </nav>
  );
}
