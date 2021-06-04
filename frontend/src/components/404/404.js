import React from "react"
// import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container text-center">
    <div className="logo-404">
      <a href="/">
        <img src="/img/home/logo.png" alt="" />
      </a>
    </div>
    <div className="content-404">
      <img src="/img/404/404.png" className="img-responsive" alt="" />
      <h1>
        <b>OPPS!</b> We Couldn’t Find this Page
      </h1>
      <p>
        Uh... So it looks like you brock something. The page you are looking for
        has up and Vanished.
      </p>
      <h2>
        <a href="/">Bring me back Home</a>
      </h2>
    </div>
  </div>
)

export default NotFound
