import { Link, useHistory } from "react-router-dom";
import API from "../../api/api";
import React, { useState } from "react";
import qs from "qs";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const history = useHistory();

  function submitForm(ev) {
    ev.preventDefault();
    const requestBody = { email, password };
    API.post("signup", qs.stringify(requestBody))
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          history.push("/login");
        }
      })
      .catch(error => {
        if (error.response?.status === 403) {
          console.log("Show Log in message. Ask for forgot password");
        }
      });
    setEmail("");
    setPassword("");
    setRepeatPassword("");
  }

  function validateForm() {
    if (email === "" || password === "") {
      return false;
    }
    if (password !== repeatPassword) {
      return false;
    }
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign Up</h1>
            <p className="text-xs-center">
              <Link to="/login">Have an account?</Link>
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

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={ev => setRepeatPassword(ev.target.value)}
                  />
                </fieldset>

                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={!validateForm}
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
