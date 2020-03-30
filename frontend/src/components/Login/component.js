import { Link, useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import API from "../../api/api";
import qs from "qs";
import { loginUser } from "../../reducers/userSlice";
import styles from "./Login.module.css";
import { useDispatch } from "react-redux";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    localStorage.removeItem("accessToken");
  }, []);

  function submitForm(ev) {
    ev.preventDefault();
    const requestBody = { email, password };
    API.post("login", qs.stringify(requestBody))
      .then(res => {
        dispatch(loginUser(res.data));
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("userId", res.data.data.id);
        history.push("/dashboard");
      })
      .catch(err => setError(true));
    // setEmail("");
    // setPassword("");
  }
  return (
    <>
      <div className={styles.red}>
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Link to="/signup">Need an account?</Link>
              </p>
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

                  {error && (
                    <h5 style={{ color: "red" }}>
                      Email and passowrd combination do not match!
                    </h5>
                  )}

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                  >
                    Sign in
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
