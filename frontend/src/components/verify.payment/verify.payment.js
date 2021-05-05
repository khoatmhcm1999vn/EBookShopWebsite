import React from "react";
import { Link } from "react-router-dom";

const VerifyPayment = () => (
  <div className="container text-center">
    <div className="logo-404">
      <Link to="/">
        <img src="/img/home/logo.png" alt="" />
      </Link>
    </div>
    <div className="content-404">
      <h1>
        <b>Congratulations!!!</b> You have verified payment
      </h1>
      <h2>
        <Link to="/">Bring me back Home</Link>
      </h2>
    </div>
  </div>
);
export default VerifyPayment;
