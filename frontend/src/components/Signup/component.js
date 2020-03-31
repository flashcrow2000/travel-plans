import { Link, useHistory } from "react-router-dom";
import API from "../../api/api";
import React, { useState, useEffect } from "react";
import qs from "qs";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../reducers/userSlice";
import { loadUsers } from "../../reducers/manageSlice";

export const Signup = props => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setUserRole] = useState("basic");
  const [errorVisible, setErrorVisible] = useState(false);
  const history = useHistory();
  function loadUserList() {
    let config = {
      headers: {
        "x-access-token": localStorage.getItem("accessToken")
      }
    };
    API.get("users", config).then(res => {
      dispatch(loadUsers(res.data.users));
    });
  }
  function submitForm(ev) {
    ev.preventDefault();
    const requestBody = { email, password, role };
    API.post("signup", qs.stringify(requestBody))
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          if (user.loggedIn) {
            history.push("/dashboard");
            loadUserList();
          } else history.push("/login");
        }
      })
      .catch(error => {
        if (error.response?.status === 403) {
          setErrorVisible(true);
          console.log("Show Log in message. Ask for forgot password");
        }
      });
    setEmail("");
    setPassword("");
    setRepeatPassword("");
  }

  function validateForm() {
    console.log("validate");
    if (email === "" || password === "") {
      return false;
    }
    if (password != repeatPassword) {
      return false;
    }
    return true;
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            {user.loggedIn ? (
              <>
                <h1 className="text-xs-center">Add a new user</h1>
              </>
            ) : (
              <>
                <h1 className="text-xs-center">Sign Up</h1>
                <p className="text-xs-center">
                  <Link to="/login">Have an account?</Link>
                </p>
              </>
            )}

            <form onSubmit={submitForm}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={ev => setEmail(ev.target.value)}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={ev => setRepeatPassword(ev.target.value)}
                  />
                </fieldset>

                {props.location.search.indexOf("advanced") > -1 && (
                  <fieldset className="form-group">
                    <label htmlFor="roleSelect">Select role</label>
                    <select
                      className="form-control"
                      id="roleSelect"
                      value={role}
                      onChange={ev => setUserRole(ev.target.value)}
                    >
                      <option>basic</option>
                      <option>supervisor</option>
                      <option>admin</option>
                    </select>
                  </fieldset>
                )}
                {errorVisible && (
                  <h5 style={{ color: "red" }}>
                    That email is already registered. Try signing in!
                  </h5>
                )}
                {!validateForm() && email !== "" && password !== "" && (
                  <p style={{ color: "red" }}>Passwords do not match!</p>
                )}
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={!validateForm()}
                >
                  Sign up
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
