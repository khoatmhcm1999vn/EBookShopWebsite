import React from "react"
import { Link } from "react-router-dom"

const Success = ({ notification }) => {
  console.log(notification)
  return (
    <div className="container text-center">
      <div className="logo-404">
        <a href="/">
          <img src="/img/home/logo.png" alt="" />
        </a>
      </div>
      <div className="content-404">
        <h1>
          <b>CONGRATULATIONS!</b>
        </h1>
        <span>{notification}</span>
        <p></p>
        <h2>
          <Link to="/login_register">Bring me back Login Page</Link>
        </h2>
      </div>
    </div>
  )
}

export default Success
