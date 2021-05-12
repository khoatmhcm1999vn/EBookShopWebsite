import React from "react";
import { Link } from "react-router-dom";

const ContentLoginRegister = ({
  setEmailogin,
  setPasswordlogin,
  setEmail,
  setFirstname,
  setLastname,
  setAddress,
  setPhone,
  setPassword,
  setConfirm,
  notificationRegister,
  notificationLogin,
  registerSubmit,
  loginSubmit,
  islogin,
  currentUser,
}) => (
  <section id="form">
    <div className="container">
      <div className="row">
        <div className="col-sm-4 col-sm-offset-1">
          <div className="login-form">
            <h2>Login to your account</h2>
            <div className="noti">{notificationLogin}</div>
            <label htmlFor="">Email address:</label>
            <input
              type="email"
              placeholder="Email address"
              onChange={(e) => {
                setEmailogin(e.target.value);
              }}
            />
            <label htmlFor="">Password:</label>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPasswordlogin(e.target.value);
              }}
            />
            {islogin && islogin ? null : (
              <Link to="/forgotpass">Quên mật khẩu?</Link>
            )}
            <br />
            <br />
            {islogin && islogin ? null : <Link to="/">Trở về trang chủ</Link>}
            {/* <Link to="/">Trở về trang chủ</Link> */}
            <br />
            {/* <span>
              <input type="checkbox" className="checkbox" />
              Keep me signed in
            </span> */}
            {islogin && islogin ? (
              !currentUser.user.is_admin ? (
                <h3>
                  Bạn đã đăng nhập vui lòng <Link to="/">trở về trang chủ</Link>
                </h3>
              ) : (
                <h3>
                  Bạn đã đăng nhập vui lòng
                  <a href="/dashboard">trở về trang chủ</a>
                </h3>
              )
            ) : (
              <button className="btn btn-default" onClick={() => loginSubmit()}>
                Login
              </button>
            )}
          </div>
        </div>
        <div className="col-sm-1">
          <h2 className="or">OR</h2>
        </div>
        <div className="col-sm-4">
          <div className="signup-form">
            <h2>New User Signup!</h2>
            <div className="noti">{notificationRegister}</div>
            <label htmlFor="">Email address:</label>
            <input
              type="email"
              placeholder="Email address"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <label htmlFor="">First name:</label>
            <input
              type="text"
              placeholder="First name"
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
            />
            <label htmlFor="">Last name:</label>
            <input
              type="text"
              placeholder="Last name"
              onChange={(e) => {
                setLastname(e.target.value);
              }}
            />
            {/* <label htmlFor="">Address:</label>
            <input
              type="text"
              placeholder="Address"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            /> */}
            <label htmlFor="">Phone number:</label>
            <input
              type="number"
              placeholder="Phone number"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
            <label htmlFor="">Password:</label>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="">Confirm:</label>
            <input
              type="password"
              placeholder="Confirm"
              onChange={(e) => {
                setConfirm(e.target.value);
              }}
            />
            {islogin && islogin ? (
              <div key={1} className="panel panel-default">
                <div className="panel-heading">
                  <h4 className="panel-title">
                    <a key={1}>
                      Bạn đã đăng nhập vào trang web. Nên không đăng ký được.
                    </a>
                  </h4>
                </div>
              </div>
            ) : (
              <button
                className="btn btn-default"
                onClick={() => registerSubmit()}
              >
                Signup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
);
export default ContentLoginRegister;
