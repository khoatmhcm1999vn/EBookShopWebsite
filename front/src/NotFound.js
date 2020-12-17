import React from "react";
import { Link } from "react-router-dom";

import classes from "./NotFound.css";

import { isAuthenticated } from "./auth";

const NotFound = () => (
  <div className="jumbotron">
    <h1 className="m-2">404 - Not Found!</h1>
    {isAuthenticated() &&
    isAuthenticated().user.role.includes("admin") ? (
      <Link to="/dashboard">Go Dashboard</Link>
    ) : (
      <Link to="/">Go Home</Link>
    )}
  </div>
);

export default NotFound;
