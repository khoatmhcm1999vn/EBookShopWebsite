import React from "react"
import { Link } from "react-router-dom"

import ReCAPTCHA from "react-google-recaptcha"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEnvelope,
  faLock,
  faUser,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons"

import googleLogo from "../../img/google.png"
import facebookLogo from "../../img/facebook.png"
import githubLogo from "../../img/github.png"
import HeaderTop from "../../components/header/header.top"
import HeaderMiddle from "../../components/header/header.middle"
import FooterTop from "../../components/footer/footer.top"
import FooterMiddle from "../../components/footer/footer.middle"
import FooterBottom from "../../components/footer/footer.bottom"
import HeaderBottom from "../header/header.bottom"

const ContentLoginRegister = ({
  setEmailogin,
  setPasswordlogin,
  setUsername,
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
  setCapchaValue,
  history,
  cart
}) => {
  return (
    <div>
      <header id="header">
        <HeaderTop />
        <HeaderMiddle
          islogin={islogin}
          // logout={() => dispatch(logout())}
          history={history}
          cart={cart}
        />
        <HeaderBottom
          isDisabled={true}
          history={history}
          // isActivatedContactPage={true}
        />
      </header>
      <div>
        <div
          className="container"
          style={{ backgroundColor: "transparent!important" }}
        >
          <div className="mb-breadcrumbs">
            <div id="ves-breadcrumbs" className="breadcrumbs hidden-xs">
              <div className="container-inner breadcrumbs">
                <ol className="breadcrumb">
                  <li className="home">
                    <Link to="/" title="Tới trang chủ">
                      Trang chủ
                    </Link>
                    <span>/</span>
                  </li>
                  <li className="active">
                    <strong>Login/Register</strong>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div class="breadcrumbs">
        <ol class="breadcrumb">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li className="active">Login/Register</li>
          <li>&rarr; Login/Register</li>
          <li className="active">&rarr; Forgot Password</li>
        </ol>
      </div> */}
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
                  onChange={e => {
                    setEmailogin(e.target.value)
                  }}
                />
                <label htmlFor="">Password:</label>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={e => {
                    setPasswordlogin(e.target.value)
                  }}
                />
                {/* <Link to="/resend-token">Gửi lại token?</Link>
                <br />
                <br /> */}
                {islogin && islogin ? null : (
                  <Link to="/forgotpass">Quên mật khẩu?</Link>
                )}
                <br />
                <br />
                {islogin && islogin ? null : (
                  <Link to="/">Trở về trang chủ</Link>
                )}
                {/* <Link to="/">Trở về trang chủ</Link> */}
                <br />
                {/* <span>
                <input type="checkbox" className="checkbox" />
                Keep me signed in
              </span> */}
                {islogin && islogin ? (
                  !currentUser.user.is_admin ? (
                    <h3>
                      Bạn đã đăng nhập vui lòng
                      <Link to="/">trở về trang chủ</Link>
                    </h3>
                  ) : (
                    <h3>
                      Bạn đã đăng nhập vui lòng
                      <a href="/dashboard">trở về trang chủ</a>
                    </h3>
                  )
                ) : (
                  <button
                    className="btn btn-default"
                    onClick={() => loginSubmit()}
                  >
                    Login
                  </button>
                )}
                <div className="col-md-6">
                  <div className="mt-5">
                    <a
                      className="btn btn-block social-btn google"
                      href="http://localhost:8080/oauth2/authorize/google"
                    >
                      <img src={googleLogo} alt="google" />
                      Log in with Google
                    </a>
                    <a
                      className="btn btn-block social-btn facebook"
                      href="http://localhost:8080/oauth2/authorize/facebook"
                    >
                      <img src={facebookLogo} alt="facebook" />
                      Log in with Facebook
                    </a>
                    <a
                      className="btn btn-block social-btn github"
                      href="http://localhost:8080/oauth2/authorize/github"
                    >
                      <img src={githubLogo} alt="github" />
                      Log in with Github
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-1">
              <h2 className="or">OR</h2>
            </div>
            <div className="col-sm-4">
              <div className="signup-form">
                <h2>New User Signup!</h2>
                <div className="noti">{notificationRegister}</div>
                <label htmlFor="">User name:</label>
                <input
                  type="text"
                  placeholder="User name"
                  onChange={e => {
                    setUsername(e.target.value)
                  }}
                />
                <label htmlFor="">Email address:</label>
                <input
                  type="email"
                  placeholder="Email address"
                  onChange={e => {
                    setEmail(e.target.value)
                  }}
                />
                <label htmlFor="">First name:</label>
                <input
                  type="text"
                  placeholder="First name"
                  onChange={e => {
                    setFirstname(e.target.value)
                  }}
                />
                <label htmlFor="">Last name:</label>
                <input
                  type="text"
                  placeholder="Last name"
                  onChange={e => {
                    setLastname(e.target.value)
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
                  onChange={e => {
                    setPhone(e.target.value)
                  }}
                />
                <label htmlFor="">Password:</label>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={e => setPassword(e.target.value)}
                />
                <label htmlFor="">Confirm:</label>
                <input
                  type="password"
                  placeholder="Confirm"
                  onChange={e => {
                    setConfirm(e.target.value)
                  }}
                />
                <ReCAPTCHA
                  onChange={setCapchaValue}
                  sitekey="6Lc5cLkZAAAAAN8mFk85HQieB9toPcWFoW0RXCNR"
                />
                <br />
                {islogin && islogin ? (
                  <div key={1} className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title">
                        <a key={1}>
                          Bạn đã đăng nhập vào trang web. Nên không đăng ký
                          được.
                        </a>
                      </h4>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      className="btn btn-default"
                      onClick={() => registerSubmit()}
                    >
                      Signup
                    </button>
                    <br />
                    <Link to="/resend-token">Gửi lại token?</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer id="footer">
        <FooterTop />
        <FooterMiddle />
        <FooterBottom />
      </footer>
    </div>
  )
}

export default ContentLoginRegister
