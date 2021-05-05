import React, { Component } from "react";
import { Link } from "react-router-dom";

const VerifyRegisterAccount = () => (
  <div className="container text-center">
    <div className="logo-404">
      <Link to="/login_register">
        <img src="/img/home/logo.png" alt="" />
      </Link>
    </div>
    <div className="content-404">
      <h1>
        <b>Congratulations!!!</b> You have verified login successfully
      </h1>
      <h2>
        <Link to="/login_register">Bring me back Home</Link>
      </h2>
    </div>
  </div>
);
export default VerifyRegisterAccount;
