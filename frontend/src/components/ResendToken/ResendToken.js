import React from "react"
import { Link } from "react-router-dom"

const ResendToken = ({ setEmail, submit, notification }) => (
  <div className="container text-center">
    <div className="logo-404">
      <a href="/">
        <img src="/img/home/logo.png" alt="" />
      </a>
    </div>
    <div className="content-404 forgotpass">
      <h1>
        <b>RESEND TOKEN</b>
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
export default ResendToken
