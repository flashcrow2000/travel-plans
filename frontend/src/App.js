import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Header } from "./components/Header/component";
import { Login } from "./components/Login/component";
import { Signup } from "./components/Signup/component";
import { useSelector } from "react-redux";
import { selectUser } from "./reducers/userSlice";
import Dashboard from "./components/Dashboard/component";
import NewTrip from "./components/NewTrip/component";
import Profile from "./components/Profile/component";
import Manage from "./components/Manage/component";
import NoMatch from "./components/NoMatch/component";

function App() {
  const user = useSelector(selectUser);
  const accessToken = user.loggedIn && localStorage.getItem("accessToken");
  const userLoggedIn = user.loggedIn; // || accessToken;
  const ProtectedRoute = ({ isAllowed, ...props }) =>
    isAllowed ? <Route {...props} /> : <Redirect to="/login" />;
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
        <ProtectedRoute
          isAllowed={userLoggedIn}
          path="/dashboard"
          exact
          component={Dashboard}
        />
        <ProtectedRoute
          isAllowed={userLoggedIn}
          path="/new-trip"
          exact
          component={NewTrip}
        />
        <ProtectedRoute
          isAllowed={userLoggedIn}
          path="/profile"
          exact
          component={Profile}
        />
        <ProtectedRoute
          isAllowed={userLoggedIn}
          path="/manage"
          exact
          component={Manage}
        />
        <Route component={NoMatch} />
      </Switch>
    </div>
  );
}

export default App;
