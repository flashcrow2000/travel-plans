import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Header } from "./components/Header/component";
import { Login } from "./components/Login/Login";
import { Signup } from "./components/Signup/Signup";
import { useSelector } from "react-redux";
import { selectUser } from "./reducers/userSlice";
import AllTrips from "./components/AllTrips/component";
import Users from "./components/Users/component";
import Dashboard from "./components/Dashboard/component";
import NewTrip from "./components/NewTrip/component";

function App() {
  const accessToken = localStorage.getItem("accessToken");
  const user = useSelector(selectUser);
  const userLoggedIn = user.loggedIn || accessToken;
  return (
    <div className="App">
      <Header />

      <Switch>
        <Route exact path="/">
          {userLoggedIn ? (
            <Redirect to="/dashboard" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/all-trips" exact component={AllTrips} />
        <Route path="/users" exact component={Users} />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/new-trip" exact component={NewTrip} />
      </Switch>
    </div>
  );
}

export default App;
