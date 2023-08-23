import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";

import React from "react";

import Login from "./newFront/login/SignIn";
import SignUp from "./newFront/signup/SignUp";
// import Home from './components/Home/Home';
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Profile from "./newFront/Profile/Profile";

import { useEffect, useState } from "react";
import Dashboard from "./newFront/Dashboard/Dashboard";

import { history } from "./helpers/history";

import ChooseProgramHome from "./components/Home/Home";
import Home from "./newFront/home/Home.js";
import BasicTraining from "./newFront/home/compoents/BasicTraining";

function App() {
  //const isUser = localStorage.getItem('user.complete_name')

  const [isUser, setIsUser] = useState("");
  const [isUserRole, setIsUserRole] = useState("");

  useEffect(() => {
    setIsUser(localStorage.getItem("name"));
    setIsUserRole(localStorage.getItem("role"));
  }, []);
  console.log(isUser);

  const dashboardstyle = {
    height: "100vh",
  };

  const gymNameStyle = {
    color: "rgb(255, 115, 0)",
  };

  const logout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("user");
    history.push("/signin");
    window.location.reload();
  };

  return (
    <Router history={history}>
      <div></div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signin" component={Login} />
        <Route exact path="/signin" component={Login} />
        <Route exact path="/basic-training" component={BasicTraining} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/forgotpassword" component={ForgotPassword}></Route>
        <Route exact path="/resetpassword" component={ResetPassword}></Route>
        <Route exact path="/programs" component={ChooseProgramHome} />
        <Route
          exact
          path="/home"
          component={() => <Home authorized={isUser} />}
        />
        <div className="dashboard">
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/profile" component={Profile} />
        </div>
      </Switch>
    </Router>
  );
}

export default App;
