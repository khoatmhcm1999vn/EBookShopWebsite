import React from "react"
import { Link } from "react-router-dom"

const Fail = ({ notification }) => (
  <div className="container text-center">
    <div className="logo-404">
      <a href="/">
        <img src="/img/home/logo.png" alt="" />
      </a>
    </div>
    <div className="content-404">
      <h1>
        <b>OPPS!</b>Fail
      </h1>
      <span>{notification}</span>
      <p>
        Uh... So it looks like you brock something. The page you are looking for
        has up and Vanished.
      </p>
      <h2>
        <Link to="/login_register">Bring me back Login Page</Link>
      </h2>
    </div>
  </div>
)
export default Fail
