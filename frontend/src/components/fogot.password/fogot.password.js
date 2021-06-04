import React, { Component } from "react"
import { Link } from "react-router-dom"

const ForgotPassword = ({ setEmail, submit, notification }) => (
  <div className="container text-center">
    <div className="logo-404">
      <Link to="/">
        <img src="/img/home/logo.png" alt="" />
      </Link>
    </div>
    <div className="content-404 forgotpass">
      <h1>
        <b>FORGOT PASSWORD</b>
      </h1>
      <span>{notification}</span>
      <label htmlFor="">Email:</label>
      <input
        type="email"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />
      <br />
      <button className="btn btn-default" onClick={() => submit()}>
        Submit
      </button>
      <h2>
        <Link to="/login_register">Trở về trang đăng nhập</Link>
      </h2>
    </div>
  </div>
)
export default ForgotPassword
